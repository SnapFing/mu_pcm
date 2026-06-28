// packages/backend/src/middleware/auth.js
'use strict';
const admin = require('firebase-admin');

/**
 * Role hierarchy for content management (linear scale):
 *   editor < admin < super_admin
 *
 * 'secretary', 'prayer_band_leader', 'publicity_secretary' are PEER roles
 * outside this linear scale — they get access via requireAnyRole(), not requireRole().
 */
const ROLE_LEVELS = {
  editor:       1,
  admin:        2,
  super_admin:  3,
};

const roleLevel = (role) => ROLE_LEVELS[role] ?? 0;

/**
 * verifyToken
 * Verifies a Firebase ID token and attaches req.user from admin_users collection.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { db } = require('../firebase');
    const snap = await db.collection('admin_users').doc(decoded.uid).get();

    if (!snap.exists) {
      return res.status(403).json({ error: 'This account is not authorised for the admin portal.' });
    }

    const data = snap.data();
    if (data.active === false) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    req.user = { uid: decoded.uid, email: decoded.email, ...data };
    snap.ref.update({ lastLogin: new Date().toISOString() }).catch(() => {});
    next();
  } catch (err) {
    console.error('[auth] token error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * requireRole(minRole)
 * Enforces a minimum role level from the linear hierarchy (editor → admin → super_admin).
 * Does NOT apply to peer roles (secretary, prayer_band_leader, etc.) — use requireAnyRole for those.
 */
const requireRole = (minRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (roleLevel(req.user.role) < roleLevel(minRole)) {
    return res.status(403).json({
      error: `Requires role '${minRole}' or higher. Your role: '${req.user.role}'`,
    });
  }
  next();
};

/**
 * requireAnyRole(...roles)
 * Allows access if the user has one of the listed roles,
 * OR if their role level is admin+ (admins can do everything).
 */
const requireAnyRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (
    roles.includes(req.user.role) ||
    roleLevel(req.user.role) >= roleLevel('admin')
  ) {
    return next();
  }
  return res.status(403).json({
    error: `Requires one of: ${roles.join(', ')}. Your role: '${req.user.role}'`,
  });
};

// ── Convenience stacks ────────────────────────────────────────────────────
const authenticate      = [verifyToken, requireRole('editor')];
const requireAdmin      = [verifyToken, requireRole('admin')];
const requireSuperAdmin = [verifyToken, requireRole('super_admin')];

module.exports = {
  verifyToken,
  requireRole,
  requireAnyRole,
  authenticate,
  requireAdmin,
  requireSuperAdmin,
};
const admin = require('firebase-admin');

/**
 * ROLES (hierarchy — each level inherits the one below):
 *   super_admin  → full access, manage users & roles
 *   admin        → manage all content, view users
 *   editor       → create / update content, no delete
 */
const ROLES = ['editor', 'admin', 'super_admin'];

const roleLevel = (role) => ROLES.indexOf(role);

/**
 * verifyToken — verifies a Firebase ID token (Bearer) OR the legacy
 * x-admin-token secret (kept for backwards compat during migration).
 * Attaches req.user = { uid, email, role, displayName, active }
 */
const verifyToken = async (req, res, next) => {
  // ── Legacy secret (keep until frontend is migrated to Firebase Auth) ──
  const legacy = req.headers['x-admin-token'];
  const legacySecret = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'mupcm_admin_2026';
  if (legacy && legacy === legacySecret) {
    req.user = {
      uid: 'legacy-admin',
      email: 'admin@system',
      role: 'super_admin',
      displayName: 'System Admin',
      active: true,
    };
    return next();
  }

  // ── Firebase ID token ──────────────────────────────────────────────────
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
      return res.status(403).json({ error: 'User is not registered as an admin' });
    }

    const data = snap.data();
    if (!data.active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    req.user = { uid: decoded.uid, email: decoded.email, ...data };

    // Refresh lastLogin (fire-and-forget)
    snap.ref.update({ lastLogin: new Date().toISOString() }).catch(() => {});

    next();
  } catch (err) {
    console.error('[auth] token error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * requireRole(minRole) — express middleware that enforces a minimum role.
 * Must be used AFTER verifyToken.
 *
 * Usage:
 *   router.delete('/:id', verifyToken, requireRole('admin'), handler)
 */
const requireRole = (minRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (roleLevel(req.user.role) < roleLevel(minRole)) {
    return res.status(403).json({
      error: `Requires role '${minRole}' or higher. Your role: '${req.user.role}'`,
    });
  }
  next();
};

// ── Convenience stacks ────────────────────────────────────────────────────
/** Any registered admin (editor+) */
const authenticate = [verifyToken, requireRole('editor')];

/** Admin or super_admin */
const requireAdmin = [verifyToken, requireRole('admin')];

/** Super admin only */
const requireSuperAdmin = [verifyToken, requireRole('super_admin')];

module.exports = {
  verifyToken,
  requireRole,
  authenticate,       // editor+
  requireAdmin,       // admin+
  requireSuperAdmin,  // super_admin only
};

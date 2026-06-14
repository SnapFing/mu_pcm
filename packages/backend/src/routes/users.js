const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { db } = require('../firebase');
const { verifyToken, requireRole, requireSuperAdmin } = require('../middleware/auth');

const COL = 'admin_users';

/**
 * GET /api/users
 * List all admin users. Requires admin+.
 */
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('createdAt', 'desc').get();
    const users = snap.docs.map((d) => {
      const { uid, email, displayName, role, active, createdAt, lastLogin, createdBy } = d.data();
      return { id: d.id, uid, email, displayName, role, active, createdAt, lastLogin, createdBy };
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/users/me
 * Return the calling user's own profile.
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.user.uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'Profile not found' });
    const { uid, email, displayName, role, active, createdAt, lastLogin } = doc.data();
    res.json({ id: doc.id, uid, email, displayName, role, active, createdAt, lastLogin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/users/invite
 * Invite a new admin user by email. Requires super_admin.
 * Body: { email, displayName, role }
 *
 * Creates a Firebase Auth account with a random password (user must
 * reset via email), then records the admin_users document.
 */
router.post('/invite', ...requireSuperAdmin, async (req, res) => {
  const { email, displayName, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'email and role are required' });
  }

  const VALID_ROLES = ['editor', 'admin', 'super_admin'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
  }

  try {
    // Create Firebase Auth user (they'll reset their password via email)
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        displayName: displayName || email,
        emailVerified: false,
      });
    }

    const uid = userRecord.uid;

    // Upsert the admin_users document
    await db.collection(COL).doc(uid).set(
      {
        uid,
        email,
        displayName: displayName || email,
        role,
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
        lastLogin: null,
      },
      { merge: true }
    );

    // Send password-reset email so they can log in
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: 'https://mu-pcm.vercel.app/admin-portal',
      handleCodeInApp: true,
    });

    res.status(201).json({
      id: uid,
      email,
      role,
      message: 'User invited. Send them the reset link to set their password.',
      resetLink, // in production, email this rather than returning it
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/users/:uid/role
 * Change a user's role. Requires super_admin.
 * Body: { role }
 * A super_admin cannot downgrade their own role.
 */
router.patch('/:uid/role', ...requireSuperAdmin, async (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;

  const VALID_ROLES = ['editor', 'admin', 'super_admin'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
  }

  if (uid === req.user.uid) {
    return res.status(400).json({ error: 'You cannot change your own role' });
  }

  try {
    const doc = await db.collection(COL).doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    await doc.ref.update({ role, updatedAt: new Date().toISOString(), updatedBy: req.user.uid });
    res.json({ success: true, uid, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/users/:uid/status
 * Activate or deactivate an account. Requires super_admin.
 * Body: { active: true | false }
 */
router.patch('/:uid/status', ...requireSuperAdmin, async (req, res) => {
  const { uid } = req.params;
  const { active } = req.body;

  if (typeof active !== 'boolean') {
    return res.status(400).json({ error: '`active` must be a boolean' });
  }
  if (uid === req.user.uid) {
    return res.status(400).json({ error: 'You cannot deactivate your own account' });
  }

  try {
    const doc = await db.collection(COL).doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    await doc.ref.update({ active, updatedAt: new Date().toISOString(), updatedBy: req.user.uid });

    // Also disable/enable in Firebase Auth
    await admin.auth().updateUser(uid, { disabled: !active });

    res.json({ success: true, uid, active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/users/:uid
 * Permanently remove a user. Requires super_admin.
 * Cannot delete yourself.
 */
router.delete('/:uid', ...requireSuperAdmin, async (req, res) => {
  const { uid } = req.params;

  if (uid === req.user.uid) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }

  try {
    await db.collection(COL).doc(uid).delete();
    await admin.auth().deleteUser(uid).catch(() => {}); // best-effort
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
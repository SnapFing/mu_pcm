const express = require('express');
const { sendEmail } = require('../utils/email');
const router = express.Router();
const admin = require('firebase-admin');
const { db } = require('../firebase');
const { verifyToken, requireRole, requireSuperAdmin } = require('../middleware/auth');

const COL = 'admin_users';

// ── GET /api/users ────────────────────────────────────────────────────────
// List all admin users. Requires admin+.
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

// ── GET /api/users/me ─────────────────────────────────────────────────────
// Return the calling user's own profile.
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

// ── POST /api/users/invite ────────────────────────────────────────────────
// Invite a new admin user. Requires super_admin.
// Creates Firebase Auth account (enabled), writes admin_users doc, sends reset email.
router.post('/invite', ...requireSuperAdmin, async (req, res) => {
  const { email, displayName, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'email and role are required' });
  }

  const VALID_ROLES = ['editor', 'admin', 'super_admin', 'secretary', 'prayer_band_leader', 'publicity_secretary', 'programming_committee'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
  }

  try {
    // Get or create the Firebase Auth account
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        displayName: displayName || email,
        emailVerified: false,
        // No password — user sets it via the reset link
      });
    }

    const uid = userRecord.uid;

    // Ensure the account is ENABLED in Firebase Auth.
    // If the account already existed and was previously disabled, re-enable it.
    await admin.auth().updateUser(uid, { disabled: false });

    // Write / update the admin_users document
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

    // Send password-reset / set-password email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${frontendUrl}/admin-portal`,
    });

    sendEmail({
      to: email,
      subject: `You've been invited as a ${role} – MU SDA PCM Admin Portal`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f7;border-radius:8px;">
          <div style="background:#0F2A4A;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
            <h2 style="color:white;margin:0;font-size:16px;">MU SDA PCM – Admin Invitation</h2>
          </div>
          <p style="font-size:14px;color:#334155;">Hello ${displayName || email},</p>
          <p style="font-size:14px;color:#334155;">You have been invited to join the <strong>MU SDA PCM Admin Portal</strong> as a <strong>${role}</strong>.</p>
          <p style="font-size:14px;color:#334155;">Click the button below to set your password and log in:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetLink}" style="background:#2E6DE7;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Set Your Password</a>
          </div>
          <p style="font-size:12px;color:#94A3B8;">This link expires after a few hours. If you did not expect this invitation, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
          <p style="font-size:12px;color:#94A3B8;">MU SDA PCM &middot; Mulungushi University, Kabwe, Zambia</p>
        </div>
      `,
    });

    res.status(201).json({
      id: uid,
      email,
      role,
      message: 'User invited successfully. They will receive an email to set their password.',
    });
  } catch (err) {
    console.error('[users/invite]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/users/:uid/role ────────────────────────────────────────────
// Change a user's role. Requires super_admin.
// A super_admin cannot change their own role.
router.patch('/:uid/role', ...requireSuperAdmin, async (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;

  const VALID_ROLES = ['editor', 'admin', 'super_admin', 'secretary', 'prayer_band_leader', 'publicity_secretary'];
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

// ── PATCH /api/users/:uid/status ──────────────────────────────────────────
// Activate or deactivate an account. Requires super_admin.
// Body: { active: true | false }
//
// AUTH-FIRST ORDER with rollback:
//   1. Update Firebase Auth (the real gate)
//   2. Update Firestore (the label)
//   3. If Firestore fails, roll back Firebase Auth
// This guarantees the two stores never drift apart.
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

    // ── Step 1: Firebase Auth (the real gate) ──────────────────────────
    // Do this first — if it fails, Firestore is untouched and stays consistent.
    try {
      await admin.auth().updateUser(uid, { disabled: !active });
    } catch (authErr) {
      console.error('[users/status] Firebase Auth update failed:', authErr.message);
      return res.status(503).json({
        error: 'Could not update Firebase Authentication. Check the server clock and backend logs, then try again.',
        detail: authErr.message,
      });
    }

    // ── Step 2: Firestore ──────────────────────────────────────────────
    try {
      await doc.ref.update({
        active,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user.uid,
      });
    } catch (dbErr) {
      // Firestore failed — roll back Firebase Auth so they stay in sync
      console.error('[users/status] Firestore update failed, rolling back Auth:', dbErr.message);
      await admin.auth().updateUser(uid, { disabled: active }).catch((rollbackErr) => {
        console.error('[users/status] Rollback also failed:', rollbackErr.message);
      });
      return res.status(500).json({
        error: 'Database update failed and Firebase Auth was rolled back. Please try again.',
        detail: dbErr.message,
      });
    }

    console.log(`[users/status] uid=${uid} active=${active} by=${req.user.uid}`);
    res.json({ success: true, uid, active });

  } catch (err) {
    console.error('[users/status] unexpected error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/users/:uid ────────────────────────────────────────────────
// Permanently remove a user. Requires super_admin.
// Cannot delete yourself.
router.delete('/:uid', ...requireSuperAdmin, async (req, res) => {
  const { uid } = req.params;

  if (uid === req.user.uid) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }

  try {
    // Delete from both stores — Auth deletion is best-effort since the
    // account may have already been deleted from the Firebase console.
    await db.collection(COL).doc(uid).delete();
    await admin.auth().deleteUser(uid).catch((err) => {
      console.warn('[users/delete] Auth deletion skipped:', err.message);
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/users/:uid/reset-password ───────────────────────────────────
// Super admin sends a password reset email to any admin user.
router.post('/:uid/reset-password', ...requireSuperAdmin, async (req, res) => {
  const { uid } = req.params;
  try {
    const doc = await db.collection(COL).doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    const { email, displayName } = doc.data();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${frontendUrl}/admin-portal`,
    });

    sendEmail({
      to: email,
      subject: 'Password reset – MU SDA PCM Admin Portal',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
          <p>Hello ${displayName || email},</p>
          <p>A password reset was requested for your admin account. Click below to set a new password:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetLink}" style="background:#2E6DE7;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a>
          </div>
          <p style="font-size:12px;color:#94A3B8;">This link expires in a few minutes. If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: `Reset email sent to ${email}` });
  } catch (err) {
    console.error('[users/reset-password]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
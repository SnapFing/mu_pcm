const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebase');
const { verifyToken, requireAnyRole } = require('../middleware/auth');

// ── Health-check helper ───────────────────────────────────────────────────
// Pings Google's token endpoint to verify the Admin SDK credential is live.
// Call this before any route that relies on admin.auth() calls.
async function checkAdminSdkHealth() {
  try {
    // getUser on a known-bad UID will still exercise the credential path;
    // any error OTHER than "user not found" means the SDK is down.
    await admin.auth().getUser('__health_check__');
  } catch (err) {
    if (err.code === 'auth/user-not-found') return; // credential is fine
    if (err.message && err.message.includes('OAuth2')) {
      throw new Error(
        'The server credentials have expired. Please restart the backend and sync the system clock.'
      );
    }
    // Other errors (network blip etc.) — surface them clearly
    if (err.message && err.message.includes('fetch')) {
      throw new Error(
        'The backend cannot reach Google APIs. Check your internet connection and restart the server.'
      );
    }
    throw err; // unknown — rethrow
  }
}

// ── POST / — Student self-registration ────────────────────────────────────
router.post('/', async (req, res) => {
  let uid = null;

  try {
    // 1. Verify the Firebase ID token from the client
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const idToken = authHeader.split('Bearer ')[1];

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (tokenErr) {
      // Distinguish credential failure from bad token
      if (
        tokenErr.message?.includes('OAuth2') ||
        tokenErr.message?.includes('fetch')
      ) {
        return res.status(503).json({
          error:
            'The server is temporarily unavailable — please try again in a moment.',
          code: 'credential_error',
        });
      }
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    uid = decoded.uid;

    // 2. Disable the account immediately so they cannot log in until approved
    await admin.auth().updateUser(uid, { disabled: true });

    // 3. Write the Firestore student document
    const {
      name, studentId, department, year, phone,
      category, initialBand, homeAddress, churchName,
      hostel, roomNumber, locality,
    } = req.body;

    await db.collection('students').doc(uid).set(
      {
        email:       decoded.email,
        name:        name        || '',
        studentId:   studentId   || '',
        department:  department  || '',
        year:        year        || '',
        phone:       phone       || '',
        category:    category    || 'Ordinary',
        joinedBands: initialBand ? [initialBand] : [],
        homeAddress: (homeAddress || '').trim().slice(0, 300),
        churchName:  (churchName  || '').trim().slice(0, 160),
        hostel:      (hostel      || '').trim().slice(0, 120),
        roomNumber:  (roomNumber  || '').trim().slice(0, 60),
        locality:    (locality    || '').trim().slice(0, 200),
        status:      'pending',
        createdAt:   new Date().toISOString(),
      },
      { merge: true }
    );

    // 4. Notify admin (fire-and-forget — don't let email failure block response)
    try {
      const { sendEmail } = require('../utils/email');
      const notifyEmail = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;
      if (notifyEmail) {
        sendEmail({
          to: notifyEmail,
          subject: `🆕 New student registration – ${name}`,
          html: `<p>${name} (${decoded.email}) has registered and is waiting for approval.</p>`,
        });
      }
    } catch (emailErr) {
      console.warn('[students] admin notify email failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Registration pending approval' });

  } catch (err) {
    console.error('[students] registration error:', err.message);

    // If we created the Firebase Auth user but then failed, delete it
    // so the student can try again with the same email.
    if (uid) {
      try {
        await admin.auth().deleteUser(uid);
        console.log('[students] cleaned up orphan Auth user:', uid);
      } catch (cleanupErr) {
        console.warn('[students] cleanup failed for uid:', uid, cleanupErr.message);
      }
    }

    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// ── GET /me — student self-profile ────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const doc = await db.collection('students').doc(decoded.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /admin — list all students (optionally filter by status) ──────────
router.get('/admin', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  try {
    const snap = await db.collection('students').orderBy('createdAt', 'desc').limit(200).get();
    let students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const { status } = req.query;
    if (status) students = students.filter(s => s.status === status);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /:uid/approve — approve a student ────────────────────────────────
router.post('/:uid/approve', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  try {
    const { uid } = req.params;

    // Enable Firebase Auth account
    await admin.auth().updateUser(uid, { disabled: false });

    // Update Firestore
    await db.collection('students').doc(uid).update({
      status:     'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: req.user.uid,
    });

    // Send welcome email (fire-and-forget)
    try {
      const studentDoc = await db.collection('students').doc(uid).get();
      const student = studentDoc.data();
      if (student?.email) {
        const { sendEmail } = require('../utils/email');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        sendEmail({
          to: student.email,
          subject: '🎉 Your MU SDA PCM account has been approved!',
          html: `<p>Dear ${student.name},</p>
                 <p>Your account has been approved. You can now log in at
                 <a href="${frontendUrl}/login">${frontendUrl}/login</a>.</p>
                 <p>Welcome to the community!</p>`,
        });
      }
    } catch (emailErr) {
      console.warn('[students] welcome email failed:', emailErr.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[students] approve error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /:uid — reject / delete student ────────────────────────────────
router.delete('/:uid', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  try {
    const { uid } = req.params;
    await admin.auth().deleteUser(uid).catch(() => {}); // ignore if already deleted
    await db.collection('students').doc(uid).delete();
    res.json({ success: true });
  } catch (err) {
    console.error('[students] delete error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /register — full approved member register ─────────────────────────
router.get('/register', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  try {
    const snap = await db.collection('students').orderBy('name', 'asc').limit(500).get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/students/:uid/freeze ──────────────────────────────────────
// Admin/secretary: freeze (disable) or unfreeze (enable) an approved student.
// Body: { disabled: true | false }
router.patch('/:uid/freeze', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  const { uid } = req.params;
  const { disabled } = req.body;

  if (typeof disabled !== 'boolean') {
    return res.status(400).json({ error: '`disabled` must be a boolean' });
  }

  try {
    // Auth first — if this fails, Firestore stays clean
    await admin.auth().updateUser(uid, { disabled });

    await db.collection('students').doc(uid).update({
      frozen: disabled,
      frozenAt: new Date().toISOString(),
      frozenBy: req.user.uid,
      // Keep status as 'approved' — frozen is a separate flag
    });

    res.json({ success: true, uid, disabled });
  } catch (err) {
    console.error('[students/freeze]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
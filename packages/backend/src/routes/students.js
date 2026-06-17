const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Disable the account until admin approves
    await admin.auth().updateUser(uid, { disabled: true });

    const { name, studentId, department, year, phone, category, initialBand } = req.body;
    await db.collection('students').doc(uid).set(
      {
        email: decoded.email,
        name: name || '',
        studentId: studentId || '',
        department: department || '',
        year: year || '',
        phone: phone || '',
        category: category || 'Ordinary',
        joinedBands: initialBand ? [initialBand] : [],
        status: 'pending',               // ← NEW
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Notify admin (optional)
    const { sendEmail } = require('../utils/email');
    const notifyEmail = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;
    if (notifyEmail) {
      sendEmail({
        to: notifyEmail,
        subject: `🆕 New student registration – ${name}`,
        html: `<p>${name} (${decoded.email}) has registered and is waiting for approval.</p>`,
      });
    }

    res.json({ success: true, message: 'Registration pending approval' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/me – get current student profile (for personalized dashboard)
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

// ── Admin: list all students (or filter by status) ──────────────────────────
router.get('/admin', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const snap = await db.collection('students').orderBy('createdAt', 'desc').limit(200).get();
    let students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const { status } = req.query;
    if (status) {
      students = students.filter(s => s.status === status);
    }
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: approve a student ────────────────────────────────────────────────
router.post('/:uid/approve', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const uid = req.params.uid;
    // Enable Firebase Auth user
    await admin.auth().updateUser(uid, { disabled: false });
    // Update Firestore status
    await db.collection('students').doc(uid).update({
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: req.user.uid,
    });
    // Send welcome email
    const studentDoc = await db.collection('students').doc(uid).get();
    const student = studentDoc.data();
    if (student && student.email) {
      const { sendEmail } = require('../utils/email');
      sendEmail({
        to: student.email,
        subject: '🎉 Your MU SDA PCM account has been approved!',
        html: `<p>Dear ${student.name},</p>
               <p>Your account has been approved. You can now log in at <a href="https://mupcm.vercel.app/login">mupcm.vercel.app/login</a>.</p>
               <p>Welcome to the community!</p>`,
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: reject / delete student ─────────────────────────────────────────
router.delete('/:uid', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const uid = req.params.uid;
    // Delete Firebase Auth user
    await admin.auth().deleteUser(uid).catch(() => {});
    // Delete Firestore document
    await db.collection('students').doc(uid).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
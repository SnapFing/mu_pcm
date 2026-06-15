const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebase');

// POST /api/students – create or update student profile
router.post('/', async (req, res) => {
  try {
    // Verify the Firebase ID token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const { name, studentId, department, year, phone } = req.body;
    await db.collection('students').doc(uid).set(
      {
        email: decoded.email,
        name: name || '',
        studentId: studentId || '',
        department: department || '',
        year: year || '',
        phone: phone || '',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    res.json({ success: true });
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

module.exports = router;
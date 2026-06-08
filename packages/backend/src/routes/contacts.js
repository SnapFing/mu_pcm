const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');
const { publicSubmitLimiter } = require('../middleware/rateLimit');

const COL = 'contacts';

// Public — anyone can submit a contact message
router.post('/', publicSubmitLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, date } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Message must be at least 5 characters.' });
    }

    const doc = await db.collection(COL).add({
      name: name.trim().slice(0, 120),
      email: email.trim().slice(0, 160),
      subject: typeof subject === 'string' ? subject.trim().slice(0, 160) : '',
      message: message.trim().slice(0, 3000),
      date: date || new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      status: 'Unread',
    });
    res.status(201).json({ id: doc.id, message: 'Message received!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin+ only — replaces the old manual x-admin-token check
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('submittedAt', 'desc').limit(200).get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');
const { publicSubmitLimiter } = require('../middleware/rateLimit');

const COL = 'prayers';

// Public — anyone can submit, rate-limited to 10/15min per IP
router.post('/', publicSubmitLimiter, async (req, res) => {
  try {
    const { name, category, request, anonymous, date } = req.body;
    if (!request || typeof request !== 'string' || request.trim().length < 5) {
      return res.status(400).json({ error: 'Prayer request must be at least 5 characters.' });
    }
    const doc = await db.collection(COL).add({
      name: anonymous ? 'Anonymous' : (name || 'Anonymous'),
      category: category || 'General',
      request: request.trim().slice(0, 2000), // cap length
      anonymous: !!anonymous,
      date: date || new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      status: 'Unread',
    });
    res.status(201).json({ id: doc.id, message: 'Prayer request received' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin+ — prayer inbox is private
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
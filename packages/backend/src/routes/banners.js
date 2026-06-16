const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

const COL = 'banners';

// Public — landing page reads this
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('order', 'asc').get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, requireRole('editor'), async (req, res) => {
  try {
    const doc = await db.collection(COL).add({
      ...req.body,
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    });
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, requireRole('editor'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

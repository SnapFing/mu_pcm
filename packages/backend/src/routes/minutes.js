const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireAnyRole } = require('../middleware/auth');

const COL = 'meeting_minutes';

// GET all minutes (admin + secretary)
router.get('/', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('meetingDate', 'desc').limit(200).get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
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

// PUT update
router.put('/:id', verifyToken, requireAnyRole('admin', 'secretary'), async (req, res) => {
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

// DELETE (admin only)
router.delete('/:id', verifyToken, requireAnyRole('admin'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
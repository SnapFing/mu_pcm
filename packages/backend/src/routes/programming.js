/**
 * /api/programming
 *
 * Private workspace for the Programming Committee — strategic plan notes
 * and a draft schedule of who's presenting when. Nothing here is public;
 * every route requires admin or programming_committee.
 *
 * A "plan" document shape:
 * {
 *   title: string,
 *   termLabel: string,           e.g. "Semester 1, 2026"
 *   notes: string,                free-text strategic plan
 *   schedule: [
 *     { id, band, date, presenter, standardsConfirmed: boolean }
 *   ],
 *   createdAt, createdBy, updatedAt, updatedBy
 * }
 */
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireAnyRole } = require('../middleware/auth');

const COL = 'programming_plans';
const guard = requireAnyRole('admin', 'programming_committee');

router.get('/', verifyToken, guard, async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('createdAt', 'desc').get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', verifyToken, guard, async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', verifyToken, guard, async (req, res) => {
  try {
    const doc = await db.collection(COL).add({
      ...req.body,
      schedule: Array.isArray(req.body.schedule) ? req.body.schedule : [],
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    });
    res.status(201).json({ id: doc.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', verifyToken, guard, async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', verifyToken, guard, async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
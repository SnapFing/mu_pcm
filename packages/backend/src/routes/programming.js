const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireAnyRole } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const COL = 'programming_plans';
const guard = requireAnyRole('admin', 'programming_committee');

// ── GET all plans ─────────────────────────────────────────────────────────
router.get('/', verifyToken, guard, async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('createdAt', 'desc').get();
    const plans = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET single plan ──────────────────────────────────────────────────────
router.get('/:id', verifyToken, guard, async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST create a plan ──────────────────────────────────────────────────
router.post('/', verifyToken, guard, async (req, res) => {
  try {
    const { title, termLabel, notes, schedule } = req.body;
    const newPlan = {
      title: title || 'Untitled Plan',
      termLabel: termLabel || '',
      notes: notes || '',
      schedule: Array.isArray(schedule) ? schedule : [],
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    };
    const docRef = await db.collection(COL).add(newPlan);
    res.status(201).json({ id: docRef.id, ...newPlan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT update a plan ───────────────────────────────────────────────────
router.put('/:id', verifyToken, guard, async (req, res) => {
  try {
    const { title, termLabel, notes, schedule } = req.body;
    await db.collection(COL).doc(req.params.id).update({
      title,
      termLabel,
      notes,
      schedule,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE a plan ──────────────────────────────────────────────────────
router.delete('/:id', verifyToken, guard, async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /:id/notify – send email to a presenter ─────────────────────────
router.post('/:id/notify', verifyToken, guard, async (req, res) => {
  try {
    const { rowId } = req.body;
    const ref = db.collection(COL).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Plan not found' });

    const plan = doc.data();
    const schedule = plan.schedule || [];
    const row = schedule.find(r => r.id === rowId);
    if (!row) return res.status(404).json({ error: 'Schedule row not found' });
    if (!row.presenterEmail) return res.status(400).json({ error: 'No presenter email on this row' });

    await sendEmail({
      to: row.presenterEmail,
      subject: `You're scheduled — ${row.band} on ${row.date}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
          <p>Hello ${row.presenter || 'there'},</p>
          <p>You've been scheduled for <strong>${row.band}</strong> on <strong>${row.date}</strong>${plan.termLabel ? ` (${plan.termLabel})` : ''}.</p>
          ${plan.notes ? `<p style="color:#64748B;font-size:13px;">Programming notes: ${plan.notes}</p>` : ''}
          <p style="font-size:12px;color:#94A3B8;">MU SDA PCM Programming Committee</p>
        </div>
      `,
    });

    const updatedSchedule = schedule.map(r =>
      r.id === rowId ? { ...r, notifiedAt: new Date().toISOString() } : r
    );
    await ref.update({ schedule: updatedSchedule, updatedAt: new Date().toISOString(), updatedBy: req.user.uid });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
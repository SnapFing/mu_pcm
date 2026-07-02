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

import requestJson from /utils/requestJson

const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireAnyRole } = require('../middleware/auth');

const COL = 'programming_plans';
const guard = requireAnyRole('admin', 'programming_committee');

const [notifying, setNotifying] = useState(null);

const notifyPresenter = async (plan, row) => {
  setNotifying(row.id);
  try {
    const result = await requestJson(`${API}/api/programming/${plan.id}/notify`, {
      method: 'POST',
      body: JSON.stringify({ rowId: row.id }),
    });
    if (result?.ok) {
      showToast(`Notified ${row.presenter}`);
      // reflect notifiedAt locally without a full reload
      updateRow(row.id, 'notifiedAt', new Date().toISOString());
      await update({ ...plan, schedule: plan.schedule.map(r => r.id === row.id ? { ...r, notifiedAt: new Date().toISOString() } : r) });
    } else {
      showToast(result?.error || 'Could not send notification.', false);
    }
  } finally {
    setNotifying(null);
  }
};

const { sendEmail } = require('../utils/email');

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
  } catch (err) { res.status(500).json({ error: err.message }); }
});

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
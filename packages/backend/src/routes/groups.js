const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

const COL = 'groups';

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('name', 'asc').get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', verifyToken, requireRole('editor'), async (req, res) => {
  try {
    const doc = await db.collection(COL).add({
      ...req.body,
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    });
    res.status(201).json({ id: doc.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', verifyToken, requireRole('editor'), async (req, res) => {
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

// ── Public: submit a join request ─────────────────────────────────────────
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, studentId, email, year, motivation, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // Fetch the group to get its name for the email
    const groupDoc = await db.collection(COL).doc(id).get();
    if (!groupDoc.exists) return res.status(404).json({ error: 'Group not found' });
    const group = groupDoc.data();

    const joinRequest = {
      groupId: id,
      groupName: group.name,
      name: name.trim().slice(0, 120),
      studentId: (studentId || '').trim().slice(0, 60),
      email: email.trim().slice(0, 160),
      year: (year || '').trim().slice(0, 60),
      phone: (phone || '').trim().slice(0, 30),
      motivation: (motivation || '').trim().slice(0, 1000),
      status: 'New',
      submittedAt: new Date().toISOString(),
    };

    const ref = await db.collection('group_join_requests').add(joinRequest);

    // Notify admin / group leader
    const { sendEmail } = require('../utils/email');
    const notifyEmail = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER || 'mulungushisdapcmpublicity@gmail.com';

    sendEmail({
      to: notifyEmail,
      subject: `👥 New join request for ${group.name}`,
      html: `
        <h3>${name} wants to join ${group.name}</h3>
        <table>
          <tr><td>Email:</td><td>${email}</td></tr>
          ${studentId ? `<tr><td>Student ID:</td><td>${studentId}</td></tr>` : ''}
          ${year ? `<tr><td>Year:</td><td>${year}</td></tr>` : ''}
          ${phone ? `<tr><td>Phone:</td><td>${phone}</td></tr>` : ''}
        </table>
        <p><strong>Motivation:</strong><br>${motivation || 'N/A'}</p>
        ${phone ? `<p><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}">Chat on WhatsApp</a></p>` : ''}
        <p><a href="https://mupcm.vercel.app/admin-portal">View in Admin Portal</a></p>
      `,
    });

    res.status(201).json({ id: ref.id, message: 'Join request submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all join requests
router.get('/requests/all', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const snap = await db.collection('group_join_requests').orderBy('submittedAt', 'desc').limit(200).get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
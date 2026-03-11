const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authenticate } = require('../middleware/auth');
const COL = 'contacts';
router.post('/', async (req, res) => {
  try { const doc = await db.collection(COL).add({...req.body,submittedAt:new Date().toISOString(),status:'Unread'}); res.status(201).json({id:doc.id,message:'Message received!'}); }
  catch(err){ res.status(500).json({error:err.message}); }
});
router.get('/', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    const isAdmin = token && token === process.env.ADMIN_SECRET;
    const snap = await db.collection(COL).orderBy('submittedAt','desc').get();
    const all = snap.docs.map(d=>({id:d.id,...d.data()}));
    res.json(isAdmin ? all : []);
  } catch(err){ res.status(500).json({error:err.message}); }
});
router.put('/:id', authenticate, async (req, res) => {
  try { await db.collection(COL).doc(req.params.id).update({...req.body,updatedAt:new Date().toISOString()}); res.json({success:true}); }
  catch(err){ res.status(500).json({error:err.message}); }
});
router.delete('/:id', authenticate, async (req, res) => {
  try { await db.collection(COL).doc(req.params.id).delete(); res.json({success:true}); }
  catch(err){ res.status(500).json({error:err.message}); }
});
module.exports = router;

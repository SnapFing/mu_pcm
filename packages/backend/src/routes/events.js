const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authenticate } = require('../middleware/auth');
const COL = 'events';
router.get('/', async (req, res) => {
  try { const snap = await db.collection(COL).orderBy('createdAt','desc').get(); res.json(snap.docs.map(d=>({id:d.id,...d.data()}))); }
  catch(err){ res.status(500).json({error:err.message}); }
});
router.get('/:id', async (req, res) => {
  try { const doc = await db.collection(COL).doc(req.params.id).get(); if(!doc.exists) return res.status(404).json({error:'Not found'}); res.json({id:doc.id,...doc.data()}); }
  catch(err){ res.status(500).json({error:err.message}); }
});
router.post('/', authenticate, async (req, res) => {
  try { const doc = await db.collection(COL).add({...req.body,createdAt:new Date().toISOString()}); res.status(201).json({id:doc.id}); }
  catch(err){ res.status(500).json({error:err.message}); }
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

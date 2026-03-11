const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { 
    const doc = await db.collection('about').doc('main').get(); if(!doc.exists) return res.json({}); res.json({id:doc.id,...doc.data()}); 
  }
  catch(err){ 
    res.status(500).json({error:err.message}); 
  }
});

router.put('/', authenticate, async (req, res) => {
  try { 
    await db.collection('about').doc('main').set({...req.body,updatedAt:new Date().toISOString()},{merge:true}); res.json({success:true}); 
  }
  catch(err){ 
    res.status(500).json({error:err.message}); 
  }
});
module.exports = router;

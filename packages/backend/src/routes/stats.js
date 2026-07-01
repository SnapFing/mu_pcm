// routes/stats.js
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Set this to whenever the ministry actually started
const FOUNDING_YEAR = 2018;

// live collection of numbers 
router.get('/', async (req, res) => {
  try {
    const [studentsSnap, groupsSnap, eventsSnap] = await Promise.all([
      db.collection('students').count().get(),  
      db.collection('groups').count().get(),
      db.collection('events').count().get(),
    ]);

    const currentYear = new Date().getFullYear();

    res.json({
      members: studentsSnap.data().count,
      groups: groupsSnap.data().count,
      events: eventsSnap.data().count,
      ministryYears: Math.max(1, currentYear - FOUNDING_YEAR),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
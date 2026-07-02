require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
}));
app.use(express.json());

// ── Health ────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'MU SDA PCM Backend alive!', time: new Date().toISOString() });
});

// ── Clock-sync endpoint ───────────────────────────────────────────────────
// Call POST /api/admin/clock-sync from your dev machine after the PC wakes
// from sleep to re-sync WSL2's clock without restarting the process.
// Protected by a shared secret so it's not publicly exploitable.
app.post('/api/admin/clock-sync', (req, res) => {
  const secret = process.env.ADMIN_SECRET || 'mupcm-dev';
  if (req.headers['x-admin-token'] !== secret) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    execSync('sudo hwclock --hctosys 2>/dev/null || sudo ntpdate -u time.windows.com 2>/dev/null || true');
    console.log('[clock-sync] WSL2 clock synced at', new Date().toISOString());
    res.json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/journals',      require('./routes/journals'));
app.use('/api/media',         require('./routes/media'));
app.use('/api/heroes',        require('./routes/heroes'));
app.use('/api/banners',       require('./routes/banners'));
app.use('/api/groups',        require('./routes/groups'));
app.use('/api/resources',     require('./routes/resources'));
app.use('/api/prayers',       require('./routes/prayers'));
app.use('/api/contacts',      require('./routes/contacts'));
app.use('/api/about',         require('./routes/about'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/minutes',       require('./routes/minutes'));
app.use('/api/students',      require('./routes/students'));
app.use('/api/uploads',       require('./routes/uploads')); 
app.use('/api/stats',         require('./routes/stats'));
app.use('/api/programming',   require('./routes/programming'));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
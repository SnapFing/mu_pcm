require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Health ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'MU SDA PCM Backend alive! 🙏', time: new Date().toISOString() });
});

// ── Public / mixed routes ───────────────────────────────────────────────
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/journals',      require('./routes/journals'));
app.use('/api/media',         require('./routes/media'));
app.use('/api/heroes',        require('./routes/heroes'));
app.use('/api/groups',        require('./routes/groups'));
app.use('/api/resources',     require('./routes/resources'));
app.use('/api/about',         require('./routes/about'));

// ── Submit-only public routes ───────────────────────────────────────────
app.use('/api/prayers',       require('./routes/prayers'));
app.use('/api/contacts',      require('./routes/contacts'));

// ── Admin-only routes ───────────────────────────────────────────────────
app.use('/api/users',         require('./routes/users'));

// ── 404 fallback ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[global error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Local dev server (not used on Vercel) ────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;

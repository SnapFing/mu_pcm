require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ─────────────────────────────────────────────────────────────────
// CORS_ORIGIN must be set in Vercel environment variables to your
// frontend domain, e.g. https://mu-pcm.vercel.app
// Falling back to true only in local development (NODE_ENV !== 'production')
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN
  : process.env.NODE_ENV === 'production'
    ? false   // block all cross-origin in prod if var is missing
    : true;   // allow all in local dev

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
}));
app.use(express.json({ limit: '10mb' })); // explicit body size limit

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
app.use('/api/uploads',       require('./routes/uploads'));
app.use('/api/students',      require('./routes/students'));

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


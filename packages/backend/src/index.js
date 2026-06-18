require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','x-admin-token'] }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'MU SDA PCM Backend alive! ', time: new Date().toISOString() });
});

app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/journals',      require('./routes/journals'));
app.use('/api/media',         require('./routes/media'));
app.use('/api/heroes',        require('./routes/heroes'));
app.use('/api/groups',        require('./routes/groups'));
app.use('/api/resources',     require('./routes/resources'));
app.use('/api/prayers',       require('./routes/prayers'));
app.use('/api/contacts',      require('./routes/contacts'));
app.use('/api/about',         require('./routes/about'));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

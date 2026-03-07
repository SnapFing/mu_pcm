require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'MU SDA PCM Backend alive! 🙏', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Test: http://localhost:5000/api/health');
});
// Force IPv4 at socket level
const https = require('https');
const http  = require('http');
https.globalAgent = new https.Agent({ family: 4 });
http.globalAgent  = new http.Agent({ family: 4 });

const admin = require('firebase-admin');
const path  = require('path');
const { readFileSync } = require('fs');

// ── Guard against double-initialisation (hot-reload / Vercel warm starts) ──
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(path.resolve(__dirname, '../config/serviceAccount.json'), 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId:  serviceAccount.project_id,
  });
}

const db = admin.firestore();

module.exports = { db, admin };
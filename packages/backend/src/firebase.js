// Force IPv4 at socket level — undici (Node v24 built-in fetch) ignores dns.setDefaultResultOrder
const https = require('https');
const http  = require('http');
https.globalAgent = new https.Agent({ family: 4 });
http.globalAgent  = new http.Agent({ family: 4 });

const admin = require('firebase-admin');
const { readFileSync } = require('fs');

const serviceAccount = JSON.parse(readFileSync('./config/serviceAccount.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

module.exports = { db };
const admin = require('firebase-admin');

if (!admin.apps.length) {
  let credential;

  // 1) Try local JSON key file (development)
  try {
    const serviceAccount = require('../config/serviceAccount.json');
    credential = admin.credential.cert(serviceAccount);
  } catch (fileErr) {
    // 2) Fallback to environment variables (production / Vercel)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    } else {
      console.error('❌ No Firebase credentials found.');
      process.exit(1);
    }
  }

  admin.initializeApp({
    credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,   // still needed for other features
  });

  console.log('✅ Firebase Admin SDK initialized');
}

const db = admin.firestore();
module.exports = { admin, db };
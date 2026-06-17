const admin = require('firebase-admin');

if (!admin.apps.length) {
  let credential;

  // Always try the JSON file first (simplest, most reliable)
  try {
    const serviceAccount = require('../config/serviceAccount.json');
    credential = admin.credential.cert(serviceAccount);
    console.log('✅ Using local service account JSON file');
  } catch (fileErr) {
    // Fallback to environment variables (only used on Vercel / production)
    console.warn('⚠️  serviceAccount.json not found. Falling back to environment variables.');
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
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  console.log('✅ Firebase Admin SDK initialized');
}

const db = admin.firestore();
module.exports = { admin, db };
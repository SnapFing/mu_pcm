const admin = require('firebase-admin');
const path = require('path');

// Try loading from the JSON file first (simplest, no formatting issues)
const serviceAccountPath = path.resolve(__dirname, '../config/serviceAccount.json');

let credential;
try {
  // eslint-disable-next-line import/no-dynamic-require
  const serviceAccount = require(serviceAccountPath);
  credential = admin.credential.cert(serviceAccount);
} catch (err) {
  // Fallback to environment variables (for production where you can't use a file)
  if (process.env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } else {
    throw new Error('No Firebase credentials found. Provide a serviceAccount.json or set environment variables.');
  }
}

if (!admin.apps.length) {
  admin.initializeApp({ credential });
  console.log('✅ Firebase Admin SDK initialized successfully');
}

const db = admin.firestore();
module.exports = { admin, db };
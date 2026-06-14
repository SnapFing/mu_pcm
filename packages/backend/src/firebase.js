const admin = require('firebase-admin');
const path = require('path');

// Try loading from the JSON file first (simplest, no formatting issues)
const serviceAccountPath = path.resolve(__dirname, '../config/serviceAccount.json');

if (!admin.apps.length) {
  let credential;

  try {
    const serviceAccount = require('../config/serviceAccount.json');
    credential = admin.credential.cert(serviceAccount);
  } catch {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
  }


  console.log('✅ Firebase Admin SDK initialized');
}

if (!admin.apps.length) {
  // Determine storage bucket from environment or sensible defaults
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.appspot.com` : undefined);

  const initOpts = { credential };
  if (storageBucket) initOpts.storageBucket = storageBucket;

  admin.initializeApp(initOpts);
  console.log('✅ Firebase Admin SDK initialized successfully');
  if (storageBucket) console.log(`🔹 Using storage bucket: ${storageBucket}`);
  else console.warn('⚠️ No storage bucket configured; admin.storage().bucket() will require an explicit bucket name');
}

const db = admin.firestore();
module.exports = { admin, db };
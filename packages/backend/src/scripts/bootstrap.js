// Force IPv4 at socket level — undici (Node v24 built-in fetch) ignores dns.setDefaultResultOrder
const https = require('https');
const http  = require('http');
https.globalAgent = new https.Agent({ family: 4 });
http.globalAgent  = new http.Agent({ family: 4 });

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const admin = require('firebase-admin');
const { readFileSync } = require('fs');
const path = require('path');

// ── Init Firebase ─────────────────────────────────────────────────────────
const serviceAccount = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../config/serviceAccount.json'))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  const email = process.argv[2];
  const displayName = process.argv[3] || 'Super Admin';

  if (!email) {
    console.error('Usage: node src/scripts/bootstrap.js <email> [displayName]');
    process.exit(1);
  }

  try {
    // 1. Get or create Firebase Auth user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log(`ℹ  Firebase Auth user already exists: ${userRecord.uid}`);
    } catch {
      userRecord = await admin.auth().createUser({ email, displayName, emailVerified: false });
      console.log(`✅ Firebase Auth user created: ${userRecord.uid}`);
    }

    const uid = userRecord.uid;

    // 2. Write / overwrite the admin_users document
    const existing = await db.collection('admin_users').doc(uid).get();
    if (existing.exists && existing.data().role === 'super_admin') {
      console.log(`ℹ  ${email} is already a super_admin — no changes made.`);
    } else {
      await db.collection('admin_users').doc(uid).set({
        uid,
        email,
        displayName,
        role: 'super_admin',
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: 'bootstrap',
        lastLogin: null,
      });
      console.log(`✅ admin_users/${uid} written as super_admin`);
    }

    // 3. Generate password-reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email {
      url: 'https://mu-pcm.vercel.app/admin-portal',
      handleCodeInApp: true,
    });
    console.log('\n─────────────────────────────────────────────────');
    console.log('Super Admin Bootstrap Complete!');
    console.log('─────────────────────────────────────────────────');
    console.log(`Email       : ${email}`);
    console.log(`UID         : ${uid}`);
    console.log(`Role        : super_admin`);
    console.log(`Reset link  : ${resetLink}`);
    console.log('─────────────────────────────────────────────────');
    console.log('Share the reset link with the admin so they can set a password and log in.');
  } catch (err) {
    console.error('Bootstrap failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
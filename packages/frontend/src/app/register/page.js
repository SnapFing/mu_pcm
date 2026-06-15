'use client';
import { useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseAuth() {
  if (!getApps().length) initializeApp(firebaseConfig);
  return getAuth();
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    year: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name) return;
    setLoading(true);
    setError('');
    try {
      // 1. Create Firebase Auth user
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const idToken = await cred.user.getIdToken();

      // 2. Save student profile to backend
      const res = await fetch(`${API}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: form.name,
          studentId: form.studentId,
          department: form.department,
          year: form.year,
          phone: form.phone,
        }),
      });

      if (!res.ok) throw new Error('Profile creation failed');
      setDone(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F2A4A' }}>
        <div className="text-center p-8 rounded-2xl bg-white max-w-md mx-4">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F2A4A' }}>Welcome to MU SDA PCM!</h2>
          <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: 24 }}>
            Your account has been created successfully. You can now log in and access your
            personalized dashboard, join groups, and stay connected with the community.
          </p>
          <a
            href="/login"
            className="px-8 py-3 rounded-full text-sm font-bold text-white inline-block"
            style={{ background: '#2E6DE7' }}
          >
            Log In Now
          </a>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none border";
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: '#0F2A4A' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-8" style={{ background: 'white' }}>
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#0F2A4A' }}>
          Join the Community
        </h2>
        <p className="text-center mb-6" style={{ color: '#94A3B8', fontSize: 13 }}>
          Create your student account to get started.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="Full Name *"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.name}
            onChange={set('name')}
          />
          <input
            required
            type="email"
            placeholder="Email *"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.email}
            onChange={set('email')}
          />
          <input
            required
            type="password"
            placeholder="Password (min. 6 characters) *"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.password}
            onChange={set('password')}
          />
          <input
            placeholder="Student ID"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.studentId}
            onChange={set('studentId')}
          />
          <input
            placeholder="Department / School"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.department}
            onChange={set('department')}
          />
          <input
            placeholder="Year of Study"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.year}
            onChange={set('year')}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={form.phone}
            onChange={set('phone')}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
            style={{ background: loading ? '#94A3B8' : '#2E6DE7' }}
          >
            {loading ? 'Creating your account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#94A3B8' }}>
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-semibold">
            Log in
          </a>
        </p>
        <p className="text-center text-xs mt-2">
          <a href="/dashboard" className="text-blue-600">
            Continue as guest
          </a>
        </p>
      </div>
    </div>
  );
}
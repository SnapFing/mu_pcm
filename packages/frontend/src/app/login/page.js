'use client';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // After successful login, redirect to the student dashboard (to be built)
      // For now, redirect to the public dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none border";
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0F2A4A' }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl p-8" style={{ background: 'white' }}>
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#0F2A4A' }}>
          Member Login
        </h2>
        <p className="text-center mb-6" style={{ color: '#94A3B8', fontSize: 13 }}>
          Sign in to your student account.
        </p>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            type="email"
            placeholder="Email"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            style={{ borderColor: '#E2E8F7' }}
            className={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: loading ? '#94A3B8' : '#2E6DE7' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-xs mt-4" style={{ color: '#94A3B8' }}>
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-semibold">
            Sign up
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
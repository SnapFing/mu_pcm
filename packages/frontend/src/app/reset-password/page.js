'use client';
import { useState, useEffect } from 'react';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
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

export default function ResetPasswordPage() {
  const [oobCode, setOobCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('oobCode');
    if (code) {
      setOobCode(code);
      verifyPasswordResetCode(getFirebaseAuth(), code)
        .then(() => setMessage('Enter your new password below.'))
        .catch((err) => setError(err.message || 'Invalid or expired reset link.'));
    } else {
      setError('Missing reset code.');
    }
  }, []);

  const handleReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword);
      alert('Password changed successfully! You can now log in.');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
    border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A',
    outline: 'none', fontFamily: "'Noto Sans', sans-serif",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F7FF' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#0F2A4A' }}>Reset Password</h2>
        {error && (
          <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}>
            {error}
          </div>
        )}
        {message && (
          <p className="text-sm text-center mb-4" style={{ color: '#0F2A4A' }}>{message}</p>
        )}
        <input
          type="password"
          placeholder="New password (min. 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
          className="mb-4"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: loading ? '#94A3B8' : '#2E6DE7', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}
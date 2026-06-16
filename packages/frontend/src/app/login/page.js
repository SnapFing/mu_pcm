'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
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
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 6, display: 'block',
  };
  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
    border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A',
    outline: 'none', fontFamily: "'Noto Sans', sans-serif",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F7FF' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#0F2A4A' }}>Member Login</h2>
        <p className="text-center mb-6" style={{ color: '#475569', fontSize: 13 }}>Sign in to your student account.</p>

        {error && (
          <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Email</label>
            <input
              required type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              required type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: loading ? '#94A3B8' : '#2E6DE7', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
          Don't have an account?{' '}
          <a href="/register" className="font-semibold" style={{ color: '#2E6DE7' }}>Sign up</a>
        </p>
        <p className="text-center text-xs mt-2">
          <a href="/dashboard" style={{ color: '#2E6DE7' }}>Continue as guest</a>
        </p>
      </div>
    </div>
  );
}
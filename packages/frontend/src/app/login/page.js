'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { validateEmail } from '@/app/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NEW
  const [emailError, setEmailError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailBlur = () => {
    const result = validateEmail(email);
    setEmailError(result.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailCheck = validateEmail(email);
    setEmailError(emailCheck.error);
    if (!emailCheck.isValid) {
      setError('Please enter a valid email address.');
      return;
    }
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

  const handleForgotPassword = async () => {
    if (!email) return alert('Enter your email first');
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error);
      return alert('Please enter a valid email before requesting a reset.');
    }
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      const resetUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : '/reset-password';
      await sendPasswordResetEmail(auth, email, {
        url: resetUrl,
        handleCodeInApp: true,
      });
      alert('Password reset email sent to ' + email);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
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
  // Eye icon style
  const eyeStyle = {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    display: 'flex', alignItems: 'center', color: '#64748B',
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
              onBlur={handleEmailBlur}
              style={{ ...inputStyle, borderColor: emailError ? '#DC2626' : '#CBD5E1' }}
            />
            {emailError && (
              <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4, fontWeight: 500 }}>
                {emailError}
              </p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}> {/* NEW wrapper for eye icon */}
              <input
                required
                type={showPassword ? 'text' : 'password'} // Toggle type
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeStyle}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  // Eye Slash SVG (hidden)
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye SVG (visible)
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: loading ? '#94A3B8' : '#2E6DE7', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <button
          onClick={handleForgotPassword}
          className="text-xs font-medium underline mt-2"
          style={{ color: '#2E6DE7', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Forgot password?
        </button>

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
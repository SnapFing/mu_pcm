'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/ui/Button';
import { getFirebaseAuth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    year: '',
    phone: '',
    category: 'Ordinary',
    initialBand: '',
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
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch(`${API}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          studentId: form.category === 'Ordinary' ? form.studentId : undefined,
          department: form.category === 'Ordinary' ? form.department : undefined,
          year: form.category === 'Ordinary' ? form.year : undefined,
          phone: form.phone,
          category: form.category,
          joinedBands: form.initialBand ? [form.initialBand] : [],
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F7FF' }}>
        <div className="text-center p-8 rounded-2xl bg-white max-w-md" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F2A4A' }}>Welcome to MU SDA PCM!</h2>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
            Your account has been created. You can now log in and access your personalized dashboard.
          </p>
          <Button href="/login" variant="primary" size="lg">Log In Now</Button>
        </div>
      </div>
    );
  }

  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 6, display: 'block',
  };
  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
    border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A',
    outline: 'none', fontFamily: "'Noto Sans', sans-serif",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: '#F5F7FF' }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#0F2A4A' }}>Join the Community</h2>
        <p className="text-center mb-6" style={{ color: '#475569', fontSize: 13 }}>
          Create your student account to get started.
        </p>

        {error && (
          <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input required placeholder="John Mwanza" value={form.name} onChange={set('name')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input required type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password * (min. 6 characters)</label>
            <input required type="password" placeholder="••••••••" value={form.password} onChange={set('password')} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Membership Category</label>
            <select value={form.category} onChange={set('category')} style={inputStyle}>
              <option value="Ordinary">Ordinary (Baptised Adventist student/employee)</option>
              <option value="Associate">Associate (Non-Adventist, committed to ideals)</option>
              <option value="Honourary">Honourary (Church member over 35, Patron/Matron)</option>
            </select>
          </div>

          {form.category === 'Ordinary' && (
            <>
              <div>
                <label style={labelStyle}>Student ID</label>
                <input placeholder="MU2024/001" value={form.studentId} onChange={set('studentId')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Department / School</label>
                <input placeholder="School of Engineering" value={form.department} onChange={set('department')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Year of Study</label>
                <input placeholder="Year 2" value={form.year} onChange={set('year')} style={inputStyle} />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Phone (optional)</label>
            <input type="tel" placeholder="+260 977 123 456" value={form.phone} onChange={set('phone')} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Band / Committee Interest (optional)</label>
            <select value={form.initialBand} onChange={set('initialBand')} style={inputStyle}>
              <option value="">None</option>
              <option value="Prayer Band">Prayer Band</option>
              <option value="Health Band">Health Band</option>
              <option value="Preaching & Witnessing Band">Preaching & Witnessing Band</option>
              <option value="Music & Arts">Music & Arts</option>
              <option value="Welfare Committee">Welfare Committee</option>
              <option value="Education & Library">Education & Library</option>
              <option value="Technical Committee">Technical Committee</option>
              <option value="Catering Committee">Catering Committee</option>
            </select>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
            style={{ background: loading ? '#94A3B8' : '#2E6DE7', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating your account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
          Already have an account?{' '}
          <a href="/login" className="font-semibold" style={{ color: '#2E6DE7' }}>Log in</a>
        </p>
        <p className="text-center text-xs mt-2">
          <a href="/dashboard" style={{ color: '#2E6DE7' }}>Continue as guest</a>
        </p>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Navbar    from '@/app/ui/Navbar';
import Footer    from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useGroups }  from '@/app/context/DataContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Icons ──────────────────────────────────────────────────────────────────
const Ico = ({ children, c = 'w-5 h-5' }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const UsersIcon  = ({ c }) => <Ico c={c}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Ico>;
const ClockIcon  = ({ c }) => <Ico c={c}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Ico>;
const CalIcon    = ({ c }) => <Ico c={c}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Ico>;
const ChevronR   = ({ c }) => <Ico c={c}><path d="M9 18l6-6-6-6"/></Ico>;
const LockIcon   = ({ c }) => <Ico c={c}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></Ico>;

const ACCENT = (i) => i % 2 === 0 ? '#2E6DE7' : '#7C3AED';
const ACCENT_BG = (i) => i % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)';

// ── Normalize the "acceptingJoins" flag no matter what type it comes in as ──
// Handles a real boolean false, the string "false"/"no"/"closed", or 0 — all
// treated as CLOSED. Anything else (true, undefined, missing) is OPEN.
function isGroupOpen(acceptingJoins) {
  if (acceptingJoins === false) return false;
  if (acceptingJoins === 0) return false;
  if (typeof acceptingJoins === 'string') {
    const v = acceptingJoins.trim().toLowerCase();
    if (v === 'false' || v === 'no' || v === '0' || v === 'closed') return false;
  }
  return true;
}

// ── Group Card ─────────────────────────────────────────────────────────────
function GroupCard({ group, idx, onJoin }) {
  const { name, leader, meetingDay, time, members, description, status, acceptingJoins } = group;
  const accent = ACCENT(idx);
  const accentBg = ACCENT_BG(idx);
  const isOpen = isGroupOpen(acceptingJoins);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: `3px solid ${accent}` }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: accentBg, color: accent }}>
            <UsersIcon c="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: status === 'Active' ? 'rgba(46,109,231,0.08)' : 'rgba(239,68,68,0.08)',
                       color: status === 'Active' ? '#2E6DE7' : '#EF4444',
                       border: `1px solid ${status === 'Active' ? 'rgba(46,109,231,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              {status}
            </span>
            {!isOpen && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(148,163,184,0.12)', color: '#64748B', border: '1px solid rgba(148,163,184,0.25)' }}>
                <LockIcon c="w-2.5 h-2.5" /> Not Accepting Members
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base leading-snug mb-1" style={{ color: '#0F2A4A' }}>{name}</h3>
          <p className="text-xs font-medium" style={{ color: accent }}>Led by {leader}</p>
        </div>

        {description && (
          <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>{description}</p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
          <span className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1"
            style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#475569' }}>
            <CalIcon c="w-3 h-3" /> {meetingDay}{time ? ` · ${time}` : ''}
          </span>
          {members > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1"
              style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#475569' }}>
              <UsersIcon c="w-3 h-3" /> {members} members
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5">
        <button
          onClick={() => isOpen && onJoin(group)}
          disabled={!isOpen}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: isOpen ? accent : '#E2E8F7',
            color: isOpen ? 'white' : '#94A3B8',
            cursor: isOpen ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (isOpen) e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={e => { if (isOpen) e.currentTarget.style.opacity = '1'; }}
        >
          {isOpen ? 'Join This Group' : 'Not Currently Accepting Members'}
        </button>
      </div>
    </div>
  );
}

// ── Join Modal ─────────────────────────────────────────────────────────────
function JoinModal({ group, onClose }) {
  const [form, setForm] = useState({ name: '', studentId: '', email: '', phone: '', year: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
    border: '1px solid #E2E8F7', background: '#F5F7FF', color: '#0F2A4A',
    outline: 'none', fontFamily: "'Noto Sans', sans-serif",
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in at least your name and email.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/groups/${group.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not submit your request. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError('Network error — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(46,109,231,0.1)', color: '#2E6DE7' }}>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#0F2A4A', marginBottom: 8 }}>
          Request Submitted!
        </h3>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 24 }}>
          Your request to join <strong>{group.name}</strong> has been sent. The group leader will be in touch soon.
        </p>
        <button onClick={onClose} className="px-8 py-2.5 rounded-full text-sm font-bold"
          style={{ background: '#2E6DE7', color: 'white' }}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white"
          style={{ borderBottom: '1px solid #E2E8F7' }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#0F2A4A' }}>
              Join {group.name}
            </h3>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Led by {group.leader}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg"
            style={{ background: '#F5F7FF' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E2E8F7'}
            onMouseLeave={e => e.currentTarget.style.background = '#F5F7FF'}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
          {[
            { label: 'Full Name',     key: 'name',      placeholder: 'Your full name',      type: 'text'  },
            { label: 'Student ID',    key: 'studentId', placeholder: 'e.g. MU2024/001',     type: 'text'  },
            { label: 'Email',         key: 'email',     placeholder: 'your@email.com',       type: 'email' },
            { label: 'Phone Number',  key: 'phone',     placeholder: 'e.g. 0977 123 456',    type: 'tel'   },
            { label: 'Year of Study', key: 'year',      placeholder: 'e.g. Year 2',          type: 'text'  },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#0F2A4A', marginBottom: 6 }}>
                {label.toUpperCase()}
                {key === 'phone' && (
                  <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#94A3B8' }}> (optional — helps the group leader reach you faster)</span>
                )}
              </label>
              <input type={type} value={form[key]} onChange={f(key)} placeholder={placeholder} style={inputStyle} disabled={submitting} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#0F2A4A', marginBottom: 6 }}>
              WHY DO YOU WANT TO JOIN?
            </label>
            <textarea value={form.motivation} onChange={f('motivation')} rows={3}
              placeholder="Share your motivation…"
              style={{ ...inputStyle, resize: 'none' }} disabled={submitting} />
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose} disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: '1px solid #E2E8F7', color: '#64748B' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: submitting ? '#94A3B8' : '#2E6DE7', color: 'white', cursor: submitting ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#1d5cd4'; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#2E6DE7'; }}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function GroupsPage() {
  const { items: groups } = useGroups();
  const [joining, setJoining] = useState(null);
  const [search, setSearch]   = useState('');

  const active   = groups.filter(g => g.status === 'Active');
  const inactive = groups.filter(g => g.status !== 'Active');

  const filtered = (list) => list.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.leader || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers = active.reduce((sum, g) => sum + (Number(g.members) || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        *, body { font-family: 'Noto Sans', sans-serif; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/groups" />

        <PageHeader
          eyebrow="MU SDA PCM"
          title="Campus Groups & Departments"
          subtitle="Find your place to serve. Every group is a family — discover where your gifts can shine for God's glory."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

          {/* Stats strip */}
          <div className="rounded-2xl p-6 mb-12 grid grid-cols-3 gap-6 text-center"
            style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
            {[
              { value: active.length,   label: 'Active Groups'  },
              { value: `${totalMembers}+`, label: 'Total Members' },
              { value: groups.length,   label: 'Departments'    },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-extrabold" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#0F2A4A' }}>{value}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.1em' }} className="uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-10 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search groups…"
              className="pl-10 pr-4 py-2.5 rounded-xl text-sm w-full outline-none"
              style={{ border: '1px solid #E2E8F7', background: '#F5F7FF', color: '#0F2A4A' }} />
          </div>

          {/* Active groups */}
          {filtered(active).length > 0 && (
            <section className="mb-16">
              <div className="mb-8">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7' }} className="uppercase mb-2">Active Ministries</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#0F2A4A' }}>
                  Our Groups
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered(active).map((g, i) => (
                  <GroupCard key={g.id} group={g} idx={i} onJoin={setJoining} />
                ))}
              </div>
            </section>
          )}

          {/* Inactive groups */}
          {filtered(inactive).length > 0 && (
            <section className="mb-16">
              <div className="mb-8">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#94A3B8' }} className="uppercase mb-2">Currently Inactive</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 700, color: '#0F2A4A' }}>
                  Other Groups
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered(inactive).map((g, i) => (
                  <GroupCard key={g.id} group={g} idx={i} onJoin={setJoining} />
                ))}
              </div>
            </section>
          )}

          {filtered(active).length === 0 && filtered(inactive).length === 0 && (
            <p className="text-center py-20" style={{ color: '#94A3B8' }}>No groups found.</p>
          )}

          {/* Propose CTA */}
          <div className="rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)', color: 'white' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)' }} className="uppercase mb-3">Don't See Your Niche?</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 700, marginBottom: 12 }}>
              Propose a New Group
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 420, margin: '0 auto 24px' }}>
              Have a vision for a ministry that doesn't exist yet? Reach out and we'll help you start it.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all"
              style={{ background: 'white', color: '#2E6DE7' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5F7FF'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              Contact Us <ChevronR c="w-4 h-4" />
            </a>
          </div>

        </div>

        {joining && <JoinModal group={joining} onClose={() => setJoining(null)} />}
        <Footer />
      </div>
    </>
  );
}
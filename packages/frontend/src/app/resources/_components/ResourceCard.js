'use client';

/**
 * prayer/_components/PrayerForm.js
 */

import { useState } from 'react';

const CATEGORIES = ['Personal Growth', 'Academic', 'Family', 'Health', 'Spiritual Guidance', 'Thanksgiving', 'Other'];

export default function PrayerForm() {
  const [form, setForm]       = useState({ name: '', anonymous: false, category: '', request: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]    = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.category || !form.request.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // TODO: replace with Firebase write
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl p-8 text-center flex flex-col items-center gap-4"
        style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(46,109,231,0.12)' }}>
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2E6DE7" strokeWidth={2} strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3 className="font-bold text-lg" style={{ color: '#0F2A4A' }}>Prayer Request Received</h3>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>
          Your request has been shared with the prayer team. We are standing with you in faith.
        </p>
        <p style={{ fontSize: 13, fontStyle: 'italic', color: '#94A3B8' }}>
          "The prayer of a righteous person is powerful and effective." — James 5:16
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ name: '', anonymous: false, category: '', request: '' }); }}
          className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all"
          style={{ background: '#2E6DE7', color: 'white' }}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 6px rgba(46,109,231,0.07)' }}>

      {/* Name + Anonymous toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1 flex flex-col gap-1.5">
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.05em' }}>
            Your Name <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span>
          </label>
          <input type="text" placeholder="e.g. John Mwanza"
            value={form.anonymous ? '' : form.name}
            disabled={form.anonymous}
            onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
            style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#1E293B', opacity: form.anonymous ? 0.4 : 1 }}
            onFocus={e => !form.anonymous && (e.currentTarget.style.borderColor = '#2E6DE7')}
            onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
        </div>
        {/* Anonymous toggle */}
        <label className="flex items-center gap-2 cursor-pointer shrink-0 pb-0.5">
          <div onClick={() => set('anonymous', !form.anonymous)}
            className="w-10 h-6 rounded-full relative transition-all duration-200 cursor-pointer"
            style={{ background: form.anonymous ? '#2E6DE7' : '#E2E8F7' }}>
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: form.anonymous ? 22 : 4 }} />
          </div>
          <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>Anonymous</span>
        </label>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.05em' }}>
          Prayer Category <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => set('category', cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: form.category === cat ? '#2E6DE7' : '#F5F7FF',
                color:      form.category === cat ? 'white'   : '#64748B',
                border:     form.category === cat ? '1px solid #2E6DE7' : '1px solid #E2E8F7',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Request */}
      <div className="flex flex-col gap-1.5">
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.05em' }}>
          Prayer Request <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea rows={5} placeholder="Share your prayer request here..."
          value={form.request}
          onChange={e => set('request', e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors resize-none"
          style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#1E293B', lineHeight: 1.7 }}
          onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
          onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
        <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'right' }}>{form.request.length} characters</p>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit}
        disabled={loading || !form.category || !form.request.trim()}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all"
        style={{
          background: loading || !form.category || !form.request.trim() ? '#CBD5E1' : '#2E6DE7',
          color: 'white',
          cursor: loading || !form.category || !form.request.trim() ? 'not-allowed' : 'pointer',
        }}>
        {loading ? 'Submitting...' : 'Submit Prayer Request'}
      </button>

      <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>
        All requests are handled with care and confidentiality by our prayer team.
      </p>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useJournals } from '@/app/context/DataContext';

const CATEGORIES = ['All', 'Academic', 'Spiritual Growth', 'Personal Development', 'Community'];
const CAT_COLORS = { 'Academic': { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' }, 'Spiritual Growth': { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED' }, 'Personal Development': { bg: 'rgba(15,42,74,0.08)', text: '#0F2A4A' }, 'Community': { bg: 'rgba(5,150,105,0.08)', text: '#059669' } };

function JournalCard({ journal, idx }) {
  const { title, author, category, date } = journal;
  const colors = CAT_COLORS[category] || { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' };
  const accent = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: `3px solid ${accent}` }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>{category}</span>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>{date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
      </div>
      <h3 className="font-bold leading-snug flex-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#0F2A4A' }}>{title}</h3>
      <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.bg, color: colors.text, fontSize: 11, fontWeight: 700 }}>{author ? author.charAt(0) : '?'}</div>
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{author}</span>
      </div>
    </div>
  );
}

export default function JournalsPage() {
  const { items: journals } = useJournals();
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const published = journals.filter(j => j.status === 'Published');
  const filtered = published.filter(j => (active === 'All' || j.category === active) && (j.title.toLowerCase().includes(search.toLowerCase()) || (j.author || '').toLowerCase().includes(search.toLowerCase())));
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap'); *, body { font-family: 'Noto Sans', sans-serif; }`}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/journals" />
        <PageHeader eyebrow="Knowledge & Faith" title="Journals & Articles" subtitle="Thoughtful writing from our community — exploring faith, academics, and life on campus." />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActive(cat)} className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{ background: active === cat ? '#2E6DE7' : '#F5F7FF', color: active === cat ? 'white' : '#64748B', border: active === cat ? '1px solid #2E6DE7' : '1px solid #E2E8F7' }}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: '1px solid #E2E8F7', background: '#F5F7FF', color: '#0F2A4A', width: 180 }} />
            </div>
          </div>
          {filtered.length === 0 ? <p className="text-center py-20" style={{ color: '#94A3B8' }}>No articles found.</p> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((j, i) => <JournalCard key={j.id} journal={j} idx={i} />)}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

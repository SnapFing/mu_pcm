'use client';
import ErrorBoundary from '@/app/ui/ErrorBoundary';

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useJournals } from '@/app/context/DataContext';
import Skeleton, { CardSkeleton } from '@/app/ui/Skeleton';

const CATEGORIES = ['All', 'Academic', 'Spiritual Growth', 'Personal Development', 'Community'];
const CAT_COLORS = {
  'Academic':             { bg: 'rgba(46,109,231,0.08)',  text: '#2E6DE7' },
  'Spiritual Growth':     { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED' },
  'Personal Development': { bg: 'rgba(15,42,74,0.08)',   text: '#0F2A4A' },
  'Community':            { bg: 'rgba(5,150,105,0.08)',  text: '#059669' },
};

function Modal({ journal, onClose }) {
  const colors = CAT_COLORS[journal.category] || { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: '#E2E8F7' }}>
          <div className="flex-1">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>{journal.category}</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#0F2A4A', marginTop: 8 }}>{journal.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 shrink-0">
            <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 pt-4 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.bg, color: colors.text, fontSize: 12, fontWeight: 700 }}>
            {journal.author ? journal.author.charAt(0) : '?'}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F2A4A' }}>{journal.author}</p>
            <p style={{ fontSize: 11, color: '#94A3B8' }}>{journal.date ? new Date(journal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
          </div>
        </div>
        <div className="px-6 py-4">
          {journal.body
            ? <p style={{ fontSize: 15, lineHeight: 1.85, color: '#334155', whiteSpace: 'pre-wrap' }}>{journal.body}</p>
            : <p style={{ color: '#94A3B8', fontSize: 14, fontStyle: 'italic' }}>No full article content available.</p>}
        </div>
        <div className="px-6 py-4 border-t" style={{ borderColor: '#E2E8F7' }}>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#2E6DE7' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function JournalCard({ journal, idx, onRead }) {
  const { title, author, category, date, body } = journal;
  const colors = CAT_COLORS[category] || { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' };
  const accent = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: `3px solid ${accent}` }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>{category}</span>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
        </span>
      </div>
      <h3 className="font-bold leading-snug flex-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#0F2A4A' }}>{title}</h3>
      {body && (
        <p className="text-sm leading-relaxed" style={{ color: '#64748B', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{body}</p>
      )}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.bg, color: colors.text, fontSize: 11, fontWeight: 700 }}>
            {author ? author.charAt(0) : '?'}
          </div>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{author}</span>
        </div>
        {body && (
          <button onClick={() => onRead(journal)} className="flex items-center gap-1 text-xs font-semibold" style={{ color: accent }}>
            Read more
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function JournalsPage() {
  const { items: journals, loading } = useJournals();
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [reading, setReading] = useState(null);
  const published = journals.filter(j => j.status === 'Published');
  const filtered = published.filter(j =>
    (active === 'All' || j.category === active) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) || (j.author || '').toLowerCase().includes(search.toLowerCase()))
  );
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

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <ErrorBoundary>
              {filtered.length === 0 ? (
                <div className="text-center py-20 px-5">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(46,109,231,0.06)', color: '#2E6DE7' }}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F2A4A' }}>No articles published yet</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 340, margin: '0 auto' }}>
                    Articles written by PCM members will appear here once published.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((j, i) => <JournalCard key={j.id} journal={j} idx={i} onRead={setReading} />)}</div>
              )}
            </ErrorBoundary>
          )}
        </div>
        <Footer />
      </div>
      {reading && <Modal journal={reading} onClose={() => setReading(null)} />}
    </>
  );
}

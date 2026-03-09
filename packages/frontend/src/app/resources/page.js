'use client';

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useResources } from '@/app/context/DataContext';

const CATEGORIES = ['All', 'Planning', 'Study', 'Spiritual', 'Health', 'General'];
const CAT_COLORS = { Planning: { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' }, Study: { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED' }, Spiritual: { bg: 'rgba(5,150,105,0.08)', text: '#059669' }, Health: { bg: 'rgba(239,68,68,0.08)', text: '#EF4444' }, General: { bg: 'rgba(15,42,74,0.08)', text: '#0F2A4A' } };

function ResourceCard({ resource, idx }) {
  const { title, description, category, fileType } = resource;
  const accent = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  const catColors = CAT_COLORS[category] || CAT_COLORS.General;
  const fileColor = { PDF: '#EF4444', DOCX: '#2E6DE7', XLSX: '#059669', Link: '#7C3AED' }[fileType] || '#64748B';
  return (
    <div className="rounded-2xl p-6 flex gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderLeft: `3px solid ${accent}` }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${fileColor}18`, color: fileColor }}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: catColors.bg, color: catColors.text }}>{category}</span>
        </div>
        {description && <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>{description}</p>}
        <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: accent }}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download {fileType}
        </button>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { items: resources } = useResources();
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const published = resources.filter(r => r.status === 'Published');
  const filtered = published.filter(r => (active === 'All' || r.category === active) && (r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase())));
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap'); *, body { font-family: 'Noto Sans', sans-serif; }`}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/resources" />
        <PageHeader eyebrow="Tools for Success" title="Student Resources" subtitle="Downloadable guides, planners and tools to help you thrive academically and spiritually." />
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources…" className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: '1px solid #E2E8F7', background: '#F5F7FF', color: '#0F2A4A', width: 190 }} />
            </div>
          </div>
          {filtered.length === 0 ? <p className="text-center py-20" style={{ color: '#94A3B8' }}>No resources found.</p> : (
            <div className="grid sm:grid-cols-2 gap-5">
              {filtered.map((r, i) => <ResourceCard key={r.id} resource={r} idx={i} />)}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

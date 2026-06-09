'use client';
import ErrorBoundary from '@/app/ui/ErrorBoundary';

import { useState } from 'react';
import Navbar  from '@/app/ui/Navbar';
import Footer  from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useHeroes }  from '@/app/context/DataContext';
import Skeleton, { CardSkeleton } from '@/app/ui/Skeleton';

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function HeroCard({ hero, idx }) {
  const { name, role, year = "Current", bio, image } = hero;
  const accent   = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  const accentBg = idx % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)';
  const [imgError, setImgError] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
      <div style={{ position: 'relative', width: '100%', height: 240, background: accentBg, overflow: 'hidden' }}>
        {image && !imgError ? (
          <img src={image} alt={name} onError={() => setImgError(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{name ? name.charAt(0) : '?'}</span>
            </div>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(15,42,74,0.35), transparent)' }} />
        <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: 'rgba(255,255,255,0.92)', color: accent }}>{year}</span>
        <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderRadius: '50%', background: accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StarIcon />
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-base leading-snug" style={{ color: '#0F2A4A' }}>{name}</h3>
          <p className="text-xs font-semibold mt-1" style={{ color: accent }}>{role}</p>
        </div>
        {bio && <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>{bio}</p>}
      </div>
    </div>
  );
}

export default function HeroesPage() {
  const { items: heroes, loading } = useHeroes();
  const [search, setSearch] = useState('');
  const featured = heroes.filter(h => h.status === 'Featured');
  const filtered = featured.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.role || '').toLowerCase().includes(search.toLowerCase())
  );
  const years = [...new Set(filtered.map(h => h.year || "Current"))].sort().reverse();
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap'); *, body { font-family: 'Noto Sans', sans-serif; }`}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/heroes" />
        <PageHeader eyebrow="Celebrating Excellence" title="Campus Heroes" subtitle="Honouring students and leaders who have made a lasting impact on our ministry." />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="relative mb-12 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search heroes…"
              className="pl-10 pr-4 py-2.5 rounded-xl text-sm w-full outline-none"
              style={{ border: '1px solid #E2E8F7', background: '#F5F7FF', color: '#0F2A4A' }} />
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <ErrorBoundary>
              {years.length === 0 && (
                <div className="text-center py-20 px-5">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(124,58,237,0.06)', color: '#7C3AED' }}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F2A4A' }}>No heroes featured yet</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 340, margin: '0 auto' }}>
                    Outstanding PCM members will be showcased here once featured.
                  </p>
                </div>
              )}
              {years.map(year => (
                <section key={year} className="mb-16">
                  <div className="mb-8">
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">Class of</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#0F2A4A' }}>{year}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.filter(h => h.year === year).map((hero, i) => <HeroCard key={hero.id} hero={hero} idx={i} />)}
                  </div>
                </section>
              ))}
            </ErrorBoundary>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
'use client';

import { useState } from 'react';
import Navbar  from '@/app/ui/Navbar';
import Footer  from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useMedia } from '@/app/context/DataContext';

const TABS = ['All Media', 'Sermon', 'Event Video', 'Music', 'Photo Gallery'];

function PlayIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  );
}

function MediaCard({ item, idx, onPlay }) {
  const { title, type, presenter, date, url } = item;
  const accent = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  const accentBg = idx % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)';

  // Extract YouTube ID from url if present
  const ytId = url ? url.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '').split('&')[0] : null;
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      {/* Thumbnail */}
      <div className="relative overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ height: 180, background: accentBg }}
        onClick={() => ytId && onPlay(ytId, title)}>
        {thumb ? (
          <>
            <img src={thumb} alt={title} className="w-full h-full object-cover"
              onError={e => e.currentTarget.style.display = 'none'} />
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(15,42,74,0.35)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: accent }}>
                <PlayIcon />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: accent }}>
            <PlayIcon />
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Coming Soon</span>
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.92)', color: accent }}>
          {type}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
        <div className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#94A3B8' }}>
          <span>{presenter}</span>
          <span>{date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
        </div>
      </div>

      {/* Footer */}
      {ytId && (
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={() => onPlay(ytId, title)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: accent, color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            ▶ Play
          </button>
          <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#F5F7FF', color: '#64748B', border: '1px solid #E2E8F7' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E2E8F7'}
            onMouseLeave={e => e.currentTarget.style.background = '#F5F7FF'}>
            YouTube
          </a>
        </div>
      )}
    </div>
  );
}

function VideoModal({ ytId, title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,42,74,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: '#0F2A4A' }}>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const { items: media } = useMedia();
  const [activeTab, setActiveTab] = useState('All Media');
  const [playing, setPlaying]     = useState(null); // { ytId, title }

  const published = media.filter(m => m.status === 'Published');

  const filtered = published.filter(m =>
    activeTab === 'All Media' || m.type === activeTab
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        *, body { font-family: 'Noto Sans', sans-serif; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/media" />

        <PageHeader
          eyebrow="Audio & Video"
          title="Media Library"
          subtitle="Sermons, worship nights, event recordings and more — all in one place."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: activeTab === tab ? '#2E6DE7' : '#F5F7FF',
                  color:      activeTab === tab ? 'white'   : '#64748B',
                  border:     activeTab === tab ? '1px solid #2E6DE7' : '1px solid #E2E8F7',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-20" style={{ color: '#94A3B8' }}>No media found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <MediaCard key={item.id} item={item} idx={i}
                  onPlay={(ytId, title) => setPlaying({ ytId, title })} />
              ))}
            </div>
          )}

        </div>

        {playing && <VideoModal ytId={playing.ytId} title={playing.title} onClose={() => setPlaying(null)} />}
        <Footer />
      </div>
    </>
  );
}
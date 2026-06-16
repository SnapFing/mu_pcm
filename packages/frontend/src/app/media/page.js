'use client';
import ErrorBoundary from '@/app/ui/ErrorBoundary';
import { CardSkeleton } from '@/app/ui/Skeleton';

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useMedia } from '@/app/context/DataContext';
import { ClockIcon, PlayIcon, YouTubeIcon, ExternalIcon, XIcon } from '@/app/ui/Icon';
import Button from '@/app/ui/Button';

const TABS = ['All Media', 'Sermons', 'Event Videos', 'Photo Gallery'];

function getYouTubeId(value = '') {
  if (!value) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
  const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || '';
}

function normalizeType(type = '') {
  if (type === 'Sermon') return 'Sermons';
  if (type === 'Event Video') return 'Event Videos';
  return type || 'Sermons';
}

function formatDate(value = '') {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Using shared icons from Icon.js

// ── Video Player Modal ─────────────────────────────────────────────────────
function VideoModal({ item, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,20,35,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-3xl flex flex-col gap-0 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0F2A4A' }}>

        {/* Modal header */}
        <div className="px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-1">
              {item.type}
            </p>
            <h3 className="font-bold text-white leading-snug" style={{ fontSize: 15 }}>{item.title}</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{item.speaker} · {item.date} · {item.duration}</p>
          </div>
          <button onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* YouTube embed */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Playing on MU SDA PCM Media Library
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={{ background: '#FF0000', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <YouTubeIcon className="w-4 h-4" /> Open on YouTube <ExternalIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Media Card ─────────────────────────────────────────────────────────────
function MediaCard({ item, onPlay }) {
  const { title, speaker, date, duration, thumbnail, type, youtubeId } = item;
  const isBlue = type === 'Sermons';
  const hasVideo = !!youtubeId;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        background: 'white',
        border: '1px solid #E2E8F7',
        boxShadow: '0 1px 4px rgba(46,109,231,0.06)',
        cursor: hasVideo ? 'pointer' : 'default',
      }}
      onClick={() => hasVideo && onPlay(item)}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      {/* Thumbnail */}
      <div className="relative overflow-hidden flex items-center justify-center"
        style={{ height: 180, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}>

      {/* Thumbnail image — uses YouTube thumbnail if no local image */}
       {(hasVideo || thumbnail) && (
         <img
           src={hasVideo
             ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
             : thumbnail}
           alt={title}
           className="w-full h-full object-cover"
           onError={e => { e.currentTarget.style.display = 'none'; }}
         />
       )}

        {/* Play overlay — only shown if video exists */}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: 'rgba(15,42,74,0.55)' }}>
            <PlayIcon />
          </div>
        )}

        {/* No video badge */}
        {!hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(15,42,74,0.35)' }}>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              Coming Soon
            </span>
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: isBlue ? 'rgba(46,109,231,0.85)' : 'rgba(124,58,237,0.85)', color: 'white', backdropFilter: 'blur(4px)' }}>
          {type}
        </span>

        {/* YouTube badge — shown when video available */}
        {hasVideo && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: '#FF0000', color: 'white' }}>
            <YouTubeIcon className="w-4 h-4" /> YT
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
        <p style={{ fontSize: 12, color: '#64748B' }}>{speaker}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3" style={{ fontSize: 11, color: '#94A3B8' }}>
            <span>{date}</span>
            <span className="flex items-center gap-1"><ClockIcon /> {duration}</span>
          </div>
          {hasVideo && (
            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E6DE7' }}>
              ▶ Watch
            </span>
          )}
        </div>
      </div>

      {/* Footer actions — only when video available */}
      {hasVideo && (
        <div className="px-5 pb-5 flex gap-2" onClick={e => e.stopPropagation()}>
          <Button onClick={() => onPlay(item)} variant="primary" className="flex-1 flex items-center justify-center gap-2">
            ▶ Play Here
          </Button>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
            style={{ background: '#F5F7FF', color: '#FF0000', border: '1px solid #E2E8F7' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFE8E8'}
            onMouseLeave={e => e.currentTarget.style.background = '#F5F7FF'}>
            <YouTubeIcon className="w-4 h-4" /> YouTube
          </a>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function MediaPage() {
  const [tab, setTab]           = useState('All Media');
  const [playing, setPlaying]   = useState(null);
  const { items, loading, error } = useMedia();

  const media = items
    .filter(item => item.status === 'Published')
    .map(item => ({
      ...item,
      type: normalizeType(item.type),
      speaker: item.presenter || item.speaker || 'MU SDA PCM',
      date: formatDate(item.date),
      duration: item.duration || 'Watch',
      thumbnail: item.thumbnail || item.image || '',
      youtubeId: item.youtubeId || getYouTubeId(item.url),
    }));
  const filtered = tab === 'All Media' ? media : media.filter(m => m.type === tab);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/media" />
        <PageHeader
          eyebrow="MU SDA PCM"
          title="Media Library"
          subtitle="Sermons, worship recordings, and event videos — all in one place."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: tab === t ? '#0F2A4A' : '#F5F7FF',
                  color:      tab === t ? 'white'   : '#475569',
                  border:     tab === t ? '1px solid #0F2A4A' : '1px solid #E2E8F7',
                }}>
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <ErrorBoundary>
              {error ? (
                <p className="text-center py-20" style={{ color: '#dc2626' }}>{error}</p>
              ) : tab === 'Photo Gallery' ? (
                <div className="text-center py-20 rounded-2xl"
                  style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
                  <p className="font-semibold" style={{ color: '#0F2A4A' }}>Photo Gallery</p>
                  <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Photos coming soon — check back after events.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 px-5">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(46,109,231,0.06)', color: '#2E6DE7' }}>
                    <PlayIcon />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F2A4A' }}>No media published yet</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 340, margin: '0 auto' }}>
                    Sermons and event recordings will appear here once they're published.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(m => (
                    <MediaCard key={m.id} item={m} onPlay={setPlaying} />
                  ))}
                </div>
              )}
            </ErrorBoundary>
          )}
        </div>

        <Footer />
      </div>

      {/* Video modal */}
      {playing && (
        <VideoModal item={playing} onClose={() => setPlaying(null)} />
      )}
    </>
  );
}

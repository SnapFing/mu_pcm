'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar  from '@/app/ui/Navbar';
import Footer  from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useMedia } from '@/app/context/DataContext';

const TABS = ['All Media', 'Sermon', 'Event Video', 'Music', 'Photo Gallery'];

function fileExt(url = '') {
  return url.split('?')[0].split('.').pop().toLowerCase();
}
const VIDEO_EXT = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'ogg'];
const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
function isVideoFile(url = '') { return VIDEO_EXT.includes(fileExt(url)); }
function isImageFile(url = '') { return IMAGE_EXT.includes(fileExt(url)); }

function getYtId(url) {
  if (!url) return null;
  return url.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '').split('&')[0] || null;
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

// ── Cloudinary helpers ────────────────────────────────────────────────────
function videoPosterUrl(url) {
  if (!url || !url.includes('/video/upload/')) return null;
  return url
    .replace('/video/upload/', '/video/upload/so_2/')
    .replace(/\.[a-z0-9]+(\?.*)?$/i, '.jpg$1');
}

function downloadUrl(url) {
  if (!url) return url;
  if (url.includes('fl_attachment')) return url;
  const marker = url.includes('/video/upload/') ? '/video/upload/'
    : url.includes('/image/upload/') ? '/image/upload/'
    : url.includes('/raw/upload/')   ? '/raw/upload/'
    : null;
  if (!marker) return url;
  return url.replace(marker, `${marker}fl_attachment/`);
}

function PlayIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  );
}

function DownloadIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronIcon({ direction = 'left', className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

// ── Resolve what kind of media an item is, and its thumbnail ────────────
function mediaKind(item) {
  const ytId = getYtId(item.url);
  if (ytId) return { kind: 'youtube', ytId, thumb: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` };
  if (item.fileUrl && isVideoFile(item.fileUrl)) {
    return { kind: 'video', src: item.fileUrl, poster: videoPosterUrl(item.fileUrl) };
  }
  if (item.fileUrl && isImageFile(item.fileUrl)) return { kind: 'image', src: item.fileUrl };
  return { kind: 'none' };
}

function MediaCard({ item, idx, onPlay }) {
  const { title, type, presenter, date } = item;
  const accent   = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  const accentBg = idx % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)';
  const info = mediaKind(item);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      <div className="relative overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ height: 180, background: accentBg }}
        onClick={() => info.kind !== 'none' && onPlay(item)}>
        {info.kind === 'youtube' && (
          <>
            {!thumbFailed ? (
              <img src={info.thumb} alt={title} className="w-full h-full object-cover"
                onError={() => setThumbFailed(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: '#0F2A4A' }} />
            )}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(15,42,74,0.35)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: accent }}><PlayIcon /></div>
            </div>
          </>
        )}
        {info.kind === 'image' && (
          <img src={info.src} alt={title} className="w-full h-full object-cover" onError={e => e.currentTarget.style.display = 'none'} />
        )}
        {info.kind === 'video' && (
          <>
            {info.poster && !thumbFailed ? (
              <img src={info.poster} alt={title} className="w-full h-full object-cover"
                onError={() => setThumbFailed(true)} />
            ) : (
              <video src={info.src} className="w-full h-full object-cover" muted playsInline preload="metadata" />
            )}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(15,42,74,0.35)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: accent }}><PlayIcon /></div>
            </div>
          </>
        )}
        {info.kind === 'none' && (
          <div className="flex flex-col items-center gap-2" style={{ color: accent }}>
            <PlayIcon />
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Coming Soon</span>
          </div>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.92)', color: accent }}>
          {type}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
        <div className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#94A3B8' }}>
          <span>{presenter}</span>
          <span>{fmtDate(date)}</span>
        </div>
      </div>

      {info.kind !== 'none' && (
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={() => onPlay(item)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: accent, color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {info.kind === 'image' ? '🔍 View' : '▶ Play'}
          </button>
          {info.kind === 'youtube' && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#F5F7FF', color: '#64748B', border: '1px solid #E2E8F7' }}>
              YouTube
            </a>
          )}
          {(info.kind === 'video' || info.kind === 'image') && (
            <a href={downloadUrl(item.fileUrl)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#F5F7FF', color: '#64748B', border: '1px solid #E2E8F7', textDecoration: 'none' }}
              title="Download">
              <DownloadIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── Single tile inside a highlights gallery grid ─────────────────────────
// Images: clean thumbnail only — no play badge, no caption clutter, since
// the picture speaks for itself and the info is one click away in the modal.
// Video / YouTube: keep the play badge + caption so users know what they're
// about to watch before clicking.
function HighlightsTile({ item, onPlay }) {
  const info = mediaKind(item);
  const [thumbFailed, setThumbFailed] = useState(false);
  const playable = info.kind !== 'none';
  const isImage = info.kind === 'image';

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-transform duration-150 hover:scale-[1.03]"
      style={{ aspectRatio: '1 / 1', background: '#0F2A4A', border: '1px solid #E2E8F7' }}
      onClick={() => playable && onPlay(item)}
    >
      {info.kind === 'image' && (
        <img src={info.src} alt={item.title} className="w-full h-full object-cover" />
      )}

      {info.kind === 'video' && (
        info.poster && !thumbFailed ? (
          <img src={info.poster} alt={item.title} className="w-full h-full object-cover" onError={() => setThumbFailed(true)} />
        ) : (
          <video src={info.src} className="w-full h-full object-cover" muted playsInline preload="metadata" />
        )
      )}

      {info.kind === 'youtube' && (
        !thumbFailed ? (
          <img src={info.thumb} alt={item.title} className="w-full h-full object-cover" onError={() => setThumbFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#0F2A4A' }}>
            <PlayIcon />
          </div>
        )
      )}

      {info.kind === 'none' && (
        <div className="w-full h-full flex items-center justify-center" style={{ background: '#F5F7FF', color: '#94A3B8' }}>
          <PlayIcon />
        </div>
      )}

      {/* Play badge + caption — video/YouTube only */}
      {!isImage && playable && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(15,42,74,0.28)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#2E6DE7' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      )}

      {!isImage && (item.title || item.presenter || item.date) && (
        <div
          className="absolute bottom-0 left-0 right-0 px-2 pt-4 pb-1.5 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(15,42,74,0.94), transparent)' }}
        >
          {item.title && (
            <p className="text-[10px] font-semibold text-white truncate leading-tight">{item.title}</p>
          )}
          {(item.presenter || item.date) && (
            <p className="text-[9px] text-white/75 truncate leading-tight mt-0.5">
              {item.presenter}
              {item.presenter && item.date ? ' · ' : ''}
              {fmtDate(item.date)}
            </p>
          )}
        </div>
      )}

      {/* Hover download — every tile with a direct file, images included */}
      {item.fileUrl && (
        <a
          href={downloadUrl(item.fileUrl)}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.92)', color: '#0F2A4A' }}
          title="Download"
        >
          <DownloadIcon className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

// ── Highlights gallery strip (grouped by eventTitle) ─────────────────────
function HighlightsGallery({ eventTitle, items, onPlay }) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>HIGHLIGHTS</span>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 700, color: '#0F2A4A' }}>{eventTitle}</h3>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {items.map((item, i) => (
          <HighlightsTile key={item.id} item={item} onPlay={() => onPlay(items, i)} />
        ))}
      </div>
    </section>
  );
}

// ── Lightbox / player modal ────────────────────────────────────────────
// Supports navigation (prev/next) across the sibling set the clicked item
// came from — e.g. all photos in a highlights gallery, or all singles.
// Arrow buttons on desktop, left/right keyboard, and touch-swipe on mobile.
function MediaModal({ items, index, onClose, onNavigate }) {
  const item = items[index];
  const info = mediaKind(item);
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  const touchStartX = useRef(null);

  const goPrev = useCallback(() => { if (canPrev) onNavigate(index - 1); }, [canPrev, index, onNavigate]);
  const goNext = useCallback(() => { if (canNext) onNavigate(index + 1); }, [canNext, index, onNavigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, onClose]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,42,74,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>

        <div className="flex items-center justify-between px-5 py-3" style={{ background: '#0F2A4A' }}>
          <div className="min-w-0 pr-4">
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }} className="truncate">{item.title}</p>
            {(item.presenter || item.date) && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }} className="truncate mt-0.5">
                {item.presenter}{item.presenter && item.date ? ' · ' : ''}{fmtDate(item.date)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {items.length > 1 && (
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{index + 1} / {items.length}</span>
            )}
            {item.fileUrl && (
              <a href={downloadUrl(item.fileUrl)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white', textDecoration: 'none' }}
                title="Download">
                <DownloadIcon className="w-3.5 h-3.5" /> Download
              </a>
            )}
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
        </div>

        <div className="relative">
          {info.kind === 'youtube' && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${info.ytId}?autoplay=1`}
                title={item.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          )}

          {info.kind === 'video' && (
            <video src={info.src} controls autoPlay poster={info.poster || undefined} style={{ width: '100%', maxHeight: '80vh', background: 'black' }} />
          )}

          {info.kind === 'image' && (
            <img src={info.src} alt={item.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', background: '#0F2A4A' }} />
          )}

          {/* Prev / next arrows — desktop; hidden if only one item */}
          {items.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={!canPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
                style={{ background: 'rgba(15,42,74,0.55)', color: 'white', opacity: canPrev ? 1 : 0.25, cursor: canPrev ? 'pointer' : 'default' }}
                aria-label="Previous"
              >
                <ChevronIcon direction="left" className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                disabled={!canNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
                style={{ background: 'rgba(15,42,74,0.55)', color: 'white', opacity: canNext ? 1 : 0.25, cursor: canNext ? 'pointer' : 'default' }}
                aria-label="Next"
              >
                <ChevronIcon direction="right" className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const { items: media } = useMedia();
  const [activeTab, setActiveTab] = useState('All Media');
  const [lightbox, setLightbox] = useState(null); // { items: [...], index: N }

  const published = media.filter(m => m.status === 'Published');
  const filtered  = published.filter(m => activeTab === 'All Media' || m.type === activeTab);

  const eventGroups = {};
  const singles = [];
  filtered.forEach((item) => {
    if (item.eventTitle) {
      eventGroups[item.eventTitle] = eventGroups[item.eventTitle] || [];
      eventGroups[item.eventTitle].push(item);
    } else {
      singles.push(item);
    }
  });
  const eventNames = Object.keys(eventGroups);

  const openLightbox = (items, index) => setLightbox({ items, index });
  const navigateLightbox = (index) => setLightbox((prev) => prev ? { ...prev, index } : prev);

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
          subtitle="Sermons, worship nights, event recordings, and highlight galleries — all in one place."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

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
            <>
              {eventNames.map((name) => (
                <HighlightsGallery key={name} eventTitle={name} items={eventGroups[name]} onPlay={openLightbox} />
              ))}

              {singles.length > 0 && (
                <>
                  {eventNames.length > 0 && (
                    <div className="mb-8">
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7' }} className="uppercase mb-2">More</p>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 700, color: '#0F2A4A' }}>
                        All Media
                      </h2>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {singles.map((item, i) => (
                      <MediaCard key={item.id} item={item} idx={i} onPlay={() => openLightbox(singles, i)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>

        {lightbox && (
          <MediaModal
            items={lightbox.items}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onNavigate={navigateLightbox}
          />
        )}
        <Footer />
      </div>
    </>
  );
}
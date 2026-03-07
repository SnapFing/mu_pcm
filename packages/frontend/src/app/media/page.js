'use client';
// media/page.js

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';

const TABS = ['All Media', 'Sermons', 'Event Videos', 'Photo Gallery'];

const MEDIA = [
  { id: 1, type: 'Sermons',       title: 'Balancing Faith and Academia',      speaker: 'Eng. Choolwe Sitima', date: 'Aug 20, 2025', duration: '42 min', thumbnail: '/media/sermon1.mp4' },
  { id: 2, type: 'Sermons',       title: 'The Fellowship Band Lesson Summary', speaker: 'Rev. Edward Phiri',   date: 'Sep 13, 2025', duration: '58 min', thumbnail: '/media/sermon2.jpg' },
  { id: 3, type: 'Event Videos',  title: 'Hymns and Harmony Worship Night',   speaker: 'Inspire Love Music',  date: 'Aug 27, 2025', duration: '1h 12m', thumbnail: '/media/worship.jpg' },
  { id: 4, type: 'Sermons',       title: 'Developing Christ-like Character',  speaker: 'Pastor James Mulenga', date: 'Oct 4, 2025', duration: '35 min', thumbnail: '/media/sermon3.jpg' },
  { id: 5, type: 'Event Videos',  title: 'Freshman Welcome Sabbath Recap',   speaker: 'PCM Media Team',      date: 'Sep 14, 2025', duration: '18 min', thumbnail: '/media/event1.jpg' },
];

function PlayIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="12" fill="rgba(46,109,231,0.85)"/>
      <polygon points="10 8 16 12 10 16 10 8" fill="white"/>
    </svg>
  );
}
function ClockIcon() {
  return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}

function MediaCard({ item }) {
  const { title, speaker, date, duration, thumbnail, type } = item;
  const isBlue = type === 'Sermons';

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      {/* Thumbnail */}
      <div className="relative overflow-hidden flex items-center justify-center"
        style={{ height: 180, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}>
        {thumbnail && (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover"
            onError={e => e.currentTarget.style.display = 'none'} />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <PlayIcon />
        </div>
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: isBlue ? 'rgba(46,109,231,0.85)' : 'rgba(124,58,237,0.85)', color: 'white', backdropFilter: 'blur(4px)' }}>
          {type}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
        <p style={{ fontSize: 12, color: '#64748B' }}>{speaker}</p>
        <div className="flex items-center gap-3 mt-auto pt-2" style={{ fontSize: 11, color: '#94A3B8' }}>
          <span>{date}</span>
          <span className="flex items-center gap-1"><ClockIcon /> {duration}</span>
        </div>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const [tab, setTab] = useState('All Media');
  const filtered = tab === 'All Media' ? MEDIA : MEDIA.filter(m => m.type === tab);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/media" />
        <PageHeader eyebrow="MU SDA PCM" title="Media Library" subtitle="Sermons, worship recordings, and event videos — all in one place." />

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

          {tab === 'Photo Gallery'
            ? (
              <div className="text-center py-20 rounded-2xl" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
                <p className="font-semibold" style={{ color: '#0F2A4A' }}>Photo Gallery</p>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Photos coming soon — check back after events.</p>
              </div>
            )
            : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(m => <MediaCard key={m.id} item={m} />)}
              </div>
            )
          }
        </div>

        <Footer />
      </div>
    </>
  );
}
'use client';
// journals/page.js

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader, SectionLabel } from '@/app/ui/PageHeader';
import { JournalCard } from './_components/JournalCard';

const JOURNALS = [
  { id: 1, title: 'Faith and Science: Finding Harmony',      author: 'Dr. Michael Tembo',   category: 'Academic',              date: 'Aug 15, 2023', pdfUrl: '#' },
  { id: 2, title: 'Prayer Journaling for Students',          author: 'Sarah Mwanza',        category: 'Spiritual Growth',      date: 'Jul 22, 2023', pdfUrl: '#' },
  { id: 3, title: 'Biblical Principles for Academic Success', author: 'Pastor James Mulenga',category: 'Academic',              date: 'Jun 10, 2023', pdfUrl: '#' },
  { id: 4, title: 'Finding Your Purpose at University',      author: 'Dr. Elizabeth Banda', category: 'Personal Development',  date: 'May 18, 2023', pdfUrl: '#' },
];

const CATEGORIES = ['All', ...new Set(JOURNALS.map(j => j.category))];

export default function JournalsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = JOURNALS
    .filter(j => filter === 'All' || j.category === filter)
    .filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/journals" />
        <PageHeader eyebrow="MU SDA PCM" title="Journals & Articles" subtitle="Academic and spiritual resources written by faith-driven scholars and ministers." />

        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex flex-wrap gap-2 flex-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: filter === cat ? '#2E6DE7' : '#F5F7FF',
                    color:      filter === cat ? 'white'   : '#475569',
                    border:     filter === cat ? '1px solid #2E6DE7' : '1px solid #E2E8F7',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Search journals..." value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm focus:outline-none w-full sm:w-56 transition-colors"
              style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}
              onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
              onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
          </div>

          <div className="flex flex-col gap-4">
            {filtered.length === 0
              ? <p className="text-center py-16" style={{ color: '#94A3B8' }}>No journals found.</p>
              : filtered.map(j => <JournalCard key={j.id} journal={j} />)
            }
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
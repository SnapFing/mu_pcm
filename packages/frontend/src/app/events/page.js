'use client';

import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import EventCard from './_components/EventCard';
import { useEvents, ALL_CATEGORIES } from './_hooks/useEvents';

const SearchIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

export default function EventsPage() {
  const { events, filter, setFilter, search, setSearch, categories } = useEvents();

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/events" />

        <PageHeader
          eyebrow="MU SDA PCM"
          title="Events Calendar"
          subtitle="Worship, fellowship, and growth opportunities for every student on campus."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: filter === cat ? '#2E6DE7' : '#F5F7FF',
                    color:      filter === cat ? 'white'    : '#475569',
                    border:     filter === cat ? '1px solid #2E6DE7' : '1px solid #E2E8F7',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#1E293B' }}
                onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'}
              />
            </div>
          </div>

          {/* Grid */}
          {events.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#94A3B8' }}>
              <p className="text-lg font-medium">No events found.</p>
              <p className="text-sm mt-1">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
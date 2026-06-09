
'use client';
import ErrorBoundary from '@/app/ui/ErrorBoundary';

import { useState } from 'react';
import Navbar    from '@/app/ui/Navbar';
import Footer    from '@/app/ui/Footer';
import { PageHeader, SectionLabel } from '@/app/ui/PageHeader';
import EventCard from './_components/EventCard';
import { useEvents } from '@/app/context/DataContext';
import Skeleton, { CardSkeleton } from '@/app/ui/Skeleton';

export default function EventsPage() {
  const { items: events, loading } = useEvents();
  const [active, setActive] = useState('All');

  const categories = ['All', 'Worship Services', 'Prayer', 'Bible Studies', 'Community', 'Retreats & Camps'];

  const upcoming = events.filter(e => e.status === 'Upcoming');
  const past     = events.filter(e => e.status === 'Past');

  const filter = (list) => active === 'All' ? list : list.filter(e => e.category === active);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      *, body { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/events" />

        <PageHeader
          eyebrow="What's On"
          title="Events & Gatherings"
          subtitle="Come together in worship, prayer, and fellowship. There's always something happening at MU PCM."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: active === cat ? '#2E6DE7' : '#F5F7FF',
                  color:      active === cat ? 'white'   : '#64748B',
                  border:     active === cat ? '1px solid #2E6DE7' : '1px solid #E2E8F7',
                }}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {/* Upcoming */}
              {filter(upcoming).length > 0 && (
                <ErrorBoundary>
                  <section className="mb-16">
                    <SectionLabel eyebrow="Don't Miss" title="Upcoming Events" color="blue" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filter(upcoming).map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                  </section>
                </ErrorBoundary>
              )}

              {/* Past */}
              {filter(past).length > 0 && (
                <ErrorBoundary>
                  <section>
                    <SectionLabel eyebrow="Look Back" title="Past Events" color="purple" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filter(past).map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                  </section>
                </ErrorBoundary>
              )}

              {filter(upcoming).length === 0 && filter(past).length === 0 && (
                <div className="text-center py-20 px-5">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(46,109,231,0.06)', color: '#2E6DE7' }}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F2A4A' }}>No events yet</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 320, margin: '0 auto' }}>
                    Check back soon — the ministry team adds new events regularly.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
        <Footer />
      </div>
    </>
  );
}

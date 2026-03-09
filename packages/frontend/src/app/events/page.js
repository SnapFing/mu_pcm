
'use client';

import { useState } from 'react';
import Navbar    from '@/app/ui/Navbar';
import Footer    from '@/app/ui/Footer';
import { PageHeader, SectionLabel } from '@/app/ui/PageHeader';
import EventCard from './_components/EventCard';
import { useEvents } from '@/app/context/DataContext';

export default function EventsPage() {
  const { items: events } = useEvents();
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

          {/* Upcoming */}
          {filter(upcoming).length > 0 && (
            <section className="mb-16">
              <SectionLabel eyebrow="Don't Miss" title="Upcoming Events" color="blue" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filter(upcoming).map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </section>
          )}

          {/* Past */}
          {filter(past).length > 0 && (
            <section>
              <SectionLabel eyebrow="Look Back" title="Past Events" color="purple" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filter(past).map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </section>
          )}

          {filter(upcoming).length === 0 && filter(past).length === 0 && (
            <p className="text-center py-20" style={{ color: '#94A3B8' }}>No events found for this category.</p>
          )}

        </div>
        <Footer />
      </div>
    </>
  );
}

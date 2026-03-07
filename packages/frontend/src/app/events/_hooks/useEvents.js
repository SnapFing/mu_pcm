/**
 * events/_hooks/useEvents.js
 * Provides filtered, sorted event data.
 * Currently uses static data — swap the EVENTS array for a Firebase fetch later.
 *
 * Usage:
 *   const { events, filter, setFilter, categories } = useEvents();
 */
'use client';

import { useState, useMemo } from 'react';

const EVENTS = [
  {
    id: 1,
    title: 'Sabbath Worship Service',
    category: 'Worship Services',
    date: '2026-03-14',
    time: '09:30 AM',
    venue: 'Rockside SDA Church',
    description: 'Join us for a Spirit-filled Sabbath morning service. All are warmly welcome — refreshments after service.',
    image: '/events/sabbath.jpg',
    featured: true,
  },
  {
    id: 2,
    title: 'Overnight Prayer',
    category: 'Prayer',
    date: '2026-03-20',
    time: '07:00 PM',
    venue: 'Chalabesa Hall',
    description: 'Seek God in prayer for reflection and spiritual growth. Transportation provided from the main gate.',
    image: '/events/prayer.jpg',
    featured: false,
  },
  {
    id: 3,
    title: 'Sunday Recreation',
    category: 'Community',
    date: '2026-03-22',
    time: '05:00 AM',
    venue: 'Mulungushi Grounds',
    description: 'Good health is worship. Exercise, prayer, and fellowship for outstanding academic performance.',
    image: '/events/recreation.jpg',
    featured: false,
  },
  {
    id: 4,
    title: 'Bible Study — Daniels Prophecies',
    category: 'Bible Studies',
    date: '2026-03-25',
    time: '06:00 PM',
    venue: 'Lecture Room 3',
    description: 'An in-depth study of Daniels prophecies and their relevance to students today.',
    image: '/events/bible.jpg',
    featured: false,
  },
  {
    id: 5,
    title: 'Community Service Day',
    category: 'Community',
    date: '2026-03-28',
    time: '08:00 AM',
    venue: 'Kabwe Community Centre',
    description: 'Putting faith into action — join us to serve the surrounding community with love.',
    image: '/events/service.jpg',
    featured: false,
  },
  {
    id: 6,
    title: 'Youth Retreat — Revive',
    category: 'Retreats & Camps',
    date: '2026-04-04',
    time: '07:00 AM',
    venue: 'Fringilla Lodge, Lusaka',
    description: 'A weekend retreat for spiritual refreshment, worship, and Christian fellowship.',
    image: '/events/retreat.jpg',
    featured: true,
  },
];

export const ALL_CATEGORIES = ['All', ...new Set(EVENTS.map(e => e.category))];

export function useEvents() {
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');

  const events = useMemo(() => {
    return EVENTS
      .filter(e => filter === 'All' || e.category === filter)
      .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) ||
                   e.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filter, search]);

  return { events, filter, setFilter, search, setSearch, categories: ALL_CATEGORIES };
}
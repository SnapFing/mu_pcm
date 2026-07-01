'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import Button from '@/app/ui/Button';
import SabbathGreeting from '@/app/ministry/SabbathGreeting';
import VerseDisplay from '@/app/ministry/VerseDisplay';
import CountdownTimer from '@/app/ministry/CountdownTimer';
import { downloadICS } from '@/app/utils/calendar';
import { useEvents } from '@/app/context/DataContext';
import { getFirebaseAuth } from '@/lib/firebase';
import { onIdTokenChanged } from 'firebase/auth';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Icon wrappers (use shared Icon exports)
import { ChevronRight as IconChevronRight, ChevronLeft as IconChevronLeft, CalendarIcon as IconCalendar, ClockIcon as IconClock, PinIcon as IconPin, BookIcon as IconBook, MediaIcon as IconMedia, StarIcon as IconStar, UsersIcon as IconUsers, CrossIcon as IconCross, CreditIcon as IconCredit, AlertIcon as IconAlert, BellIcon as IconBell, PaperclipIcon as IconPaperclip } from '@/app/ui/Icon';

const ChevronRight = ({ c = 'w-4 h-4' }) => <IconChevronRight className={c} />;
const ChevronLeft  = ({ c = 'w-4 h-4' }) => <IconChevronLeft className={c} />;
const CalIcon      = ({ c = 'w-5 h-5' }) => <IconCalendar className={c} />;
const PrayIcon     = ({ c = 'w-5 h-5' }) => <IconPin className={c} />;
const BookIcon     = ({ c = 'w-5 h-5' }) => <IconBook className={c} />;
const JournalIcon  = ({ c = 'w-5 h-5' }) => <IconBook className={c} />;
const MediaIcon    = ({ c = 'w-5 h-5' }) => <IconMedia className={c} />;
const StarIcon     = ({ c = 'w-5 h-5' }) => <IconStar className={c} />;
const UsersIcon    = ({ c = 'w-5 h-5' }) => <IconUsers className={c} />;
const ClockIcon    = ({ c = 'w-5 h-5' }) => <IconClock className={c} />;
const CrossIcon    = ({ c = 'w-5 h-5' }) => <IconCross className={c} />;
const CreditIcon   = ({ c = 'w-5 h-5' }) => <IconCredit className={c} />;
const AlertIcon    = ({ c = 'w-4 h-4' }) => <IconAlert className={c} />;
const BellIcon     = ({ c = 'w-4 h-4' }) => <IconBell className={c} />;

const quickLinks = [
  { href: '/events',   Icon: CalIcon,     label: 'Events'   },
  { href: '/prayer',   Icon: PrayIcon,    label: 'Prayer'   },
  { href: '/journals', Icon: JournalIcon, label: 'Journals' },
  { href: '/media',    Icon: MediaIcon,   label: 'Media'    },
  { href: '/heroes',   Icon: StarIcon,    label: 'Heroes'   },
  { href: '/groups',   Icon: UsersIcon,   label: 'Groups'   },
];

// ── Accent colors cycle ────────────────────────────────────────────────────
const ACCENTS = ['#2E6DE7', '#7C3AED', '#0F2A4A', '#059669', '#F59E0B'];

// ── Format date ────────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

// ── Media helpers ────────────────────────────────────────────────────────
// Checks several common field names since the exact one used by the upload
// form isn't confirmed yet. Tighten this once you confirm the real field.
function getMediaUrl(item) {
  // 'image' is the confirmed field used by the admin FileUpload component
  return (
    item.image ||
    item.imageUrl ||
    item.mediaUrl ||
    item.fileUrl ||
    item.attachmentUrl ||
    item.photoURL ||
    null
  );
}

function isImageUrl(url) {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i.test(url);
}

// ── Cards ──────────────────────────────────────────────────────────────────
function VerseCard() {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #2E6DE7' }}>
      <div className="px-6 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(46,109,231,0.1)', color: '#2E6DE7' }}>
          <BookIcon c="w-4 h-4" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#2E6DE7' }} className="uppercase">Morning Watch</p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>Today's devotion</p>
        </div>
      </div>
      <div className="flex-1 px-6 py-4" style={{ background: 'linear-gradient(160deg, rgba(46,109,231,0.04) 0%, rgba(46,109,231,0.01) 100%)', borderTop: '1px solid #E2E8F7', borderBottom: '1px solid #E2E8F7' }}>
        <VerseDisplay theme="light" />
      </div>
      <div className="px-6 py-4">
        <a href="/resources" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#2E6DE7' }}>
          More devotional resources <IconChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function EventCard({ nextEvent }) {
  const [rsvpDone, setRsvpDone] = React.useState(false);

  const handleAddToCalendar = (e) => {
    e.preventDefault();
    if (nextEvent) downloadICS(nextEvent);
  };

  if (!nextEvent) {
    return (
      <div className="rounded-2xl overflow-hidden flex flex-col h-full"
        style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #0F2A4A' }}>
        <div className="px-6 pt-5 pb-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(15,42,74,0.08)', color: '#0F2A4A' }}>
            <CalIcon c="w-4 h-4" />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#0F2A4A' }} className="uppercase">Next Gathering</p>
            <p style={{ fontSize: 11, color: '#94A3B8' }}>Coming up soon</p>
          </div>
        </div>
        <div className="flex-1 px-6 py-4 flex items-center justify-center" style={{ borderTop: '1px solid #E2E8F7' }}>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>No upcoming events</p>
        </div>
        <div className="px-6 py-4 flex justify-end" style={{ borderTop: '1px solid #E2E8F7', background: '#FAFBFF' }}>
          <a href="/events" className="text-xs font-semibold" style={{ color: '#2E6DE7' }}>View all events <IconChevronRight className="w-3.5 h-3.5" /></a>
        </div>
      </div>
    );
  }

  const mediaUrl = getMediaUrl(nextEvent);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #0F2A4A' }}>
      <div className="px-6 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(15,42,74,0.08)', color: '#0F2A4A' }}>
          <CalIcon c="w-4 h-4" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#0F2A4A' }} className="uppercase">Next Gathering</p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>Coming up soon</p>
        </div>
      </div>

      {mediaUrl && isImageUrl(mediaUrl) && (
        <div style={{ borderTop: '1px solid #E2E8F7' }}>
          <img
            src={mediaUrl}
            alt={nextEvent.title || 'Event image'}
            className="w-full object-cover"
            style={{ height: 140 }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="flex-1 px-6 py-4 flex flex-col gap-4" style={{ borderTop: mediaUrl ? 'none' : '1px solid #E2E8F7' }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: '#0F2A4A', lineHeight: 1.2 }}>{nextEvent.title}</h3>
          {nextEvent.description && <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{nextEvent.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', fontSize: 11, color: '#475569', fontWeight: 500 }}>
            <ClockIcon c="w-3 h-3" /> {fmtDate(nextEvent.date)}{nextEvent.time ? ` · ${formatTime(nextEvent.time)}` : ''}
          </span>
          {nextEvent.venue && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', fontSize: 11, color: '#475569', fontWeight: 500 }}>
              <PrayIcon c="w-3 h-3" /> {nextEvent.venue}
            </span>
          )}
          {mediaUrl && !isImageUrl(mediaUrl) && (
            <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', fontSize: 11, color: '#2E6DE7', fontWeight: 600 }}>
              📎 Attachment
            </a>
          )}
        </div>
        <CountdownTimer targetDate={`${nextEvent.date}T${nextEvent.time || '00:00'}:00+02:00`} />
      </div>
      <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: '1px solid #E2E8F7', background: '#FAFBFF' }}>
        <button
          onClick={handleAddToCalendar}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#0F2A4A'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
        >
          <CalIcon c="w-3.5 h-3.5" /> Add to Calendar
        </button>
        {rsvpDone ? (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
            ✓ See you there!
          </span>
        ) : (
          <button
            onClick={() => setRsvpDone(true)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: '#2E6DE7', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
            onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}
          >
            I&apos;m Coming
          </button>
        )}
      </div>
    </div>
  );
}

function MembershipCard() {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #7C3AED' }}>
      <div className="px-6 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
          <CreditIcon c="w-4 h-4" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#7C3AED' }} className="uppercase">Membership</p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>Semester contribution</p>
        </div>
      </div>
      <div className="flex-1 px-6 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid #E2E8F7' }}>
        <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <AlertIcon />
          <p style={{ fontSize: 12, color: '#5b21b6', lineHeight: 1.55 }}>
            <strong>Due 31 March 2026.</strong> Keep your membership active to access all PCM events.
          </p>
        </div>
        {[
          { label: 'Amount',       value: 'ZMW 50.00 / semester'     },
          { label: 'Pay to',       value: 'Prince Bwalya (Treasurer)' },
          { label: 'Mobile Money', value: 'MTN: 0976 123 456'         },
          { label: 'Reference',    value: 'Name + Student ID'          },
          { label: 'Please ensure you get your receipt upon any payments' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3 pb-2.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 12, color: '#0F2A4A', fontWeight: 600, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: '1px solid #E2E8F7', background: '#FAFBFF' }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>Questions? Contact treasurer</span>
        <Button href="/contact" variant="primary" size="sm" className="px-4 py-1.5">Contact Us</Button>
      </div>
    </div>
  );
}

// ── Carousel ───────────────────────────────────────────────────────────────
function InfoCarousel({ nextEvent }) {
  const cards = [
    <VerseCard key="verse" />,
    <EventCard key="event" nextEvent={nextEvent} />,
    <MembershipCard key="membership" />,
  ];
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const TOTAL = cards.length;

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % TOTAL), 6000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const prev = () => { setIndex(i => (i - 1 + TOTAL) % TOTAL); startTimer(); };
  const next = () => { setIndex(i => (i + 1) % TOTAL); startTimer(); };

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {cards.map((card, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              {card}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); startTimer(); }}
              className="rounded-full transition-all duration-300"
              style={{
                width:  index === i ? 22 : 7,
                height: 7,
                background: index === i ? '#2E6DE7' : '#CBD5E1',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F5F7FF', color: '#64748B', border: '1px solid #E2E8F7' }}>
            <ChevronLeft c="w-4 h-4" />
          </button>
          <button onClick={next} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#2E6DE7', color: 'white' }}>
            <ChevronRight c="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Live Announcements + Events Section ────────────────────────────────────
function WhatsHappeningSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [annRes, evtRes] = await Promise.all([
          fetch(`${API}/api/announcements`),
          fetch(`${API}/api/events`),
        ]);
        const announcements = await annRes.json();
        const events = await evtRes.json();

        const taggedAnn = (Array.isArray(announcements) ? announcements : [])
          .filter(a => a.status === 'Active')
          .filter(a => {
            if (!a.expiresAt) return true;
            const cutoff = new Date(`${a.expiresAt}T${a.expiresTime || '23:59'}:00`);
            return cutoff.getTime() >= Date.now();
          })
          .slice(0, 3)
          .map((a, i) => ({
            ...a,
            _kind: 'announcement',
            accentColor: ACCENTS[i % ACCENTS.length],
            tag: a.type || 'Announcement',
            displayDate: fmtDate(a.date),
          }));

        const today = new Date().toISOString().split('T')[0];
        const taggedEvt = (Array.isArray(events) ? events : [])
          .filter(e => e.status === 'Upcoming' || (e.date && e.date >= today))
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
          .slice(0, 3)
          .map((e, i) => ({
            ...e,
            _kind: 'event',
            accentColor: ACCENTS[(i + 2) % ACCENTS.length],
            tag: 'Upcoming Event',
            displayDate: fmtDate(e.date),
          }));

        setItems([...taggedAnn, ...taggedEvt].slice(0, 6));
      } catch (err) {
        console.error('WhatsHappening fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3].map(i => (
        <div key={i} className="rounded-2xl h-48 animate-pulse" style={{ background: '#F1F5F9' }} />
      ))}
    </div>
  );

  if (items.length === 0) return (
    <p style={{ color: '#94A3B8', fontSize: 14 }}>No announcements or upcoming events yet.</p>
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => {
        const mediaUrl = getMediaUrl(item);
        const showImage = mediaUrl && isImageUrl(mediaUrl);

        return (
          <div key={item.id || idx}
            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: `3px solid ${item.accentColor}` }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,109,231,0.12)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

            {showImage && (
              <img
                src={mediaUrl}
                alt={item.title || 'Attached image'}
                className="w-full object-cover"
                style={{ height: 150 }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}

            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide flex items-center gap-1"
                  style={{ background: item.accentColor + '15', color: item.accentColor, border: `1px solid ${item.accentColor}30` }}>
                  {item._kind === 'event' ? <CalIcon c="w-3 h-3" /> : <BellIcon c="w-3 h-3" />}
                  {item.tag}
                </span>
                <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{item.displayDate}</span>
              </div>
              <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>
                {item._kind === 'event' ? item.description : item.body}
              </p>

              {mediaUrl && !showImage && (
                <a href={mediaUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-full"
                  style={{ background: '#F5F7FF', color: '#2E6DE7', border: '1px solid #E2E8F7' }}>
                  📎 View attachment
                </a>
              )}

              {item._kind === 'event' && (item.venue || item.time) && (
                <div className="flex flex-wrap gap-3 pt-3" style={{ borderTop: '1px solid #F1F5F9', fontSize: 10, color: '#94A3B8' }}>
                  {item.venue && <span className="flex items-center gap-1"><PrayIcon c="w-3 h-3" />{item.venue}</span>}
                  {item.time  && <span className="flex items-center gap-1"><ClockIcon c="w-3 h-3" />{item.time}</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Animated stat counter ───────────────────────────────────────────────
function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return count;
}

function StatCounter({ value, suffix, start, duration = 1600 }) {
  const count = useCountUp(value, duration, start);
  return <>{count}{suffix}</>;
}

// ── Stats section (real data + scroll-triggered count-up) ─────────────────
function StatsSection() {
  const [stats, setStats] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API}/api/stats`);
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    }
    loadStats();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = [
    { value: stats?.members ?? 0,       suffix: '+',   label: 'Members',  Icon: UsersIcon },
    { value: stats?.groups ?? 0,        suffix: '',    label: 'Groups',   Icon: UsersIcon },
    { value: stats?.events ?? 0,        suffix: '+',   label: 'Events',   Icon: CalIcon   },
    { value: stats?.ministryYears ?? 0, suffix: 'yrs', label: 'Ministry', Icon: CrossIcon },
  ];

  return (
    <section ref={sectionRef} className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {items.map(({ value, suffix, label, Icon }, i) => (
          <div key={label} className="text-center">
            <div className="rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ width: 52, height: 52, background: i % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)', color: i % 2 === 0 ? '#2E6DE7' : '#7C3AED' }}>
              <Icon c="w-5 h-5" />
            </div>
            <p className="font-extrabold leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#0F2A4A' }}>
              {stats ? <StatCounter value={value} suffix={suffix} start={inView} /> : '—'}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.1em' }} className="uppercase">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { items: events } = useEvents();
  const upcoming = events
    .filter(e => e.status === 'Upcoming')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const nextEvent = upcoming[0] || null;

  // ── Student name for greeting ──────────────────────────────────────
  const [studentName, setStudentName] = useState(null);

    useEffect(() => {
        const auth = getFirebaseAuth();
        if (!auth) return;
        const unsub = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const res = await fetch(`${API}/api/students/me`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            const profile = await res.json();
            setStudentName(profile.name);
          } else {
            setStudentName(null);
          }
        } catch {
          setStudentName(null);
        }
      } else {
        setStudentName(null);
      }
    });
    return unsub;
  }, []);

  const userName = studentName || "Friend";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
        *, body { font-family: 'Noto Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        html { scroll-behavior: smooth; }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/dashboard" />

        {/* Hero */}
        <section className="relative flex items-center justify-center overflow-hidden" style={{ height: 'clamp(480px, 78vh, 700px)' }}>
          <img src="/img0.jpg" alt="MU Campus Worship" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,42,74,0.4) 0%, rgba(15,42,74,0.75) 50%, rgba(15,42,74,0.95) 100%)' }} />
          <div className="relative z-10 text-center px-5 sm:px-8 w-full max-w-4xl mx-auto">
            <h2 className="serif font-bold text-white leading-[1.08] mb-5" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}>Mulungushi University Public Campus Ministry</h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div style={{ height: 1, width: 48, background: 'rgba(46,109,231,0.7)', borderRadius: 9999 }} />
              <div style={{ width: 6, height: 6, borderRadius: 9999, background: '#2E6DE7' }} />
              <div style={{ height: 1, width: 48, background: 'rgba(46,109,231,0.7)', borderRadius: 9999 }} />
            </div>
            <p className="font-semibold text-white mb-3" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)' }}>Follow Jesus. Embrace His Mission.</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 420, margin: '0 auto 2.5rem' }}>A community of faith, purpose, and excellence — right here on campus.</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Sabbath Greeting */}
          <div className="py-10" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="rounded-2xl px-6 sm:px-8 py-6" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
              <SabbathGreeting name={userName} />
            </div>
          </div>

          {/* Stats — now real, animated on scroll */}
          <StatsSection />

          {/* Carousel */}
          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7' }} className="uppercase mb-2">Daily Updates</p>
                <h2 className="serif font-bold" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: '#0F2A4A' }}>What's On Today</h2>
              </div>
            </div>
            <InfoCarousel nextEvent={nextEvent} />
          </section>

          {/* What's Happening */}
          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">What's Happening</p>
                <h2 className="serif font-bold" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: '#0F2A4A' }}>Announcements & Events</h2>
              </div>
              <a href="/events" className="flex items-center gap-1 text-sm font-semibold whitespace-nowrap" style={{ color: '#2E6DE7' }}>
                All events <ChevronRight c="w-4 h-4" />
              </a>
            </div>
            <WhatsHappeningSection />
          </section>

          {/* Explore PCM quick-nav */}
          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="mb-10">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">Navigate</p>
              <h2 className="serif font-bold" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: '#0F2A4A' }}>Explore PCM</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {quickLinks.map(({ href, Icon, label }, i) => (
                <a key={href} href={href} className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 3px rgba(46,109,231,0.05)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: i % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)', color: i % 2 === 0 ? '#2E6DE7' : '#7C3AED' }}>
                    <Icon c="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center" style={{ color: '#64748B' }}>{label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Scripture Banner */}
          <section className="py-16">
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F2A4A 0%, #1a3d68 50%, #2E6DE7 100%)' }}>
              <div className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.05 }}>
                <CrossIcon c="w-48 h-48 sm:w-56 sm:h-56" />
              </div>
              <div className="relative z-10 px-8 sm:px-16 py-16 sm:py-20 text-center">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)' }} className="uppercase mb-8">Scripture of the Week</p>
                <blockquote className="serif font-bold italic text-white leading-relaxed max-w-3xl mx-auto" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)' }}>
                  "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
                </blockquote>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div style={{ height: 1, width: 40, background: 'rgba(46,109,231,0.5)', borderRadius: 9999 }} />
                  <cite style={{ color: '#2E6DE7', fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', fontStyle: 'normal' }}>Jeremiah 29:11</cite>
                  <div style={{ height: 1, width: 40, background: 'rgba(46,109,231,0.5)', borderRadius: 9999 }} />
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}
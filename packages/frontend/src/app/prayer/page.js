'use client';

import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import PrayerForm from './_components/PrayerForm';

const prayerChainStats = [
  { value: '24h', label: 'Daily Coverage' },
  { value: '50+', label: 'Prayer Warriors' },
  { value: '1yr', label: 'Unbroken Chain' },
];

const scriptures = [
  { text: 'Do not be anxious about anything, but in every situation present your requests to God.', ref: 'Philippians 4:6' },
  { text: 'The prayer of a righteous person is powerful and effective.', ref: 'James 5:16' },
  { text: 'Call to me and I will answer you and tell you great and unsearchable things.', ref: 'Jeremiah 33:3' },
];

export default function PrayerPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/prayer" />

        <PageHeader
          eyebrow="MU SDA PCM"
          title="Prayer Ministry"
          subtitle="Bring your burdens to God. Our prayer team stands with you in faith, day and night."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left — Form */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">
                Submit a Request
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 24 }}>
                Let Us Pray With You
              </h2>
              <PrayerForm />
            </div>

            {/* Right — Info */}
            <div className="flex flex-col gap-8">

              {/* Prayer chain stats */}
              <div className="rounded-2xl p-7" style={{ background: '#2E6DE7' }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.65)' }} className="uppercase mb-4">
                  24-Hour Prayer Chain
                </p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: 20 }}>
                  Established by Prayer Band Leader Elina Mwelwa, our 24-hour prayer chain has run continuously for over a year, providing spiritual support for every student in need.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {prayerChainStats.map(({ value, label }) => (
                    <div key={label} className="text-center rounded-xl py-3" style={{ background: 'rgba(255,255,255,0.12)' }}>
                      <p className="font-extrabold text-white" style={{ fontSize: 22 }}>{value}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: 2 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer scriptures */}
              <div className="flex flex-col gap-4">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#2E6DE7' }} className="uppercase mb-1">
                  Promises to Stand On
                </p>
                {scriptures.map((s, i) => (
                  <div key={i} className="rounded-2xl p-5 flex flex-col gap-2"
                    style={{ background: i % 2 === 0 ? '#F5F7FF' : 'white', border: '1px solid #E2E8F7' }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 14, color: '#0F2A4A', lineHeight: 1.7 }}>
                      "{s.text}"
                    </p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.1em' }}>— {s.ref}</p>
                  </div>
                ))}
              </div>

              {/* Join prayer team CTA */}
              <div className="rounded-2xl p-6 flex items-center gap-5"
                style={{ background: 'linear-gradient(135deg, #0F2A4A, #1a3d68)', border: '1px solid rgba(46,109,231,0.3)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(46,109,231,0.25)' }}>
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Join the Prayer Team</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: 2 }}>
                    Commit one hour a week to intercede for fellow students.
                  </p>
                </div>
                <a href="/contact"
                  className="ml-auto shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
                  style={{ background: '#2E6DE7', color: 'white' }}>
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
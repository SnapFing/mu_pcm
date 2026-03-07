'use client';

import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader, SectionLabel } from '@/app/ui/PageHeader';
import HeroCard from './_components/HeroCard';



const heroes = [
  {
    name: 'Victor Mutinta',
    role: 'PCM Chairperson 2024–2025',
    summary: 'Victor led the PCM through one of its most challenging years, organizing virtual worship sessions during the pandemic and maintaining community spirit against all odds.',
    image: '/heroes/victor.jpg',
    badge: { label: 'Leadership', color: 'blue' },
  },
  {
    name: 'Agness Bwalya',
    role: 'Social Welfare Committee Leader',
    summary: 'Agness organized multiple community service initiatives, including a successful fundraiser that provided school supplies to underprivileged children in Kabwe.',
    image: '/heroes/agness.jpg',
    badge: { label: 'Service', color: 'purple' },
  },
  {
    name: 'Emmanuel Siasuntwe',
    role: 'Personal Ministries',
    summary: "Emmanuel's innovative approach to Bible study attracted many non-believers to the group, resulting in 15 baptisms last year — a testament to Spirit-led outreach.",
    image: '/heroes/emmanuel.jpg',
    badge: { label: 'Evangelism', color: 'blue' },
  },
  {
    name: 'Dickson Liseli',
    role: 'Choir Director',
    summary: 'Dickson revitalized the PCM choir, composing original worship songs that have been adopted by several churches across Kabwe and featured in campus media.',
    image: '/heroes/dickson.jpg',
    badge: { label: 'Worship', color: 'purple' },
  },
  {
    name: 'Elina Mwelwa',
    role: 'Prayer Band Leader',
    summary: 'Elina established the 24-hour prayer chain that has been running continuously for over a year, providing round-the-clock spiritual support for every student in need.',
    image: '/heroes/elina.jpg',
    badge: { label: 'Prayer', color: 'blue' },
  },
  {
    name: 'Kenty Siawala',
    role: 'MU-SASM Chairperson',
    summary: "Kenty pioneered the campus-wide 'Faith Conversations' program that created safe spaces for interfaith dialogue and deepened understanding among students of all backgrounds.",
    image: '/heroes/kenty.jpg',
    badge: { label: 'Unity', color: 'purple' },
  },
];

export default function HeroesPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/heroes" />

        <PageHeader
          eyebrow="MU SDA PCM"
          title="Campus Heroes & Heroines"
          subtitle="Meet the extraordinary individuals whose faith, dedication, and service continue to inspire our community."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <SectionLabel eyebrow="Class of 2024–2025" title="Extraordinary Individuals" color="purple" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map(hero => <HeroCard key={hero.name} hero={hero} />)}
          </div>

          {/* Nomination CTA */}
          <div className="mt-16 rounded-2xl p-8 sm:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #0F2A4A, #1a3d68)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-4">
              Recognise a Fellow Student
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
              Nominate a Campus Hero
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 28px' }}>
              Know a student who is making a difference in faith, academics, or service? Nominate them to be featured here.
            </p>
            <a href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-full text-sm font-bold transition-all shadow-lg"
              style={{ background: '#2E6DE7', color: 'white' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
              onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}>
              Submit a Nomination
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
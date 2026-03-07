'use client';
// resources/page.js

import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader, SectionLabel } from '@/app/ui/PageHeader';

// ── Icon primitives ────────────────────────────────────────────────────────
const Ico = ({ children, className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

function DownloadIcon() {
  return <Ico className="w-4 h-4"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Ico>;
}
const PlannerIcon  = ({ c = 'w-6 h-6' }) => <Ico className={c}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></Ico>;
const ScheduleIcon = ({ c = 'w-6 h-6' }) => <Ico className={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></Ico>;
const ExamIcon     = ({ c = 'w-6 h-6' }) => <Ico className={c}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></Ico>;
const ListIcon     = ({ c = 'w-6 h-6' }) => <Ico className={c}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></Ico>;

const downloadables = [
  { title: 'Academic Year Planner',         desc: 'A comprehensive planner designed specifically for Mulungushi University students.', Icon: PlannerIcon,  accent: 'blue',   href: '#' },
  { title: 'Weekly Study Schedule',         desc: 'Organize your weekly study sessions with this customizable template.',              Icon: ScheduleIcon, accent: 'purple', href: '#' },
  { title: 'Exam Preparation Guide',        desc: 'Strategic approaches to preparing for exams while maintaining spiritual health.',   Icon: ExamIcon,     accent: 'blue',   href: '#' },
  { title: 'Task Prioritization Worksheet', desc: 'Learn how to prioritize tasks based on importance and urgency.',                   Icon: ListIcon,     accent: 'purple', href: '#' },
];

const studyTips = [
  { num: '01', title: 'Create a Dedicated Study Space', body: 'Find a quiet, well-lit area where you can focus without distractions. Keep it organized and use it consistently.' },
  { num: '02', title: 'Use the Pomodoro Technique',     body: 'Study for 25 minutes, take a 5-minute break. After four cycles, enjoy a 15-30 minute rest.' },
  { num: '03', title: 'Start With the Hardest Subject', body: 'Tackle challenging material when your mind is fresh and save easier tasks for when your energy is lower.' },
  { num: '04', title: 'Include Prayer and Reflection',  body: 'Begin and end study sessions with prayer. Reflect on how your studies connect to your faith and purpose.' },
];

const faithTips = [
  { num: '01', title: 'Schedule Daily Devotional Time',    body: 'Set aside a specific time each day for Bible study and prayer, treating it as important as your classes.' },
  { num: '02', title: 'Join a Study Group',                body: 'Connect with fellow believers for academic sessions that begin or end with prayer and encouragement.' },
  { num: '03', title: 'Apply Sabbath Principles',          body: 'Designate one day as a rest day from academic work to focus on worship, fellowship, and renewal.' },
  { num: '04', title: 'Integrate Faith Into Your Studies', body: 'Look for connections between academic subjects and faith. Consider how your learning can be used in service.' },
];

function ResourceCard({ resource }) {
  const { title, desc, Icon, href, accent } = resource;
  const isBlue = accent === 'blue';
  const color  = isBlue ? '#2E6DE7' : '#7C3AED';
  const bg     = isBlue ? 'rgba(46,109,231,0.1)' : 'rgba(124,58,237,0.1)';

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,109,231,0.11)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg, color }}>
        <Icon c="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold mb-1" style={{ color: '#0F2A4A', fontSize: 15 }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
      </div>
      <a href={href || '#'}
        className="self-start flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all"
        style={{ background: bg, color }}
        onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg;    e.currentTarget.style.color = color;  }}>
        <DownloadIcon /> Download PDF
      </a>
    </div>
  );
}

function TipCard({ tip, accent }) {
  const isBlue = accent === 'blue';
  return (
    <div className="flex gap-4 p-5 rounded-2xl" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
      <span className="font-extrabold text-sm shrink-0 mt-0.5" style={{ color: isBlue ? '#2E6DE7' : '#7C3AED' }}>{tip.num}</span>
      <div>
        <p className="font-bold text-sm mb-1" style={{ color: '#0F2A4A' }}>{tip.title}</p>
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{tip.body}</p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/resources" />
        <PageHeader eyebrow="MU SDA PCM" title="Campus Resources"
          subtitle="Balancing academics, spiritual growth, and personal life — practical tools to help you thrive." />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 space-y-16">
          <section>
            <SectionLabel eyebrow="Free Downloads" title="Downloadable Resources" color="blue" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {downloadables.map(r => <ResourceCard key={r.title} resource={r} />)}
            </div>
          </section>

          <section>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <SectionLabel eyebrow="Academic" title="Study Tips for Success" color="blue" />
                <div className="flex flex-col gap-3">
                  {studyTips.map(t => <TipCard key={t.num} tip={t} accent="blue" />)}
                </div>
              </div>
              <div>
                <SectionLabel eyebrow="Spiritual" title="Balancing Faith & Academics" color="purple" />
                <div className="flex flex-col gap-3">
                  {faithTips.map(t => <TipCard key={t.num} tip={t} accent="purple" />)}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl p-8 sm:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.5)' }} className="uppercase mb-6">
              For the Student
            </p>
            <blockquote style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 700, fontStyle: 'italic', color: 'white', lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
              "Whatever you do, work at it with all your heart, as working for the Lord."
            </blockquote>
            <p style={{ color: 'rgba(46,109,231,0.9)', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', marginTop: 20 }}>— Colossians 3:23</p>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
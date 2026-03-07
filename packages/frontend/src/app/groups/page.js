'use client';

// groups/page.js

import { useState } from 'react';
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

const ChoirIcon   = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Ico>;
const MediaIcon   = ({ c = 'w-5 h-5' }) => <Ico className={c}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></Ico>;
const HealthIcon  = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Ico>;
const PreachIcon  = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></Ico>;
const WelfareIcon = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Ico>;
const PrayerIcon  = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></Ico>;
const SabbathIcon = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M12 22s-8-5.25-8-11a8 8 0 0116 0c0 5.75-8 11-8 11z"/></Ico>;
const YouthIcon   = ({ c = 'w-5 h-5' }) => <Ico className={c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Ico>;
const JournalIcon = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></Ico>;

// ── Data ───────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    id: 1,
    name: 'Campus Choir',
    department: 'Worship & Music',
    Icon: ChoirIcon,
    accent: 'blue',
    leader: 'Choolwe Sitima',
    members: 24,
    meetingDay: 'Thursdays, 6:00 PM',
    venue: 'Music Room, Block B',
    description: 'The heartbeat of PCM worship. We lead the congregation in Spirit-filled praise, compose original worship songs, and perform at campus events and church services across Kabwe.',
    requirements: 'Open to all — singers, instrumentalists, and worship leaders welcome.',
  },
  {
    id: 2,
    name: 'Media Department',
    department: 'Media & Publications',
    Icon: MediaIcon,
    accent: 'purple',
    leader: 'PCM Media Team',
    members: 12,
    meetingDay: 'Tuesdays, 5:00 PM',
    venue: 'Media Lab, Student Center',
    description: 'We capture, produce, and broadcast the ministry\'s activities — sermons, event coverage, social media, graphic design, photography, and video production for digital outreach.',
    requirements: 'Interest in photography, videography, design, or social media management.',
  },
  {
    id: 3,
    name: 'Health & Temperance Band',
    department: 'Health Ministry',
    Icon: HealthIcon,
    accent: 'blue',
    leader: 'Dr. Elizabeth Banda',
    members: 30,
    meetingDay: 'Sundays, 5:00 AM',
    venue: 'Mulungushi Sports Grounds',
    description: 'Good health is worship. We organize early morning fitness sessions, health talks, vegetarian cooking demonstrations, and campus health screenings — body, mind, and spirit.',
    requirements: 'A commitment to healthy living and a willingness to serve others.',
  },
  {
    id: 4,
    name: 'Preaching Band',
    department: 'Personal Ministries',
    Icon: PreachIcon,
    accent: 'purple',
    leader: 'Emmanuel Siasuntwe',
    members: 18,
    meetingDay: 'Wednesdays, 6:30 PM',
    venue: 'Chalabesa Hall',
    description: 'We take the Gospel to every corner of campus and beyond — street evangelism, dorm-room Bible studies, and outreach programs in the surrounding Kabwe community.',
    requirements: 'A passion for evangelism. Training and mentorship provided for new members.',
  },
  {
    id: 5,
    name: 'Social Welfare Committee',
    department: 'Community Service',
    Icon: WelfareIcon,
    accent: 'blue',
    leader: 'Agness Bwalya',
    members: 22,
    meetingDay: 'Fridays, 4:00 PM',
    venue: 'PCM Office, Student Center',
    description: 'Faith in action. We coordinate community service projects, fundraisers for students in need, food drives, and partnerships with local schools and orphanages in Kabwe.',
    requirements: 'A servant heart and availability for occasional weekend service days.',
  },
  {
    id: 6,
    name: 'Prayer Band',
    department: 'Prayer Ministry',
    Icon: PrayerIcon,
    accent: 'purple',
    leader: 'Elina Mwelwa',
    members: 50,
    meetingDay: 'Daily — rotating shifts',
    venue: 'Prayer Room, Block A',
    description: 'We maintain the 24-hour prayer chain that has run unbroken for over a year. Members commit to a one-hour weekly prayer slot, interceding for students, campus, and the nation.',
    requirements: 'Commitment to one prayer hour per week. All faith levels welcome.',
  },
  {
    id: 7,
    name: 'Sabbath School Teachers',
    department: 'Sabbath School',
    Icon: SabbathIcon,
    accent: 'blue',
    leader: 'Victor Mutinta',
    members: 14,
    meetingDay: 'Saturdays, 9:00 AM',
    venue: 'Rockside SDA Church',
    description: 'We facilitate Sabbath School lessons every week — leading discussions, preparing lesson materials, and nurturing spiritual growth through Scripture study for all age groups.',
    requirements: 'Good knowledge of the Bible and Adventist teachings. Training provided.',
  },
  {
    id: 8,
    name: 'Adventist Youth (AY)',
    department: 'Youth Ministry',
    Icon: YouthIcon,
    accent: 'purple',
    leader: 'Kenty Siawala',
    members: 80,
    meetingDay: 'Saturdays, 3:00 PM',
    venue: 'Rockside SDA Church Hall',
    description: 'The official Adventist Youth Society for MU students — leadership development, Pathfinder programs, community projects, vespers, and inter-campus fellowship events.',
    requirements: 'Open to all university students. Come as you are.',
  },
  {
    id: 9,
    name: 'Publishing & Journals',
    department: 'Media & Publications',
    Icon: JournalIcon,
    accent: 'blue',
    leader: 'PCM Publications Team',
    members: 8,
    meetingDay: 'Mondays, 5:30 PM',
    venue: 'Library Seminar Room',
    description: 'We write, edit, and publish the PCM journal — articles on faith, academia, and student life. We also produce devotional booklets and the PCM newsletter distributed campus-wide.',
    requirements: 'Strong writing or editing skills. Open to all disciplines.',
  },
];

const ALL_DEPARTMENTS = ['All', ...new Set(GROUPS.map(g => g.department))];

// ── Join Modal ─────────────────────────────────────────────────────────────
function JoinModal({ group, onClose }) {
  const [form, setForm]           = useState({ name: '', email: '', studentId: '', year: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSubmit = form.name && form.email && form.studentId && form.motivation.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const inputStyle = {
    background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#1E293B',
    width: '100%', borderRadius: 12, fontSize: 14, padding: '10px 16px', outline: 'none',
  };
  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: '#475569',
    letterSpacing: '0.05em', display: 'block', marginBottom: 6,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="px-7 py-5 flex items-center justify-between" style={{ background: '#0F2A4A' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-1">
              Join Request
            </p>
            <h3 className="font-bold text-white" style={{ fontSize: 17 }}>{group.name}</h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-7">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(46,109,231,0.12)' }}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2E6DE7" strokeWidth={2} strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg" style={{ color: '#0F2A4A' }}>Request Submitted!</h3>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>
                Your request to join <strong>{group.name}</strong> has been sent to the group leader. They'll be in touch soon.
              </p>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: '#94A3B8' }}>
                "Whatever you do, work at it with all your heart." — Colossians 3:23
              </p>
              <button onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold"
                style={{ background: '#2E6DE7', color: 'white' }}>
                Done
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" placeholder="John Mwanza" value={form.name}
                    onChange={e => set('name', e.target.value)} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
                </div>
                <div>
                  <label style={labelStyle}>Student ID <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" placeholder="MU/2024/001" value={form.studentId}
                    onChange={e => set('studentId', e.target.value)} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="email" placeholder="john@example.com" value={form.email}
                    onChange={e => set('email', e.target.value)} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
                </div>
                <div>
                  <label style={labelStyle}>Year of Study</label>
                  <select value={form.year} onChange={e => set('year', e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                    onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'}>
                    <option value="">Select year</option>
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Why do you want to join? <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea rows={4} placeholder="Share your motivation and any relevant experience..."
                  value={form.motivation} onChange={e => set('motivation', e.target.value)}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.7, padding: '12px 16px' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                  onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
              </div>
              <button onClick={handleSubmit} disabled={loading || !canSubmit}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: loading || !canSubmit ? '#CBD5E1' : '#2E6DE7',
                  color: 'white',
                  cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
                }}>
                {loading ? 'Submitting...' : 'Submit Join Request'}
              </button>
              <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
                Your request will be reviewed by the group leader.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Group Card ─────────────────────────────────────────────────────────────
function GroupCard({ group, onJoin }) {
  const { Icon } = group;
  const isBlue      = group.accent === 'blue';
  const accentColor = isBlue ? '#2E6DE7' : '#7C3AED';
  const accentBg    = isBlue ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)';

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      <div style={{ height: 3, background: accentColor }} />

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: accentBg, color: accentColor }}>
            <Icon c="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 15 }}>{group.name}</h3>
            <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide"
              style={{ background: accentBg, color: accentColor }}>
              {group.department}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>{group.description}</p>

        <div className="rounded-xl p-3 flex gap-2" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
          <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none"
            stroke={accentColor} strokeWidth={2.5} strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{group.requirements}</p>
        </div>

        <div className="flex flex-col gap-1.5 pt-1" style={{ borderTop: '1px solid #F1F5F9' }}>
          {[
            {
              path: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
              text: `${group.members} members · Led by ${group.leader}`,
            },
            {
              path: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
              text: group.meetingDay,
            },
            {
              path: <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
              text: group.venue,
            },
          ].map(({ path, text }) => (
            <div key={text} className="flex items-center gap-1.5" style={{ fontSize: 11, color: '#94A3B8' }}>
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {path}
              </svg>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <button onClick={() => onJoin(group)}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: accentColor, color: 'white' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Request to Join
        </button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function GroupsPage() {
  const [filter, setFilter]               = useState('All');
  const [search, setSearch]               = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const filtered = GROUPS
    .filter(g => filter === 'All' || g.department === filter)
    .filter(g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()) ||
      g.department.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/groups" />

        <PageHeader
          eyebrow="MU SDA PCM"
          title="Campus Groups & Departments"
          subtitle="Find your place to serve. Every group is a family — discover where your gifts can shine for God's glory."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mb-12 p-6 rounded-2xl"
            style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
            {[
              { value: GROUPS.length,                                    label: 'Active Groups' },
              { value: GROUPS.reduce((s, g) => s + g.members, 0) + '+', label: 'Total Members' },
              { value: ALL_DEPARTMENTS.length - 1,                       label: 'Departments'   },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-extrabold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0F2A4A' }}>{value}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em' }} className="uppercase">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {ALL_DEPARTMENTS.map(dep => (
                <button key={dep} onClick={() => setFilter(dep)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: filter === dep ? '#2E6DE7' : '#F5F7FF',
                    color:      filter === dep ? 'white'   : '#475569',
                    border:     filter === dep ? '1px solid #2E6DE7' : '1px solid #E2E8F7',
                  }}>
                  {dep}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </span>
              <input type="text" placeholder="Search groups..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#1E293B' }}
                onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#94A3B8' }}>
              <p className="text-lg font-medium">No groups found.</p>
              <p className="text-sm mt-1">Try a different department or search term.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(group => (
                <GroupCard key={group.id} group={group} onJoin={setSelectedGroup} />
              ))}
            </div>
          )}

          {/* Propose a group CTA */}
          <div className="mt-16 rounded-2xl p-8 sm:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #0F2A4A, #1a3d68)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-4">
              Don't See Your Calling?
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
              Propose a New Group
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 28px' }}>
              Have a vision for a ministry that doesn't exist yet? Reach out to the PCM leadership — every great ministry starts with one faithful idea.
            </p>
            <a href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-full text-sm font-bold transition-all shadow-lg"
              style={{ background: '#2E6DE7', color: 'white' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
              onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}>
              Contact PCM Leadership
            </a>
          </div>
        </div>

        <Footer />
      </div>

      {selectedGroup && (
        <JoinModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
      )}
    </>
  );
}
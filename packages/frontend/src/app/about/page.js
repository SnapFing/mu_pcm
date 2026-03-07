'use client';

import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader, SectionLabel } from '@/app/ui/PageHeader';

const values = [
  { title: 'Faith First',    desc: 'Everything we do is rooted in Scripture and centred on Christ. Faith is not an add-on — it is the foundation.',          accent: 'blue'   },
  { title: 'Excellence',     desc: 'We pursue academic and personal excellence as an act of worship, knowing that God deserves our very best in all things.', accent: 'purple' },
  { title: 'Community',      desc: 'We are family. We walk alongside one another through the joys and challenges of university life.',                        accent: 'blue'   },
  { title: 'Service',        desc: 'Faith in action. We serve our campus and the surrounding Kabwe community with humility and love.',                        accent: 'purple' },
];

const ministries = [
  { name: 'Personal Ministries',  desc: 'Evangelism, Bible studies, and outreach to non-believers on campus.'          },
  { name: 'Prayer Band',          desc: '24-hour prayer chain and weekly corporate prayer sessions for the community.'   },
  { name: 'Choir & Worship',      desc: 'Leading the congregation in Spirit-filled praise and original worship music.'   },
  { name: 'Social Welfare',       desc: 'Community service initiatives and support for students in need.'                },
  { name: 'Media & Publications', desc: 'Sermons, videos, journals, and digital ministry resources for the campus.'     },
  { name: 'Youth & AY',           desc: 'Adventist Youth programs, Pathfinders, and leadership development activities.'  },
];

export default function AboutPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/about" />

        <PageHeader
          eyebrow="Who We Are"
          title="About MU SDA PCM"
          subtitle="Mulungushi University Public Campus Ministries — a community dedicated to supporting students in their spiritual journey while pursuing academic excellence."
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 space-y-20">

          {/* Mission + Vision */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 flex flex-col gap-4" style={{ background: '#2E6DE7' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)' }} className="uppercase">Our Mission</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 700, color: 'white', lineHeight: 1.6 }}>
                To nurture a vibrant community of Seventh-day Adventist students who follow Jesus, embrace His mission, and change the world.
              </p>
            </div>
            <div className="rounded-2xl p-8 flex flex-col gap-4" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase">Our Vision</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 700, color: '#0F2A4A', lineHeight: 1.6 }}>
                A Mulungushi University campus where every student encounters the love of God and discovers their purpose in His kingdom.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section>
            <SectionLabel eyebrow="What We Believe" title="Our Core Values" color="blue" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map(v => {
                const isBlue = v.accent === 'blue';
                return (
                  <div key={v.title} className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,109,231,0.11)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: isBlue ? 'rgba(46,109,231,0.1)' : 'rgba(124,58,237,0.1)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: isBlue ? '#2E6DE7' : '#7C3AED' }} />
                    </div>
                    <h3 className="font-bold" style={{ color: '#0F2A4A', fontSize: 15 }}>{v.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ministries */}
          <section>
            <SectionLabel eyebrow="How We Serve" title="Our Ministries" color="purple" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ministries.map((m, i) => (
                <div key={m.name} className="flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
                  <div className="w-2 h-2 rounded-full shrink-0 mt-2"
                    style={{ background: i % 2 === 0 ? '#2E6DE7' : '#7C3AED' }} />
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: '#0F2A4A' }}>{m.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Join CTA */}
          <section className="rounded-2xl p-10 sm:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #0F2A4A, #1a3d68)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-5">Be Part of Something Greater</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
              Join MU SDA PCM
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 440, margin: '0 auto 28px' }}>
              Whether you're a long-time Adventist or just curious, you are welcome here. Come as you are.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/contact"
                className="px-8 py-3 rounded-full text-sm font-bold shadow-lg transition-all"
                style={{ background: '#2E6DE7', color: 'white' }}>
                Get In Touch
              </a>
              <a href="/events"
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                See Upcoming Events
              </a>
            </div>
          </section>

        </div>

        <Footer />
      </div>
    </>
  );
}
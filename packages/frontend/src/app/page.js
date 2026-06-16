import Link from 'next/link';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import Button from '@/app/ui/Button';
import { PinIcon, BookIcon, UsersIcon, MediaIcon } from '@/app/ui/Icon';

export default function LandingPage() {
  return (
    <>
      {/* ── Fonts (same import block as all other pages) ───────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
        *, body { font-family: 'Noto Sans', sans-serif; }
      `}</style>

      <Navbar activePath="" />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <img
          src="/img0.jpg"
          alt="MU Campus Worship"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(15,42,74,0.5) 0%, rgba(15,42,74,0.8) 70%, rgba(15,42,74,0.95) 100%)',
          }}
        />
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 700,
            }}
            className="uppercase mb-6"
          >
            Mulungushi University Seventh‑day Adventist
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: 'white',
              marginBottom: '1.5rem',
            }}
          >
            Public Campus Ministries
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(255,255,255,0.65)',
              maxWidth: 600,
              margin: '0 auto 2.5rem',
              lineHeight: 1.8,
            }}
          >
            A community of faith, purpose, and excellence — right here on campus.
            Experience worship, prayer, service, and fellowship that prepares you for
            now and eternity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/dashboard" variant="primary" size="lg">Continue as Guest</Button>
            <Button href="/groups" variant="ghost" size="lg" className="border-white/30">Join a Group</Button>
          </div>
          <p style={{ marginTop: '2rem', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            Already a member?{' '}
            <Link href="/login" style={{ color: '#2E6DE7', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* ── Who We Are ──────────────────────────────────────────────────── */}
      <section className="py-20 px-5 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#2E6DE7',
              }}
              className="uppercase mb-3"
            >
              Our Identity
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 700,
                color: '#0F2A4A',
                lineHeight: 1.2,
                marginBottom: '1.5rem',
              }}
            >
              Who We Are
            </h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.9 }}>
              We are a movement of students called by God to live out the gospel on
              campus. As part of the worldwide Seventh‑day Adventist Church, we exist
              to make disciples of Jesus Christ, nurture spiritual growth, and create a
              family where everyone belongs. Our community is built on the Bible,
              sustained by prayer, and driven by love for God and each other.
            </p>
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: 350, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}
          >
            <img
              src="/img0.jpg"
              alt="MU PCM Worship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── What We Believe ─────────────────────────────────────────────── */}
      <section style={{ background: '#F5F7FF' }} className="py-20 px-5">
        <div className="max-w-7xl mx-auto text-center">
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: '#7C3AED',
            }}
            className="uppercase mb-3"
          >
            Our Faith
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: '#0F2A4A',
              marginBottom: '3rem',
            }}
          >
            What We Believe
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              {
                title: 'The Bible',
                text: 'We believe the Bible is God’s inspired Word, the foundation of our faith and practice. It reveals His character, His plan for humanity, and His unending love.',
              },
              {
                title: 'Salvation in Jesus',
                text: 'Jesus Christ is our Saviour and Lord. Through His life, death, and resurrection, we receive forgiveness, freedom, and the promise of eternal life.',
              },
              {
                title: 'The Blessed Hope',
                text: 'Jesus is coming again to restore all things. We live with joy and purpose, sharing this hope with everyone we meet.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-6 bg-white"
                style={{
                  border: '1px solid #E2E8F7',
                  boxShadow: '0 1px 4px rgba(46,109,231,0.06)',
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F2A4A', marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Do ──────────────────────────────────────────────────── */}
      <section className="py-20 px-5 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: '#059669',
            }}
            className="uppercase mb-3"
          >
            Our Mission
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: '#0F2A4A',
            }}
          >
            What We Do
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
              {
                icon: <PinIcon className="w-7 h-7" size={28} />,
              title: 'Prayer & Worship',
              desc: 'Weekly vespers, Sabbath services, and prayer chains that lift our campus to heaven.',
              href: '/prayer',
            },
            {
                icon: <BookIcon className="w-7 h-7" size={28} />,
              title: 'Bible Study',
              desc: 'Small groups, personal devotionals, and journal resources to deepen your walk with God.',
              href: '/journals',
            },
            {
                icon: <UsersIcon className="w-7 h-7" size={28} />,
              title: 'Community Service',
              desc: 'Health expos, outreach programs, and support for vulnerable students and local communities.',
              href: '/groups',
            },
            {
                icon: <MediaIcon className="w-7 h-7" size={28} />,
              title: 'Music & Arts',
              desc: 'Choir, praise teams, and creative ministries that use your talents to glorify God.',
              href: '/media',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl p-6 text-center bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              style={{
                border: '1px solid #E2E8F7',
                boxShadow: '0 1px 4px rgba(46,109,231,0.06)',
              }}
            >
              <div style={{ color: '#2E6DE7', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Call to Action ──────────────────────────────────────────────── */}
      <section
        style={{ background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}
        className="py-20 px-5 text-center"
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: 'white',
            marginBottom: '1.5rem',
          }}
        >
          Ready to Be Part of Something Greater?
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 500,
            margin: '0 auto 2.5rem',
            lineHeight: 1.8,
          }}
        >
          Whether you want to join officially or just explore, there’s a place for you in our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/dashboard" variant="secondary" size="lg">Enter as Guest</Button>
          <Button href="/contact" variant="ghost" size="lg" className="border-white/35">Get in Touch</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
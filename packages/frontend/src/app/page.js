import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans', sans-serif", background: '#FFFFFF', color: '#1E293B' }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <img
          src="/img0.jpg"
          alt="MU Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,42,74,0.5) 0%, rgba(15,42,74,0.8) 70%, rgba(15,42,74,0.95) 100%)' }} />
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
          <p style={{ fontSize: 12, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }} className="uppercase mb-6">
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
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.65)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            A community of faith, purpose, and excellence — right here on campus.
            Experience worship, prayer, service, and fellowship that prepares you for
            now and eternity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-transform hover:scale-105"
              style={{ background: '#2E6DE7', color: 'white' }}
            >
              Join the Community
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
            >
              Continue as Guest
            </Link>
          </div>
          <p style={{ marginTop: '2rem', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            Already a member? <Link href="/login" style={{ color: '#2E6DE7', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </section>

      {/* ── Who We Are ──────────────────────────────────────────────────── */}
      <section className="py-20 px-5 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7' }} className="uppercase mb-3">
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
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.9 }}>
              We are a movement of students called by God to live out the gospel on campus.
              As part of the worldwide Seventh‑day Adventist Church, we exist to make
              disciples of Jesus Christ, nurture spiritual growth, and create a family
              where everyone belongs. Our community is built on the Bible, sustained by
              prayer, and driven by love for God and each other.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ height: 350, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}>
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
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-3">
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
                style={{ border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F2A4A', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Do ──────────────────────────────────────────────────── */}
      <section className="py-20 px-5 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#059669' }} className="uppercase mb-3">
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
            { icon: '🙏', title: 'Prayer & Worship', desc: 'Weekly vespers, Sabbath services, and prayer chains that lift our campus to heaven.' },
            { icon: '📖', title: 'Bible Study', desc: 'Small groups, personal devotionals, and journal resources to deepen your walk with God.' },
            { icon: '🤝', title: 'Community Service', desc: 'Health expos, outreach programs, and support for vulnerable students and local communities.' },
            { icon: '🎵', title: 'Music & Arts', desc: 'Choir, praise teams, and creative ministries that use your talents to glorify God.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 text-center bg-white"
              style={{ border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call to Action ──────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }} className="py-20 px-5 text-center">
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
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          Whether you want to join officially or just explore, there’s a place for you in our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-transform hover:scale-105"
            style={{ background: 'white', color: '#2E6DE7' }}
          >
            Sign Up Free
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)', color: 'white' }}
          >
            Browse as Guest
          </Link>
        </div>
      </section>

      {/* ── Footer (simple) ─────────────────────────────────────────────── */}
      <footer className="py-10 text-center" style={{ background: '#0F2A4A' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          © 2026 MU SDA PCM · Mulungushi University, Kabwe, Zambia
        </p>
      </footer>
    </div>
  );
}
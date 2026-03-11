'use client';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { useAbout } from '@/app/context/DataContext';

export default function AboutPage() {
  const { about } = useAbout();

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap'); *, body { font-family: 'Noto Sans', sans-serif; }`}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/about" />

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0F2A4A 0%, #2E6DE7 100%)', padding: 'clamp(4rem,10vw,7rem) 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>ABOUT US</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: 'white', marginBottom: 20, lineHeight: 1.2 }}>
            MU SDA PCM
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Mulungushi University Seventh-day Adventist Public Campus Ministries
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-16">

          {/* Mission */}
          {about.mission && (
            <section className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7', marginBottom: 10 }}>OUR MISSION</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 16, lineHeight: 1.3 }}>
                  Why We Exist
                </h2>
                <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.85 }}>{about.mission}</p>
              </div>
              <div className="rounded-2xl p-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(46,109,231,0.06), rgba(124,58,237,0.06))', border: '1px solid #E2E8F7', minHeight: 180 }}>
                <span style={{ fontSize: 64 }}>✝️</span>
              </div>
            </section>
          )}

          {/* Vision */}
          {about.vision && (
            <section style={{ background: '#F5F7FF', borderRadius: 20, padding: 'clamp(1.5rem,4vw,3rem)', border: '1px solid #E2E8F7' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED', marginBottom: 10 }}>OUR VISION</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 16 }}>Where We Are Going</h2>
              <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.85, maxWidth: 680 }}>{about.vision}</p>
            </section>
          )}

          {/* History */}
          {about.history && (
            <section>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7', marginBottom: 10 }}>OUR STORY</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 16 }}>History</h2>
              <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{about.history}</p>
            </section>
          )}

          {/* Contact info */}
          {(about.address || about.email || about.phone) && (
            <section>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7', marginBottom: 10 }}>FIND US</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 20 }}>Contact Information</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {about.address && (
                  <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #E2E8F7' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 8 }}>ADDRESS</p>
                    <p style={{ fontSize: 14, color: '#0F2A4A', lineHeight: 1.6 }}>{about.address}</p>
                  </div>
                )}
                {about.email && (
                  <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #E2E8F7' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 8 }}>EMAIL</p>
                    <a href={`mailto:${about.email}`} style={{ fontSize: 14, color: '#2E6DE7', textDecoration: 'none' }}>{about.email}</a>
                  </div>
                )}
                {about.phone && (
                  <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #E2E8F7' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 8 }}>PHONE</p>
                    <a href={`tel:${about.phone}`} style={{ fontSize: 14, color: '#2E6DE7', textDecoration: 'none' }}>{about.phone}</a>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Social */}
          {(about.facebook || about.instagram) && (
            <section className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)', color: 'white' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>FOLLOW US</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 700, marginBottom: 20 }}>Stay Connected</h3>
              <div className="flex gap-4 justify-center flex-wrap">
                {about.facebook && <a href={about.facebook} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>Facebook</a>}
                {about.instagram && <a href={about.instagram} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>Instagram</a>}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!about.mission && !about.vision && !about.history && (
            <div className="text-center py-20">
              <p style={{ color: '#94A3B8', fontSize: 15 }}>About page content hasn't been set yet. Visit the Admin → About Editor to add content.</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

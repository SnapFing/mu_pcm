'use client';
// contact/page.js + contact/_components/ContactForm.js (combined for simplicity)

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';

function ContactForm() {
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]    = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl p-10 text-center flex flex-col items-center gap-4"
        style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(46,109,231,0.12)' }}>
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2E6DE7" strokeWidth={2} strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 className="font-bold text-lg" style={{ color: '#0F2A4A' }}>Message Sent!</h3>
        <p style={{ fontSize: 14, color: '#64748B' }}>We'll get back to you within 24 hours.</p>
        <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',subject:'',message:'' }); }}
          className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ background: '#2E6DE7', color: 'white' }}>
          Send Another Message
        </button>
      </div>
    );
  }

  const inputStyle = { background: '#F5F7FF', border: '1px solid #E2E8F7', color: '#1E293B', width: '100%', borderRadius: 12, fontSize: 14, padding: '10px 16px', outline: 'none', transition: 'border-color 0.15s' };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.05em', display: 'block', marginBottom: 6 };

  return (
    <div className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 6px rgba(46,109,231,0.07)' }}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>Your Name <span style={{ color: '#EF4444' }}>*</span></label>
          <input type="text" placeholder="John Mwanza" value={form.name} onChange={e => set('name', e.target.value)}
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
            onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
        </div>
        <div>
          <label style={labelStyle}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
          <input type="email" placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)}
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
            onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Subject</label>
        <input type="text" placeholder="How can we help you?" value={form.subject} onChange={e => set('subject', e.target.value)}
          style={inputStyle}
          onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
          onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
      </div>
      <div>
        <label style={labelStyle}>Message <span style={{ color: '#EF4444' }}>*</span></label>
        <textarea rows={5} placeholder="Your message here..." value={form.message} onChange={e => set('message', e.target.value)}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.7, padding: '12px 16px' }}
          onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
          onBlur={e => e.currentTarget.style.borderColor = '#E2E8F7'} />
      </div>
      <button onClick={handleSubmit}
        disabled={loading || !form.name || !form.email || !form.message}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all"
        style={{ background: loading || !form.name || !form.email || !form.message ? '#CBD5E1' : '#2E6DE7', color: 'white', cursor: 'pointer' }}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  );
}

const contactDetails = [
  { Icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Visit Us', value: 'PCM Office, Student Center\nMultungushi University, Great North Road, Kabwe' },
  { Icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>, label: 'Call Us', value: '+260 123 456 789\nMon – Fri, 8:00 AM – 5:00 PM' },
  { Icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>, label: 'Email Us', value: 'info@mupcm.org\nWe reply within 24 hours' },
];

export default function ContactPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
      * { font-family: 'Noto Sans', sans-serif; }`}</style>

      <div style={{ minHeight: '100vh', background: 'white', color: '#1E293B' }}>
        <Navbar activePath="/contact" />
        <PageHeader eyebrow="MU SDA PCM" title="Contact Us" subtitle="We'd love to hear from you — reach out for any questions, prayer requests, or partnership inquiries." />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Form */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7' }} className="uppercase mb-2">Get In Touch</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 24 }}>
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-6">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">Find Us</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#0F2A4A', marginBottom: 8 }}>
                Our Office
              </h2>
              {contactDetails.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl p-5"
                  style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(46,109,231,0.1)', color: '#2E6DE7' }}>
                    <Icon />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: '#0F2A4A' }}>{label}</p>
                    {value.split('\n').map((line, i) => (
                      <p key={i} style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ height: 200, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Map embed goes here</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
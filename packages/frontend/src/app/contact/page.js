'use client';

import { useState } from 'react';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import { PageHeader } from '@/app/ui/PageHeader';
import { useContacts } from '@/app/context/DataContext';

const Ico = ({ children, c = 'w-5 h-5' }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const MailIcon   = ({ c }) => <Ico c={c}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></Ico>;
const PhoneIcon  = ({ c }) => <Ico c={c}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.21 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.31 7.78a16 16 0 006.13 6.13l1.14-1.14a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></Ico>;
const MapPinIcon = ({ c }) => <Ico c={c}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></Ico>;
const CheckIcon  = ({ c }) => <Ico c={c}><path d="M20 6L9 17l-5-5"/></Ico>;

const C = { primary: '#2E6DE7', navy: '#0F2A4A', border: '#E2E8F7', white: '#F5F7FF' };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 14, border: `1px solid ${C.border}`, background: C.white, color: C.navy, outline: 'none', fontFamily: "'Noto Sans', sans-serif", transition: 'border-color 0.15s' };

function InfoCard({ icon, label, value, href }) {
  const inner = (
    <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(46,109,231,0.08)', color: C.primary }}>{icon}</div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 3 }}>{label.toUpperCase()}</p>
        <p style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function ContactForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const valid = form.name && form.email && form.message;

  const handleSend = () => {
    if (!valid) return;
    setLoading(true);
    setTimeout(() => { onSubmit(form); setLoading(false); setSubmitted(true); }, 600);
  };

  if (submitted) return (
    <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(46,109,231,0.1)', color: C.primary }}><CheckIcon c="w-8 h-8" /></div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Message Sent!</h3>
      <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, maxWidth: 340, margin: '0 auto 28px' }}>Thanks for reaching out, <strong>{form.name}</strong>. We'll get back to you soon.</p>
      <button onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }}
        className="px-8 py-2.5 rounded-full text-sm font-bold" style={{ background: C.primary, color: 'white' }}>Send Another</button>
    </div>
  );

  return (
    <div className="rounded-2xl p-8" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Send Us a Message</h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28 }}>We'd love to hear from you.</p>
      <div className="flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ label: 'Full Name', key: 'name', placeholder: 'Your full name', type: 'text' }, { label: 'Email Address', key: 'email', placeholder: 'your@email.com', type: 'email' }].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: C.navy, marginBottom: 7 }}>{label.toUpperCase()}</label>
              <input type={type} value={form[key]} onChange={f(key)} placeholder={placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: C.navy, marginBottom: 7 }}>SUBJECT</label>
          <input type="text" value={form.subject} onChange={f('subject')} placeholder="What is this about?" style={inputStyle}
            onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: C.navy, marginBottom: 7 }}>MESSAGE</label>
          <textarea value={form.message} onChange={f('message')} rows={5} placeholder="Write your message here…"
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
        <button onClick={handleSend} disabled={loading || !valid}
          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          style={{ background: !valid ? '#CBD5E1' : C.primary, color: 'white', cursor: !valid ? 'not-allowed' : 'pointer' }}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</> : 'Send Message'}
        </button>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { add } = useContacts();
  const handleSubmit = (formData) => {
    add({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, date: new Date().toISOString().split('T')[0], status: 'Unread' });
  };
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap'); *, body { font-family: 'Noto Sans', sans-serif; }`}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/contact" />
        <PageHeader eyebrow="Get in Touch" title="Contact Us" subtitle="Questions, ideas, or just want to connect? We're here and happy to hear from you." />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: C.primary }} className="uppercase mb-3">Find Us</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 700, color: C.navy, marginBottom: 8 }}>We'd Love to Hear From You</h2>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.75 }}>Reach out via the form, or find us at the PCM Office on campus. We respond within 24 hours.</p>
              </div>
              <InfoCard icon={<MapPinIcon c="w-5 h-5" />} label="Address" value="PCM Office, Student Centre, Mulungushi University, Kabwe" />
              <InfoCard icon={<MailIcon   c="w-5 h-5" />} label="Email"   value="info@mupcm.org" href="mailto:info@mupcm.org" />
              <InfoCard icon={<PhoneIcon  c="w-5 h-5" />} label="Phone"   value="+260 123 456 789" href="tel:+260123456789" />
              <div className="rounded-2xl p-5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 14 }}>FOLLOW US</p>
                <div className="flex gap-3">
                  {[{ label: 'Facebook', href: 'https://facebook.com', color: '#1877F2' }, { label: 'Instagram', href: 'https://instagram.com', color: '#E4405F' }, { label: 'WhatsApp', href: 'https://wa.me/260123456789', color: '#25D366' }].map(({ label, href, color }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-xl text-xs font-bold text-center"
                      style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}>{label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3"><ContactForm onSubmit={handleSubmit} /></div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

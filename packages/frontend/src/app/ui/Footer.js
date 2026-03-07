/**
 * ui/Footer.js
 * Import in every page: import Footer from '@/app/ui/Footer'
 */

const footerLinks = [
  { label: 'Upcoming Events', href: '/events'           },
  { label: 'Sermons & Media', href: '/media'            },
  { label: 'Journals',        href: '/journals'         },
  { label: 'Time Management', href: '/time-management'  },
  { label: 'Heroes',          href: '/heroes'           },
  { label: 'Contact Us',      href: '/contact'          },
];

const socialLinks = [
  { label: 'Facebook',  href: 'https://facebook.com',       Icon: FbIcon  },
  { label: 'Instagram', href: 'https://instagram.com',      Icon: IgIcon  },
  { label: 'YouTube',   href: 'https://youtube.com',        Icon: YtIcon  },
  { label: 'WhatsApp',  href: 'https://wa.me/260123456789', Icon: WaIcon  },
];

function FbIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}
function IgIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function YtIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  );
}
function WaIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.112 1.527 5.836L.057 23.214a.5.5 0 00.611.65l5.579-1.463A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.046-1.393l-.361-.216-3.747.983.998-3.648-.236-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <path d="M22 6l-10 7L2 6"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#0F2A4A', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow"
                style={{ background: '#2E6DE7' }}>
                <span style={{ color: 'white', fontSize: 9, fontWeight: 900, lineHeight: 1.2, textAlign: 'center', userSelect: 'none' }}>
                  MU<br/>PCM
                </span>
              </div>
              <div>
                <p className="font-extrabold text-base leading-tight">MU SDA PCM</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Mulungushi University</p>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8 }}>
              Dedicated to supporting students in their spiritual journey while pursuing academic excellence.
            </p>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2E6DE7'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-5">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {footerLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                    <ChevronRight /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-5">
              Contact
            </p>
            <ul className="flex flex-col gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <li className="flex items-start gap-2.5">
                <span style={{ color: '#2E6DE7', marginTop: 2 }}><PinIcon /></span>
                <span className="leading-relaxed">PCM Office, Student Center<br />Great North Road, Kabwe, Zambia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span style={{ color: '#2E6DE7' }}><PhoneIcon /></span>
                <a href="tel:+260123456789"
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  +260 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span style={{ color: '#2E6DE7' }}><MailIcon /></span>
                <a href="mailto:info@mupcm.org"
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  info@mupcm.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span style={{ color: '#2E6DE7' }}><ClockIcon /></span>
                <span>Mon – Fri, 8:00 AM – 5:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(46,109,231,0.9)' }} className="uppercase mb-5">
              Stay Updated
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 20 }}>
              Get devotionals, event reminders, and ministry updates straight to your inbox.
            </p>
            <div className="flex flex-col gap-2.5">
              <input type="email" placeholder="Your email address"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                onFocus={e => e.currentTarget.style.borderColor = '#2E6DE7'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
              <button className="w-full py-3 rounded-xl text-sm font-bold shadow transition-all"
                style={{ background: '#2E6DE7', color: 'white' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
                onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          <p>© 2025 Mulungushi University SDA PCM. All rights reserved.</p>
          <p>Built with faith &amp; purpose · Kabwe, Zambia</p>
        </div>
      </div>
    </footer>
  );
}
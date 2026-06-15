/**
 * ui/Footer.js
 * Import in every page: import Footer from '@/app/ui/Footer'
 */

const footerLinks = [
  { label: 'Upcoming Events', href: '/events'           },
  { label: 'Sermons & Media', href: '/media'            },
  { label: 'Journals',        href: '/journals'         },
  { label: 'Resources',       href: '/resources'        },
  { label: 'Heroes',          href: '/heroes'           },
  { label: 'Contact Us',      href: '/contact'          },
];

import { FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon, PinIcon, PhoneIcon, MailIcon, ClockIcon, ChevronRight } from '@/app/ui/Icon';

const socialLinks = [
  { label: 'Facebook',  href: 'https://facebook.com',       Icon: FacebookIcon  },
  { label: 'Instagram', href: 'https://instagram.com',      Icon: InstagramIcon },
  { label: 'YouTube',   href: 'https://youtube.com/@mulungushisdapcmpublicity?si=RsiOtIMrXWs2XwfB',        Icon: YouTubeIcon  },
  { label: 'WhatsApp',  href: 'https://wa.me/260762062641', Icon: WhatsAppIcon  },
];

// Social icons use the shared stroke-based Icon components

// Footer uses shared Icon components (PinIcon, PhoneIcon, MailIcon, ClockIcon, ChevronRight)

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
                <span className="leading-relaxed">Mulungushi University<br />Great North Road, Kabwe, Zambia</span>
              </li>
              
              <li className="flex items-center gap-2.5">
                <span style={{ color: '#2E6DE7' }}><PhoneIcon /></span>
                <a href="tel:+260123456789"
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  +260 762 062 641
                </a>
              </li>
              
              <li className="flex items-center gap-2.5">
                <span style={{ color: '#2E6DE7' }}><MailIcon /></span>
                <a href="mailto:mulungushisdapcmpublicity@gmail.com"
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  mulungushisdapcmpublicity@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <span style={{ color: '#2E6DE7' }}><ClockIcon /></span>
                <span>Sun – Fri, 8:00 AM – 5:00 PM</span>
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
          <p>© 2026 Mulungushi University SDA PCM. All rights reserved.</p>
          <p>Built with faith &amp; purpose · Kabwe, Zambia</p>
          <p>Contact the Developer - SnapFing</p>
        </div>
      </div>
    </footer>
  );
}

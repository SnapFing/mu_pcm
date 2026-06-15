'use client';

/**
 * ui/Navbar.js
 * - Transparent overlay on dashboard hero, solid navy on scroll
 * - Mobile drawer: slides in from RIGHT, half-screen width
 */

import { useState, useEffect } from 'react';
import Button from '@/app/ui/Button';
import { MenuIcon } from '@/app/ui/Icon';
import { XIcon } from '@/app/ui/Icon';

const navLinks = [
  { label: 'Home',      href: '/dashboard' },
  { label: 'About Us',  href: '/about'     },
  { label: 'Events',    href: '/events'    },
  { label: 'Prayer',    href: '/prayer'    },
  { label: 'Media',     href: '/media'     },
  { label: 'Journals',  href: '/journals'  },
  { label: 'Heroes',    href: '/heroes'    },
  { label: 'Groups',    href: '/groups'    },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact',   href: '/contact'   },
];

const MenuIcon  = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
);
const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

export default function Navbar({ activePath = '' }) {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboard = activePath === '/dashboard';

  useEffect(() => {
    if (!isDashboard) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDashboard]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isSolid = !isDashboard || scrolled || open;

  return (
    <>
      <style>{`
        .nav-link:hover { color: white !important; background: rgba(46,109,231,0.18) !important; }
        .drawer-link:hover { background: rgba(255,255,255,0.07) !important; color: white !important; }
        .join-btn:hover { background: #1d5cd4 !important; }
        .ham-btn:hover  { background: rgba(255,255,255,0.18) !important; }
      `}</style>

      {/* ── Fixed Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{
          background:  isSolid ? 'rgba(15,42,74,1)' : 'rgba(15,42,74,0)',
          boxShadow:   isSolid ? '0 2px 24px rgba(0,0,0,0.22)' : 'none',
          transition:  'background 0.35s ease, box-shadow 0.35s ease',
        }}>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-3 shrink-0">
            <img src="/mu pcm.png" alt="MU SDA PCM"
              style={{ height: 38, width: 'auto', objectFit: 'contain' }}
              onError={e => e.currentTarget.style.display = 'none'} />
            <div className="hidden sm:block leading-tight">
              <p className="font-extrabold text-sm text-white tracking-wide">MU SDA PCM</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em' }} className="uppercase">
                Mulungushi University
              </p>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
            {navLinks.map(({ label, href }) => {
              const isActive = activePath === href;
              return (
                <a key={href} href={href}
                  className="nav-link px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all relative"
                          style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.72)', background: isActive ? 'rgba(46,109,231,0.28)' : 'transparent' }}
                          aria-current={isActive ? 'page' : undefined}>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: '#2E6DE7' }} />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <Button href="/about" variant="primary" size="md" className="hidden sm:inline-flex">Join Us</Button>
            <button onClick={() => setOpen(!open)}
              className="ham-btn lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all text-white"
              style={{
                background:     open ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                border:         '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)',
              }}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for non-hero pages */}
      {!isDashboard && <div style={{ height: 64 }} />}

      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background:  'rgba(5,15,30,0.55)',
          backdropFilter: 'blur(3px)',
          opacity:     open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition:  'opacity 0.3s ease',
        }}
      />

      {/* ── Right-side Drawer (half screen) ───────────────────────────── */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 lg:hidden flex flex-col"
        style={{
          width:      'min(52vw, 320px)',   /* half-ish screen, max 320px */
          background: 'rgba(10,26,46,0.97)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow:  '-8px 0 40px rgba(0,0,0,0.4)',
          transform:  open ? 'translateX(0)' : 'translateX(105%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', height: 64 }}>
          <div className="flex items-center gap-2.5">
            <img src="/mu pcm.png" alt="PCM"
              style={{ height: 28, width: 'auto' }}
              onError={e => e.currentTarget.style.display = 'none'} />
            <span className="font-bold text-white text-sm">Menu</span>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5" role="navigation" aria-label="Mobile navigation">
          {navLinks.map(({ label, href }) => {
            const isActive = activePath === href;
            return (
              <a key={href} href={href} onClick={() => setOpen(false)}
                className="drawer-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  color:      isActive ? 'white' : 'rgba(255,255,255,0.65)',
                  background: isActive ? 'rgba(46,109,231,0.25)' : 'transparent',
                  borderLeft: isActive ? '2px solid #2E6DE7' : '2px solid transparent',
                }}>
                {label}
              </a>
            );
          })}
        </nav>

        {/* Drawer footer — Join Us CTA */}
        <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button href="/about" variant="primary" size="md" className="w-full text-center" onClick={() => setOpen(false)}>Join Us</Button>
        </div>
      </div>
    </>
  );
}
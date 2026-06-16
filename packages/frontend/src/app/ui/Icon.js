"use client";

export function Svg({ children, size = 16, className = '', title, ...props }) {
  return (
    <svg
      className={`ui-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'img'}
      aria-label={title || undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export const FacebookIcon = (props) => (
  <Svg {...props}>
    <path d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3" />
  </Svg>
);

export const InstagramIcon = (props) => (
  <Svg {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3" />
    <path d="M17.5 6.5v.01" stroke="currentColor" strokeWidth={2} />
  </Svg>
);

export const YouTubeIcon = (props) => (
  <Svg {...props}>
    <path d="M22 7.5a2.5 2.5 0 00-1.75-1.75C18.88 5 12 5 12 5s-6.88 0-8.25.75A2.5 2.5 0 002 7.5 29 29 0 002 12a29 29 0 00.75 4.5A2.5 2.5 0 004.5 18.25C6.12 19 12 19 12 19s6.88 0 8.25-.75a2.5 2.5 0 001.75-1.75A29 29 0 0022 12a29 29 0 00-.75-4.5z" />
    <path d="M10 15l5-3-5-3v6z" fill="none" />
  </Svg>
);

export const WhatsAppIcon = (props) => (
  <Svg {...props}>
    <path d="M21 12.1c0 4.8-3.9 8.7-8.7 8.7-1.5 0-2.9-.4-4.1-1.1L3 21l1.2-5.4A8.6 8.6 0 013.3 12C3.3 6.8 7.8 2.3 13 2.3S22.7 6.8 22.7 12c0 .8-.1 1.6-.2 2.1z" />
    <path d="M16.2 13.8c-.3-.1-1.7-.8-1.9-.9-.2-.1-.4-.1-.6.1-.1.3-.6.9-.8 1.1-.2.2-.4.2-.7.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.6.1-.1.2-.3.3-.5.1-.2.1-.3.2-.5.1-.2 0-.4 0-.5-.1-.2-.6-1.9-.8-2.6-.2-.6-.4-.6-.6-.6-.2 0-.4 0-.7 0-.2 0-.5.1-.7.4-.2.3-.7 1.1-.7 2.7 0 1.6.9 3.2 1 3.4.1.2 1.8 2.7 4.4 3.8.6.3 1.1.5 1.5.6.6.2 1.1.2 1.6.1.5-.1 1.6-.5 1.8-.9.2-.4.2-.9.2-1 .1-.1 0-.2 0-.3z" />
  </Svg>
);

export default Svg;

export const PinIcon = (props) => (
  <Svg {...props}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const PhoneIcon = (props) => (
  <Svg {...props}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </Svg>
);

export const MailIcon = (props) => (
  <Svg {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </Svg>
);

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Svg>
);

export const ChevronRight = (props) => (
  <Svg {...props}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);

export const UsersIcon = (props) => (
  <Svg {...props}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
  </Svg>
);

export const CalendarIcon = (props) => (
  <Svg {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const XIcon = (props) => (
  <Svg {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </Svg>
);

export const MenuIcon = (props) => (
  <Svg {...props}>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </Svg>
);

export const ChevronLeft = (props) => (
  <Svg {...props}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);

export const DocumentIcon = (props) => (
  <Svg {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </Svg>
);

export const DownloadIcon = (props) => (
  <Svg {...props}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

export const PlayIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M10 8l6 4-6 4V8z" fill="none" />
  </Svg>
);

export const ExternalIcon = (props) => (
  <Svg {...props}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </Svg>
);

export const StarIcon = (props) => (
  <Svg {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

export const AlertIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

export const CrossIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3v18M4 9h16" />
  </Svg>
);

export const CreditIcon = (props) => (
  <Svg {...props}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <path d="M1 10h22" />
  </Svg>
);

export const BellIcon = (props) => (
  <Svg {...props}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </Svg>
);

export const BookIcon = (props) => (
  <Svg {...props}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </Svg>
);

export const MediaIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M10 8l6 4-6 4V8z" />
  </Svg>
);

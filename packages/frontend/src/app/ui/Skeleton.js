'use client';
/**
 * ui/Skeleton.js
 *
 * FIX: Added missing named exports that were imported in media/page.js and
 * caused build errors:
 *   - HeroCardSkeleton
 *   - RowSkeleton
 *   - TextSkeleton
 *   - AnnouncementSkeleton
 *
 * Existing exports (CardSkeleton, default Skeleton) are unchanged.
 */

export default function Skeleton({ width = '100%', height = 16, rounded = 6, className = '', style = {} }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'linear-gradient(90deg, #E2E8F7 25%, #F1F5F9 50%, #E2E8F7 75%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
    />
  );
}

/** Standard content card skeleton — image area + text lines */
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid #E2E8F7', background: 'white' }}>
      <Skeleton width="60%" height={20} rounded={8} className="mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${80 - i * 10}%`} height={12} rounded={4} className="mb-2" />
      ))}
    </div>
  );
}

/** Hero card skeleton — tall image area + name + role */
export function HeroCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F7', background: 'white' }}>
      <Skeleton width="100%" height={240} rounded={0} />
      <div className="p-5">
        <Skeleton width="55%" height={18} rounded={6} className="mb-2" />
        <Skeleton width="40%" height={12} rounded={4} className="mb-3" />
        <Skeleton width="90%" height={12} rounded={4} className="mb-1" />
        <Skeleton width="75%" height={12} rounded={4} />
      </div>
    </div>
  );
}

/** Table/list row skeleton */
export function RowSkeleton({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4" style={{ borderBottom: '1px solid #E2E8F7' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={`${100 / cols}%`} height={14} rounded={4} />
      ))}
    </div>
  );
}

/** Single text-line skeleton */
export function TextSkeleton({ width = '80%', height = 14 }) {
  return <Skeleton width={width} height={height} rounded={4} />;
}

/** Announcement card skeleton — badge + title + body + date */
export function AnnouncementSkeleton() {
  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid #E2E8F7', background: 'white', borderTop: '3px solid #E2E8F7' }}>
      <div className="flex items-center justify-between mb-3">
        <Skeleton width={80} height={20} rounded={9999} />
        <Skeleton width={60} height={12} rounded={4} />
      </div>
      <Skeleton width="70%" height={18} rounded={6} className="mb-2" />
      <Skeleton width="100%" height={12} rounded={4} className="mb-1" />
      <Skeleton width="85%"  height={12} rounded={4} className="mb-1" />
      <Skeleton width="60%"  height={12} rounded={4} />
    </div>
  );
}
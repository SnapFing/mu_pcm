'use client';

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

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="rounded-2xl p-5" style={{ border: '1px solid #E2E8F7', background: 'white' }}>
      <div style={{ marginBottom: 12 }}>
        <div className="animate-pulse" style={{ width: '60%', height: 20, borderRadius: 8, background: 'linear-gradient(90deg, #E2E8F7 25%, #F1F5F9 50%, #E2E8F7 75%)', backgroundSize: '200% 100%' }} />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse" style={{ width: `${80 - i * 10}%`, height: 12, borderRadius: 4, background: 'linear-gradient(90deg, #E2E8F7 25%, #F1F5F9 50%, #E2E8F7 75%)', backgroundSize: '200% 100%', marginBottom: 8 }} />
      ))}
    </div>
  );
}

'use client';

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
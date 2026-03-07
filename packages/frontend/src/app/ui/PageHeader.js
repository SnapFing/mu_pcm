/**
 * ui/PageHeader.js
 * Reusable hero-style page header for inner pages.
 *
 * Props:
 *   eyebrow  {string}  — small uppercase label above title
 *   title    {string}  — main heading (Playfair Display)
 *   subtitle {string}  — optional subtitle
 *   bg       {string}  — optional gradient override
 */
export function PageHeader({ eyebrow, title, subtitle, bg }) {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');`}</style>
      <section
        className="py-16 sm:py-20 text-center"
        style={{
          background: bg || 'linear-gradient(135deg, #0F2A4A 0%, #1a3d68 60%, #2E6DE7 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {eyebrow && (
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.55)' }}
              className="uppercase mb-4">
              {eyebrow}
            </p>
          )}
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          {/* Blue rule */}
          <div className="flex items-center justify-center gap-3 my-5">
            <div style={{ height: 1, width: 40, background: 'rgba(46,109,231,0.6)', borderRadius: 9999 }} />
            <div style={{ width: 5, height: 5, borderRadius: 9999, background: '#2E6DE7' }} />
            <div style={{ height: 1, width: 40, background: 'rgba(46,109,231,0.6)', borderRadius: 9999 }} />
          </div>
          {subtitle && (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
              {subtitle}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * ui/SectionLabel.js
 * Reusable eyebrow + heading pair used across all pages.
 *
 * Props:
 *   eyebrow  {string}        — small uppercase label
 *   title    {string}        — section heading
 *   color    {'blue'|'purple'} — eyebrow accent colour (default: blue)
 *   center   {boolean}       — centre-align (default: false)
 */
export function SectionLabel({ eyebrow, title, color = 'blue', center = false }) {
  const eyebrowColor = color === 'purple' ? '#7C3AED' : '#2E6DE7';
  return (
    <div style={{ textAlign: center ? 'center' : 'left' }} className="mb-10">
      {eyebrow && (
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: eyebrowColor, marginBottom: 8 }}
          className="uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
          fontWeight: 700,
          color: '#0F2A4A',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
    </div>
  );
}
/**
 * heroes/_components/HeroCard.js
 */

export default function HeroCard({ hero }) {
  const { name, role, summary, image, badge } = hero;
  const isBlue = badge?.color === 'blue';

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>

      {/* Avatar */}
      <div className="relative" style={{ height: 200, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }}>
        {image
          ? <img src={image} alt={name} className="w-full h-full object-cover object-top" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                {name.charAt(0)}
              </div>
            </div>
          )
        }
        {/* Role badge */}
        <span className="absolute bottom-3 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          {role}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {badge && (
          <span className="self-start text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide"
            style={{
              background: isBlue ? 'rgba(46,109,231,0.1)' : 'rgba(124,58,237,0.1)',
              color: isBlue ? '#2E6DE7' : '#7C3AED',
              border: `1px solid ${isBlue ? 'rgba(46,109,231,0.25)' : 'rgba(124,58,237,0.25)'}`,
            }}>
            {badge.label}
          </span>
        )}
        <h3 className="font-bold" style={{ color: '#0F2A4A', fontSize: 16 }}>{name}</h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>{summary}</p>
        <button className="self-start text-sm font-semibold transition-colors"
          style={{ color: '#2E6DE7' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1d5cd4'}
          onMouseLeave={e => e.currentTarget.style.color = '#2E6DE7'}>
          Read Full Story →
        </button>
      </div>
    </div>
  );
}
'use client';
/**
 * resources/_components/ResourceCard.js
 *
 * FIX: This file was incorrectly named "PrayerForm.js" inside resources/_components/.
 * Renamed to ResourceCard.js — the correct component for this location.
 *
 * Note: resources/page.js defines its own inline ResourceCard, so this
 * component is available for any future refactor that imports from this path.
 */
import { DocumentIcon, DownloadIcon } from '@/app/ui/Icon';

const CAT_COLORS = {
  Planning:  { bg: 'rgba(46,109,231,0.08)',  text: '#2E6DE7'  },
  Study:     { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED'  },
  Spiritual: { bg: 'rgba(5,150,105,0.08)',  text: '#059669'  },
  Health:    { bg: 'rgba(239,68,68,0.08)',  text: '#EF4444'  },
  General:   { bg: 'rgba(15,42,74,0.08)',   text: '#0F2A4A'  },
};

export default function ResourceCard({ resource, idx = 0 }) {
  const { title, description, category, fileType, fileUrl } = resource;
  const accent    = idx % 2 === 0 ? '#2E6DE7' : '#7C3AED';
  const catColors = CAT_COLORS[category] || CAT_COLORS.General;
  const fileColor = { PDF: '#EF4444', DOCX: '#2E6DE7', XLSX: '#059669', Link: '#7C3AED' }[fileType] || '#64748B';

  return (
    <div
      className="rounded-2xl p-6 flex gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background:  'white',
        border:      '1px solid #E2E8F7',
        boxShadow:   '0 1px 4px rgba(46,109,231,0.06)',
        borderLeft:  `3px solid ${accent}`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${fileColor}18`, color: fileColor }}>
        <DocumentIcon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: catColors.bg, color: catColors.text }}>
            {category}
          </span>
        </div>

        {description && (
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>{description}</p>
        )}

        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: accent }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            {fileType === 'Link' ? 'Open Link' : 'Download'}
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#94A3B8' }}>
            <DownloadIcon className="w-3.5 h-3.5" />
            No file yet
          </span>
        )}
      </div>
    </div>
  );
}
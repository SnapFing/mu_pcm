/**
 * journals/_components/JournalCard.js
 */

"use client";
import { DocumentIcon, DownloadIcon } from '@/app/ui/Icon';

const categoryColors = {
  Academic:             { bg: 'rgba(46,109,231,0.08)',  text: '#2E6DE7'  },
  'Spiritual Growth':   { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED'  },
  'Personal Development': { bg: 'rgba(15,42,74,0.07)', text: '#0F2A4A'  },
};

export function JournalCard({ journal }) {
  const { title, author, category, date, pdfUrl } = journal;
  const colors = categoryColors[category] || { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' };

  return (
    <div className="rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.05)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(46,109,231,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.05)'}>

      {/* PDF icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: colors.bg, color: colors.text }}>
        <DocumentIcon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 14 }}>{title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: colors.bg, color: colors.text }}>
            {category}
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{author} · {date}</p>
        <a href={pdfUrl || '#'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: '#2E6DE7' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1d5cd4'}
          onMouseLeave={e => e.currentTarget.style.color = '#2E6DE7'}>
          <DownloadIcon className="w-4 h-4" /> Download PDF
        </a>
      </div>
    </div>
  );
}
// packages/frontend/src/app/utils/exportMinutes.js
//
// Combines a meeting-minutes record (title, date, agenda, body) into a
// single downloadable document — plain text or PDF — for records that
// have no uploaded attachment file.
//
// Usage:
//   import { downloadMinutesText, downloadMinutesPDF } from '@/app/utils/exportMinutes';
//   downloadMinutesText(minutesRecord);
//   await downloadMinutesPDF(minutesRecord);

function safeFilename(title = 'meeting-minutes') {
  return title.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 80) || 'meeting-minutes';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function buildDocumentText({ title, meetingDate, agenda, body }) {
  const lines = [
    'MU SDA PCM — Meeting Minutes',
    '─'.repeat(40),
    '',
    `Title: ${title || 'Untitled Meeting'}`,
    `Date:  ${formatDate(meetingDate) || '—'}`,
    '',
  ];
  if (agenda?.trim()) lines.push('AGENDA', '-'.repeat(40), agenda.trim(), '');
  if (body?.trim())   lines.push('MINUTES', '-'.repeat(40), body.trim(), '');
  lines.push('', `Generated ${new Date().toLocaleString('en-GB')} · MU SDA PCM Admin Portal`);
  return lines.join('\n');
}

// ── Plain text (.txt) export ───────────────────────────────────────────
export function downloadMinutesText(minutes) {
  const text = buildDocumentText(minutes);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${safeFilename(minutes.title)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── PDF export — jsPDF is lazy-loaded so it's not in the main bundle ────
export async function downloadMinutesPDF(minutes) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const marginX    = 56;
  let y            = 76;
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth   = pageWidth - marginX * 2;
  const lineHeight = 16;

  function ensureSpace(extra = lineHeight) {
    if (y + extra > pageHeight - 56) {
      doc.addPage();
      y = 64;
    }
  }

  function writeHeading(text, size = 11) {
    ensureSpace(size + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.setTextColor('#0F2A4A');
    doc.text(text, marginX, y);
    y += size + 8;
  }

  function writeParagraph(text, size = 10.5) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor('#1E293B');
    const wrapped = doc.splitTextToSize(text, maxWidth);
    wrapped.forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, marginX, y);
      y += lineHeight;
    });
    y += 6;
  }

  // ── Letterhead band ──
  doc.setFillColor('#0F2A4A');
  doc.rect(0, 0, pageWidth, 48, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor('#FFFFFF');
  doc.text('MU SDA PCM — Meeting Minutes', marginX, 30);

  writeHeading(minutes.title || 'Untitled Meeting', 14);
  writeParagraph(`Date: ${formatDate(minutes.meetingDate) || '—'}`, 10);

  if (minutes.agenda?.trim()) {
    writeHeading('Agenda');
    writeParagraph(minutes.agenda.trim());
  }
  if (minutes.body?.trim()) {
    writeHeading('Minutes');
    writeParagraph(minutes.body.trim());
  }

  ensureSpace(20);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor('#94A3B8');
  doc.text(
    `Generated ${new Date().toLocaleString('en-GB')} · MU SDA PCM Admin Portal`,
    marginX,
    pageHeight - 36
  );

  doc.save(`${safeFilename(minutes.title)}.pdf`);
}
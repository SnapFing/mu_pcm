'use client';

/**
 * ui/FileUpload.js
 * Place at: packages/frontend/src/app/ui/FileUpload.js
 *
 * Reusable drag-and-drop upload component for MU SDA PCM.
 * Uses XHR (not fetch) for real upload progress indication.
 *
 * Props:
 *   token      {string}  — Firebase ID token (Authorization header)
 *   accept     {string}  — MIME types / extensions e.g. "image/*" or ".pdf,.docx"
 *   label      {string}  — Field label shown above the zone
 *   hint       {string}  — Small descriptive text below the zone
 *   onUpload   {fn}      — Called with { url } on success
 *   onError    {fn}      — Called with error message string (optional)
 *   currentUrl {string}  — Existing file URL — shows preview + remove button
 *   onRemove   {fn}      — Called when the user removes the current file
 *   disabled   {boolean}
 *
 * Usage — image:
 *   <FileUpload
 *     token={token}
 *     accept="image/*"
 *     label="Event Image"
 *     hint="JPEG, PNG or WebP · max 5 MB"
 *     currentUrl={form.image}
 *     onUpload={({ url }) => setForm(p => ({ ...p, image: url }))}
 *     onRemove={() => setForm(p => ({ ...p, image: '' }))}
 *   />
 *
 * Usage — document:
 *   <FileUpload
 *     token={token}
 *     accept=".pdf,.docx,.xlsx"
 *     label="Resource File"
 *     hint="PDF, Word or Excel · max 10 MB"
 *     currentUrl={form.fileUrl}
 *     onUpload={({ url }) => setForm(p => ({ ...p, fileUrl: url }))}
 *     onRemove={() => setForm(p => ({ ...p, fileUrl: '' }))}
 *   />
 */

import { useState, useRef, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Helpers ────────────────────────────────────────────────────────────────

function isImageUrl(url = '') {
  const u = url.toLowerCase().split('?')[0];
  return /\.(jpe?g|png|gif|webp|svg)$/.test(u) ||
    url.includes('/image/upload') ||
    url.includes('/image/');
}

function friendlySize(bytes) {
  if (bytes < 1024)           return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExt(name = '') {
  return name.split('.').pop().toLowerCase();
}

const EXT_COLORS = {
  pdf:  { bg: 'rgba(239,68,68,0.08)',   text: '#EF4444' },
  docx: { bg: 'rgba(46,109,231,0.08)',  text: '#2E6DE7' },
  doc:  { bg: 'rgba(46,109,231,0.08)',  text: '#2E6DE7' },
  xlsx: { bg: 'rgba(5,150,105,0.08)',   text: '#059669' },
  xls:  { bg: 'rgba(5,150,105,0.08)',   text: '#059669' },
  mp4:  { bg: 'rgba(124,58,237,0.08)',  text: '#7C3AED' },
  webm: { bg: 'rgba(124,58,237,0.08)',  text: '#7C3AED' },
};

function docColors(name = '') {
  return EXT_COLORS[fileExt(name)] || { bg: 'rgba(15,42,74,0.08)', text: '#0F2A4A' };
}

const DOC_ICON = {
  pdf:  'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 13h6 M9 17h6 M9 9h1',
  docx: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6',
  doc:  'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6',
  xlsx: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M8 13l8 8 M16 13l-8 8',
  xls:  'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M8 13l8 8 M16 13l-8 8',
  mp4:  'M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  webm: 'M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
};

function docIcon(name = '') {
  return DOC_ICON[fileExt(name)] || 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6';
}

// ── Micro SVG icon ─────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const I = {
  upload:  'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  check:   'M20 6L9 17l-5-5',
  x:       'M18 6L6 18 M6 6l12 12',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  refresh: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
};

// ── Circular progress ring ─────────────────────────────────────────────────
function ProgressRing({ pct = 0, size = 52, stroke = 3, color = '#2E6DE7' }) {
  const r      = (size - stroke * 2) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(46,109,231,0.12)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.15s ease' }} />
    </svg>
  );
}

// ── FileUpload ─────────────────────────────────────────────────────────────
export default function FileUpload({
  token,
  accept      = 'image/*',
  label,
  hint,
  onUpload,
  onError,
  currentUrl  = '',
  onRemove,
  disabled    = false,
}) {
  const [drag, setDrag]           = useState(false);
  const [state, setState]         = useState('idle');   // idle | uploading | done | error
  const [progress, setProgress]   = useState(0);
  const [fileName, setFileName]   = useState('');
  const [fileSize, setFileSize]   = useState(0);
  const [errMsg, setErrMsg]       = useState('');
  const inputRef                  = useRef(null);

  const imgPreview = isImageUrl(currentUrl);

  // ── XHR upload (real progress) ───────────────────────────────────────
  const handleFile = useCallback(async (file) => {
    if (!file || disabled) return;
    setFileName(file.name);
    setFileSize(file.size);
    setState('uploading');
    setProgress(0);
    setErrMsg('');

    try {
      const result = await new Promise((resolve, reject) => {
        const fd  = new FormData();
        fd.append('file', file, file.name);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/api/uploads`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) resolve(data);
            else reject(new Error(data?.error || `Upload failed (${xhr.status})`));
          } catch { reject(new Error('Unexpected server response')); }
        };
        xhr.onerror   = () => reject(new Error('Network error — check your connection'));
        xhr.ontimeout = () => reject(new Error('Upload timed out'));
        xhr.timeout   = 60_000;
        xhr.send(fd);
      });

      setProgress(100);
      setState('done');
      onUpload?.(result);
    } catch (err) {
      setState('error');
      setErrMsg(err.message || 'Upload failed');
      onError?.(err.message);
    }
  }, [token, disabled, onUpload, onError]);

  // ── Drag-and-drop ────────────────────────────────────────────────────
  const onDragOver  = (e) => { e.preventDefault(); if (!disabled) setDrag(true); };
  const onDragLeave = () => setDrag(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  };
  const onInputChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const retry      = () => { setState('idle'); setProgress(0); setErrMsg(''); };
  const openPicker = () => { if (!disabled) inputRef.current?.click(); };

  // ── Zone styles ──────────────────────────────────────────────────────
  const zoneBorder = drag
    ? '2px dashed #2E6DE7'
    : state === 'error' ? '2px dashed rgba(239,68,68,0.45)'
    : state === 'done'  ? '2px solid  rgba(5,150,105,0.4)'
    : '2px dashed #D1D9F0';

  const zoneBg = drag
    ? 'rgba(46,109,231,0.04)'
    : state === 'error' ? 'rgba(239,68,68,0.02)'
    : state === 'done'  ? 'rgba(5,150,105,0.02)'
    : '#FAFBFF';

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Noto Sans', sans-serif" }}>

      {/* Field label */}
      {label && (
        <label style={{
          display: 'block', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', color: '#0F2A4A',
          marginBottom: 8, textTransform: 'uppercase',
        }}>
          {label}
        </label>
      )}

      {/* Current file strip */}
      {currentUrl && state !== 'uploading' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'white', border: '1px solid #E2E8F7', marginBottom: 8,
        }}>
          {imgPreview ? (
            <img src={currentUrl} alt="current"
              style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: 6, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...docColors(currentUrl.split('/').pop()),
            }}>
              <Ico d={docIcon(currentUrl.split('/').pop())} size={20}
                color={docColors(currentUrl.split('/').pop()).text} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 12, fontWeight: 600, color: '#0F2A4A',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {currentUrl.split('/').pop().split('?')[0]}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Current file</p>
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            <a href={currentUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748B', cursor: 'pointer', textDecoration: 'none',
              }}
              title="Open file">
              <Ico d={I.eye} size={13} />
            </a>
            {onRemove && (
              <button type="button" onClick={onRemove}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  border: '1px solid rgba(239,68,68,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(239,68,68,0.05)', color: '#EF4444',
                  cursor: 'pointer',
                }}
                title="Remove file">
                <Ico d={I.x} size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef} type="file" accept={accept}
        onChange={onInputChange} style={{ display: 'none' }} disabled={disabled}
      />

      {/* ── Drop zone ─────────────────────────────────────────────────── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={state === 'uploading' ? undefined : openPicker}
        style={{
          border: zoneBorder, borderRadius: 12, background: zoneBg,
          padding: '24px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          cursor: state === 'uploading' || disabled ? 'default' : 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
          userSelect: 'none', position: 'relative', overflow: 'hidden',
        }}>

        {/* Idle */}
        {state === 'idle' && (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: drag ? 'rgba(46,109,231,0.12)' : 'rgba(46,109,231,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}>
              <Ico d={I.upload} size={22} color="#2E6DE7" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F2A4A', marginBottom: 3 }}>
                {drag ? 'Drop to upload' : 'Drag & drop or click to browse'}
              </p>
              {hint && <p style={{ fontSize: 11, color: '#94A3B8' }}>{hint}</p>}
            </div>
          </>
        )}

        {/* Uploading */}
        {state === 'uploading' && (
          <>
            {/* Bottom progress bar */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
              background: 'rgba(46,109,231,0.12)',
            }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg,#2E6DE7,#7C3AED)',
                borderRadius: 3, transition: 'width 0.15s ease',
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Circular ring */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProgressRing pct={progress} />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#2E6DE7',
                }}>
                  {progress}%
                </div>
              </div>

              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0F2A4A', marginBottom: 2 }}>
                  Uploading…
                </p>
                <p style={{
                  fontSize: 11, color: '#64748B', maxWidth: 180,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {fileName}
                </p>
                {fileSize > 0 && (
                  <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
                    {friendlySize(fileSize)}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Done */}
        {state === 'done' && (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(5,150,105,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ico d={I.check} size={22} color="#059669" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#059669', marginBottom: 3 }}>
                Uploaded successfully
              </p>
              <p style={{
                fontSize: 11, color: '#94A3B8', maxWidth: 240,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {fileName}
              </p>
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); retry(); }}
              style={{
                fontSize: 11, fontWeight: 600, color: '#64748B',
                background: 'white', border: '1px solid #E2E8F7',
                borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              <Ico d={I.refresh} size={11} /> Replace
            </button>
          </>
        )}

        {/* Error */}
        {state === 'error' && (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(239,68,68,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ico d={I.x} size={22} color="#EF4444" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', marginBottom: 3 }}>
                Upload failed
              </p>
              <p style={{ fontSize: 11, color: '#64748B', maxWidth: 260 }}>{errMsg}</p>
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); retry(); }}
              style={{
                fontSize: 11, fontWeight: 600, color: '#EF4444',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              <Ico d={I.refresh} size={11} /> Try again
            </button>
          </>
        )}
      </div>

      {/* Fallback hint below zone */}
      {!hint && state === 'idle' && (
        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 5, textAlign: 'center' }}>
          Max 10 MB
        </p>
      )}
    </div>
  );
}
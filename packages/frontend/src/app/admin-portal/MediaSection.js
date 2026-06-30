'use client';

import { useState } from 'react';
import { useMedia } from '../context/DataContext';
import FileUpload from '@/app/ui/FileUpload';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const C = {
  primary: '#2E6DE7',
  navy:    '#0F2A4A',
  purple:  '#7C3AED',
  white:   '#F5F7FF',
  border:  '#E2E8F7',
};

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 14,
  border: `1px solid ${C.border}`, background: '#FFFFFF', color: C.navy,
  outline: 'none', fontFamily: "'Noto Sans', sans-serif", transition: 'border-color 0.15s',
};
const labelStyle = { display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: C.navy, marginBottom: 6, textTransform: 'uppercase' };

function Field({ label, hint, children }) {
  return (
    <div className="mb-4">
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{hint}</p>}
    </div>
  );
}

const TYPE_OPTIONS = ['Sermon', 'Event Video', 'Photo Gallery', 'Music'];

const Badge = ({ text }) => {
  const m = { Published: 'bg-emerald-100 text-emerald-700', Draft: 'bg-amber-100 text-amber-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m[text] || 'bg-gray-100 text-gray-600'}`}>{text}</span>;
};

function fileExt(url = '') {
  return url.split('?')[0].split('.').pop().toLowerCase();
}
const VIDEO_EXT = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'ogg'];
const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
function isVideoFile(url = '') { return VIDEO_EXT.includes(fileExt(url)); }
function isImageFile(url = '') { return IMAGE_EXT.includes(fileExt(url)); }

// ── Single-item edit/add modal ──────────────────────────────────────────
function MediaModal({ modal, form, setForm, token, onClose, onSave, saving }) {
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: C.border }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 17, fontWeight: 700 }}>
            {modal === 'add' ? 'Add Media' : 'Edit Media'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">✕</button>
        </div>
        <div className="px-6 py-5">
          <Field label="Title"><input value={form.title} onChange={f('title')} style={inputStyle} placeholder="Media title" /></Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Type">
                <select value={form.type} onChange={f('type')} style={inputStyle}>
                  {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Presenter"><input value={form.presenter} onChange={f('presenter')} style={inputStyle} placeholder="Name" /></Field>
            </div>
          </div>

          <Field label="Event / Highlights Group (optional)" hint="Items sharing the same event name are grouped into a highlights gallery on the Media page.">
            <input value={form.eventTitle} onChange={f('eventTitle')} style={inputStyle} placeholder="e.g. Youth Retreat — Revive" />
          </Field>

          <Field label="YouTube / External Link (optional)">
            <input value={form.url} onChange={f('url')} style={inputStyle} placeholder="https://www.youtube.com/watch?v=…" />
          </Field>

          <FileUpload
            token={token}
            accept="image/*,video/*"
            label="Direct Upload (optional)"
            hint="Image or video · max 10 MB — use this OR a YouTube link, or both"
            currentUrl={form.fileUrl}
            onUpload={({ url }) => setForm(p => ({ ...p, fileUrl: url }))}
            onRemove={() => setForm(p => ({ ...p, fileUrl: '' }))}
          />

          <div className="flex gap-3 mt-4">
            <div className="flex-1"><Field label="Date"><input type="date" value={form.date} onChange={f('date')} style={inputStyle} /></Field></div>
            <div className="flex-1">
              <Field label="Status">
                <select value={form.status} onChange={f('status')} style={inputStyle}>
                  <option>Draft</option><option>Published</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: C.border, color: '#64748B' }}>Cancel</button>
            <button onClick={onSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: saving ? '#94A3B8' : C.primary, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Bulk highlights upload modal ────────────────────────────────────────
function BulkUploadModal({ token, onClose, onComplete }) {
  const [eventTitle, setEventTitle] = useState('');
  const [type, setType]             = useState('Photo Gallery');
  const [presenter, setPresenter]   = useState('');
  const [date, setDate]             = useState('');
  const [files, setFiles]           = useState([]);
  const [uploading, setUploading]   = useState(false);
  const [done, setDone]             = useState(0);
  const [errors, setErrors]         = useState([]);

  const uploadOne = (file) => new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API}/api/uploads`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data?.error || `Upload failed (${xhr.status})`));
      } catch { reject(new Error('Unexpected server response')); }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });

  const handleUploadAll = async () => {
    if (!eventTitle.trim() || files.length === 0) return;
    setUploading(true);
    setDone(0);
    setErrors([]);
    let successCount = 0;
    for (const file of files) {
      try {
        const { url } = await uploadOne(file);
        const create = await fetch(`${API}/api/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: `${eventTitle.trim()} — ${file.name.replace(/\.[^.]+$/, '')}`,
            type,
            presenter: presenter.trim(),
            date: date || new Date().toISOString().split('T')[0],
            eventTitle: eventTitle.trim(),
            fileUrl: url,
            status: 'Published',
          }),
        });
        if (!create.ok) throw new Error('Could not save media record');
        successCount += 1;
      } catch (err) {
        setErrors((prev) => [...prev, `${file.name}: ${err.message}`]);
      } finally {
        setDone((d) => d + 1);
      }
    }
    setUploading(false);
    if (successCount > 0) onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }} onClick={e => e.target === e.currentTarget && !uploading && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: C.border }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 17, fontWeight: 700 }}>Bulk Highlights Upload</h3>
          {!uploading && <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">✕</button>}
        </div>
        <div className="px-6 py-5">
          <p className="text-xs mb-4" style={{ color: '#64748B' }}>
            Upload several photos or videos from one event in a single go. Each file becomes its own media item,
            all tagged to the same event so they group into a highlights gallery on the public Media page.
          </p>

          <Field label="Event Name"><input value={eventTitle} onChange={e => setEventTitle(e.target.value)} style={inputStyle} placeholder="e.g. Youth Retreat — Revive" disabled={uploading} /></Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Type">
                <select value={type} onChange={e => setType(e.target.value)} style={inputStyle} disabled={uploading}>
                  {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} disabled={uploading} /></Field>
            </div>
          </div>
          <Field label="Presenter / Credit (optional)"><input value={presenter} onChange={e => setPresenter(e.target.value)} style={inputStyle} placeholder="e.g. Publicity Team" disabled={uploading} /></Field>

          <Field label="Files">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={uploading}
              onChange={e => setFiles(Array.from(e.target.files || []))}
              className="text-sm"
            />
            {files.length > 0 && (
              <p className="text-xs mt-2" style={{ color: '#64748B' }}>{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
            )}
          </Field>

          {uploading && (
            <div className="rounded-xl p-3 mb-3" style={{ background: C.white, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold" style={{ color: C.primary }}>Uploading {done} of {files.length}…</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}>
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} disabled={uploading} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: C.border, color: '#64748B', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              {done === files.length && done > 0 && !uploading ? 'Close' : 'Cancel'}
            </button>
            <button
              onClick={handleUploadAll}
              disabled={uploading || !eventTitle.trim() || files.length === 0}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{
                background: uploading || !eventTitle.trim() || files.length === 0 ? '#94A3B8' : C.primary,
                cursor: uploading || !eventTitle.trim() || files.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? 'Uploading…' : `Upload ${files.length || ''} File${files.length === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────
export default function MediaSection({ role, token }) {
  const { items, add, update, remove, load } = useMedia();
  const [modal, setModal] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const blank = { title: '', type: 'Sermon', presenter: '', date: '', status: 'Published', url: '', fileUrl: '', eventTitle: '' };
  const [form, setForm] = useState(blank);

  const filtered = items.filter((x) =>
    x.title.toLowerCase().includes(search.toLowerCase()) ||
    (x.eventTitle || '').toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    setSaving(true);
    try {
      const result = modal === 'add' ? await add(form) : await update({ ...form, id: modal.id });
      if (result?.ok) setModal(null);
      else alert(result?.error || 'The change could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 22, fontWeight: 700 }}>Media Library</h2>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or event…"
              className="pl-3 pr-3 py-1.5 text-sm rounded-lg border outline-none"
              style={{ borderColor: C.border, background: C.white, color: C.navy, width: 200 }} />
          </div>
          <button onClick={() => setBulkOpen(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-blue-50 transition-all"
            style={{ borderColor: C.primary, color: C.primary, background: 'white' }}>
            + Bulk Highlights
          </button>
          <button onClick={() => { setForm(blank); setModal('add'); }}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: C.primary }}>
            + Add Media
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.border }}>
        <table className="w-full text-sm" style={{ fontFamily: "'Noto Sans',sans-serif" }}>
          <thead>
            <tr style={{ background: C.white }}>
              {['Title', 'Type', 'Event', 'Presenter', 'Date', 'Status'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.navy, letterSpacing: '0.04em' }}>{h.toUpperCase()}</th>
              ))}
              <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: C.navy }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} className="border-t hover:bg-blue-50 transition-colors" style={{ borderColor: C.border, background: i % 2 === 0 ? 'white' : '#FAFBFF' }}>
                <td className="px-4 py-3" style={{ color: '#334155' }}><span className="block max-w-xs truncate">{row.title}</span></td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{row.type}</td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>
                  {row.eventTitle ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: C.purple }}>{row.eventTitle}</span>
                  ) : <span style={{ color: '#94A3B8' }}>—</span>}
                </td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{row.presenter || '—'}</td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{row.date || '—'}</td>
                <td className="px-4 py-3"><Badge text={row.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    {row.fileUrl && (
                      <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors" title="Open file">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3" />
                        </svg>
                      </a>
                    )}
                    <button onClick={() => { setForm({ ...blank, ...row }); setModal(row); }} className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {role !== 'editor' && (
                      <button onClick={() => remove(row.id)} className="p-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                          <path d="M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">No media found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <MediaModal modal={modal} form={form} setForm={setForm} token={token} saving={saving}
          onClose={() => setModal(null)} onSave={save} />
      )}

      {bulkOpen && (
        <BulkUploadModal token={token} onClose={() => setBulkOpen(false)} onComplete={async () => { await load(); setBulkOpen(false); }} />
      )}
    </div>
  );
}
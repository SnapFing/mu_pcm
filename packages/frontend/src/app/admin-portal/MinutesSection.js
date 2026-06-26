import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MinutesSection({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'add' | {id, ...data}
  const blank = { title: '', meetingDate: '', body: '', agenda: '', fileUrl: '' };
  const [form, setForm] = useState(blank);
  const [uploading, setUploading] = useState(false);
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/minutes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const method = modal === 'add' ? 'POST' : 'PUT';
    const url = modal === 'add' ? `${API}/api/minutes` : `${API}/api/minutes/${modal.id}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setModal(null);
      load();
    } else {
      alert('Failed to save');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file, file.name);
    try {
      const res = await fetch(`${API}/api/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);
      setForm(p => ({ ...p, fileUrl: data.url }));
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading minutes...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#0F2A4A', fontSize: 22, fontWeight: 700 }}>Meeting Minutes</h2>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{items.length} records</p>
        </div>
        <button onClick={() => { setForm(blank); setModal('add'); }}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#2E6DE7' }}>
          + Add Minutes
        </button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border p-4 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
            style={{ borderColor: '#E2E8F7' }}
            onClick={() => { setForm(item); setModal(item); }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: '#0F2A4A' }}>{item.title}</h3>
                <p className="text-xs mt-1" style={{ color: '#64748B' }}>{item.meetingDate ? new Date(item.meetingDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
              </div>
              {item.fileUrl && (
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No minutes recorded yet.</p>}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white" style={{ borderColor: '#E2E8F7' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0F2A4A', fontSize: 17, fontWeight: 700 }}>
                {modal === 'add' ? 'Add Minutes' : 'Edit Minutes'}
              </h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0F2A4A' }}>TITLE</label>
                <input value={form.title} onChange={f('title')} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#E2E8F7' }} placeholder="e.g. Executive Meeting Minutes" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0F2A4A' }}>MEETING DATE</label>
                <input type="date" value={form.meetingDate} onChange={f('meetingDate')} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#E2E8F7' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0F2A4A' }}>AGENDA</label>
                <textarea value={form.agenda} onChange={f('agenda')} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: '#E2E8F7' }} placeholder="Agenda items…" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0F2A4A' }}>MINUTES BODY</label>
                <textarea value={form.body} onChange={f('body')} rows={6} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: '#E2E8F7' }} placeholder="Full minutes…" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0F2A4A' }}>ATTACHMENT</label>
                {form.fileUrl && <p className="text-xs mb-2 text-emerald-600">Current file: <a href={form.fileUrl} target="_blank" className="underline">View</a></p>}
                <input type="file" accept=".pdf,image/*" onChange={handleFileUpload} disabled={uploading} className="text-sm" />
                {uploading && <p className="text-xs mt-1 text-slate-500">Uploading…</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: '#E2E8F7', color: '#64748B' }}>Cancel</button>
                <button onClick={save} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#2E6DE7' }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
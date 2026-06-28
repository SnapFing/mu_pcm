import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MembersRegisterSection({ token }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/students/register`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = members.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.studentId || '').toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Student ID', 'Department', 'Year', 'Room', 'Hostel', 'Locality', 'Home Address', 'Church', 'Category', 'Status', 'Frozen'];
    const rows = filtered.map(m => [
      m.name, m.email, m.phone, m.studentId, m.department, m.year,
      m.roomNumber, m.hostel, m.locality, m.homeAddress, m.churchName, m.category, m.status, m.frozen ? 'Yes' : 'No'
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members-register.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading register...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#0F2A4A', fontSize: 22, fontWeight: 700 }}>Members Register</h2>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{members.length} members</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#E2E8F7', background: '#F5F7FF', color: '#0F2A4A', width: 165 }}
          />
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{ background: '#059669' }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E2E8F7' }}>
        <table className="w-full text-sm" style={{ fontFamily: "'Noto Sans',sans-serif" }}>
          <thead>
            <tr style={{ background: '#F5F7FF' }}>
              {['Name', 'Email', 'Phone', 'Hostel/Locality', 'Church', 'Category', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#0F2A4A' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className="border-t hover:bg-blue-50 transition-colors"
                style={{ borderColor: '#E2E8F7', background: i % 2 === 0 ? 'white' : '#FAFBFF' }}>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{m.name}</td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{m.email}</td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{m.phone || '—'}</td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>
                  {m.hostel || m.locality ? `${m.hostel || ''}${m.hostel && m.locality ? ', ' : ''}${m.locality || ''}` : '—'}
                </td>
                <td className="px-4 py-3" style={{ color: '#334155' }}>{m.churchName || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    m.category === 'Ordinary' ? 'bg-blue-100 text-blue-700' :
                    m.category === 'Associate' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{m.category}</span>
                </td>
                {/* ── Status + Frozen badge ─────────────────────────────── */}
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    m.frozen ? 'bg-yellow-100 text-yellow-700' :
                    m.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{m.frozen ? 'Frozen' : m.status}</span>
                </td>
                {/* ── Actions ────────────────────────────────────────────── */}
                <td className="px-4 py-3">
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button onClick={() => setSelected(m)}
                      className="text-blue-600 text-xs font-semibold hover:underline">View</button>

                    {/* Freeze / Unfreeze */}
                    <button
                      onClick={async () => {
                        const freeze = !m.frozen;
                        const action = freeze ? 'freeze' : 'unfreeze';
                        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${m.name}?`)) return;
                        const res = await fetch(`${API}/api/students/${m.id}/freeze`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ disabled: freeze }),
                        });
                        if (res.ok) load();
                        else { const d = await res.json().catch(() => ({})); alert(d.error || 'Failed'); }
                      }}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: m.frozen ? '#059669' : '#F59E0B' }}
                    >
                      {m.frozen ? 'Unfreeze' : 'Freeze'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={async () => {
                        if (!confirm(`Permanently delete ${m.name}? This cannot be undone.`)) return;
                        const res = await fetch(`${API}/api/students/${m.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        if (res.ok) load();
                        else { const d = await res.json().catch(() => ({})); alert(d.error || 'Failed'); }
                      }}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'Noto Sans',sans-serif" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white" style={{ borderColor: '#E2E8F7' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0F2A4A', fontSize: 17, fontWeight: 700 }}>Member Details</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100">✕</button>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              {[
                ['Name', selected.name],
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Student ID', selected.studentId],
                ['Department', selected.department],
                ['Year', selected.year],
                ['Room Number', selected.roomNumber],
                ['Hostel', selected.hostel],
                ['Locality', selected.locality],
                ['Home Address', selected.homeAddress],
                ['Church', selected.churchName],
                ['Category', selected.category],
                ['Status', selected.frozen ? 'Frozen' : selected.status],
                ['Joined Bands', (selected.joinedBands || []).join(', ')],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-b pb-2" style={{ borderColor: '#F1F5F9' }}>
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className="text-slate-800 font-semibold text-right max-w-[60%]">{val || '—'}</span>
                </div>
              ))}
              <button onClick={() => setSelected(null)} className="w-full py-2.5 rounded-xl text-sm font-medium" style={{ color: '#64748B', border: '1px solid #E2E8F7', background: 'white' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
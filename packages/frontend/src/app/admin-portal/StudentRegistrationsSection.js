'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Palette (matches admin portal) ────────────────────────────────────────
const C = {
  primary: '#2E6DE7',
  navy:    '#0F2A4A',
  purple:  '#7C3AED',
  white:   '#F5F7FF',
  border:  '#E2E8F7',
};

// ── Inline icon ───────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  check:   'M20 6L9 17l-5-5',
  trash:   'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  close:   'M18 6L6 18 M6 6l12 12',
  refresh: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
  user:    'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  clock:   'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  filter:  'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
};

// ── Category badge colours ─────────────────────────────────────────────────
function CategoryBadge({ value }) {
  const map = {
    Ordinary:   { bg: '#EFF6FF', color: '#1D4ED8' },
    Associate:  { bg: '#F5F3FF', color: '#6D28D9' },
    Honourary:  { bg: '#FFFBEB', color: '#92400E' },
  };
  const s = map[value] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 8px', borderRadius: 999,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
    }}>{value}</span>
  );
}

// ── Detail row ─────────────────────────────────────────────────────────────
function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '8px 0', borderBottom: `1px solid ${C.border}`, gap: 12,
    }}>
      <span style={{ color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: C.navy, fontSize: 13, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function StudentRegistrationsSection({ token }) {
  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);   // student in detail modal
  const [acting,    setActing]    = useState(null);    // uid currently being approved/rejected
  const [filter,    setFilter]    = useState('pending'); // 'pending' | 'all'
  const [search,    setSearch]    = useState('');
  const [toast,     setToast]     = useState(null);   // { msg, ok }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // ── Load students ─────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? `${API}/api/students/admin`
        : `${API}/api/students/admin?status=pending`;
      const res  = await fetch(url, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setStudents(Array.isArray(data) ? data : []);
      else showToast(data?.error || 'Failed to load registrations', false);
    } catch (err) {
      showToast('Network error: ' + err.message, false);
    } finally {
      setLoading(false);
    }
  }, [token, filter]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  // ── Approve ───────────────────────────────────────────────────────────────
  const approve = async (student) => {
    if (!confirm(`Approve ${student.name}? They will receive a welcome email and can log in immediately.`)) return;
    setActing(student.id);
    try {
      const res  = await fetch(`${API}/api/students/${student.id}/approve`, {
        method: 'POST', headers: authHeaders,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast(`✓ ${student.name} approved — welcome email sent`);
        setSelected(null);
        await load();
      } else {
        showToast(data?.error || 'Approval failed', false);
      }
    } catch (err) {
      showToast('Network error: ' + err.message, false);
    } finally {
      setActing(null);
    }
  };

  // ── Reject / delete ───────────────────────────────────────────────────────
  const reject = async (student) => {
    if (!confirm(`Permanently reject and delete ${student.name}? This cannot be undone.`)) return;
    setActing(student.id);
    try {
      const res  = await fetch(`${API}/api/students/${student.id}`, {
        method: 'DELETE', headers: authHeaders,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast(`${student.name}'s registration was rejected and removed`);
        setSelected(null);
        await load();
      } else {
        showToast(data?.error || 'Rejection failed', false);
      }
    } catch (err) {
      showToast('Network error: ' + err.message, false);
    } finally {
      setActing(null);
    }
  };

  // ── Filtered / searched list ──────────────────────────────────────────────
  const visible = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.name       || '').toLowerCase().includes(q) ||
      (s.email      || '').toLowerCase().includes(q) ||
      (s.studentId  || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q)
    );
  });

  const pending = students.filter(s => s.status === 'pending').length;

  // ── Status pill ───────────────────────────────────────────────────────────
  function StatusPill({ status }) {
    const map = {
      pending:  { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
      approved: { bg: '#DCFCE7', color: '#14532D', label: 'Approved' },
      rejected: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#475569', label: status };
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: '2px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700,
      }}>{s.label}</span>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ position: 'relative' }}>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: toast.ok ? '#0F2A4A' : '#DC2626',
          color: 'white', padding: '12px 20px', borderRadius: 12,
          fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          maxWidth: 360,
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 22, fontWeight: 700, margin: 0 }}>
            Student Registrations
          </h2>
          <p style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>
            {loading ? 'Loading…' : `${visible.length} shown · ${pending} pending approval`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Filter toggle */}
          <div style={{ display: 'flex', background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {['pending', 'all'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '7px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: filter === f ? C.primary : 'transparent',
                  color: filter === f ? 'white' : '#64748B',
                }}>
                {f === 'pending' ? '⏳ Pending' : '📋 All'}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name / email / ID…"
            style={{
              padding: '7px 12px', borderRadius: 10, border: `1px solid ${C.border}`,
              fontSize: 12, outline: 'none', background: C.white,
              color: C.navy, width: 200,
            }}
          />

          {/* Refresh */}
          <button onClick={load} title="Refresh"
            style={{
              padding: '7px 10px', borderRadius: 10, border: `1px solid ${C.border}`,
              background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
            <Icon d={ICONS.refresh} size={14} color={C.primary} />
          </button>
        </div>
      </div>

      {/* ── Pending callout banner ─────────────────────────────────────────── */}
      {pending > 0 && filter === 'pending' && (
        <div style={{
          background: '#FEF3C7', border: '1px solid #FCD34D',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
        }}>
          <Icon d={ICONS.clock} size={16} color='#92400E' />
          <span style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>
            {pending} student{pending !== 1 ? 's' : ''} waiting for approval.
            Review each application below, then approve or reject.
          </span>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
          Loading registrations…
        </div>
      ) : visible.length === 0 ? (
        <div style={{
          padding: '60px 24px', textAlign: 'center', background: 'white',
          border: `1px solid ${C.border}`, borderRadius: 16,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 500 }}>
            {filter === 'pending' ? 'No pending registrations — all caught up!' : 'No registrations found.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${C.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Noto Sans',sans-serif", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.white }}>
                {['Name', 'Email', 'Category', 'Student ID', 'Applied', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    textAlign: h === 'Actions' ? 'right' : 'left',
                    padding: '11px 14px', fontSize: 11, fontWeight: 700,
                    color: C.navy, letterSpacing: '0.05em',
                    borderBottom: `1px solid ${C.border}`,
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((s, i) => {
                const busy = acting === s.id;
                return (
                  <tr key={s.id}
                    style={{
                      background: i % 2 === 0 ? 'white' : '#FAFBFF',
                      borderBottom: `1px solid ${C.border}`,
                      opacity: busy ? 0.6 : 1,
                      transition: 'opacity 0.15s',
                    }}>

                    {/* Name + avatar initial */}
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: C.primary + '22',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 13, color: C.primary,
                        }}>
                          {(s.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: C.navy }}>{s.name}</div>
                          {s.phone && <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.phone}</div>}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '11px 14px', color: '#334155', maxWidth: 180 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.email}
                      </span>
                    </td>

                    <td style={{ padding: '11px 14px' }}>
                      <CategoryBadge value={s.category} />
                    </td>

                    <td style={{ padding: '11px 14px', color: '#475569', fontFamily: 'monospace', fontSize: 12 }}>
                      {s.studentId || '—'}
                    </td>

                    <td style={{ padding: '11px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      }) : '—'}
                    </td>

                    <td style={{ padding: '11px 14px' }}>
                      <StatusPill status={s.status} />
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, alignItems: 'center' }}>

                        {/* View details */}
                        <button
                          onClick={() => setSelected(s)}
                          title="View full application"
                          style={{
                            padding: '5px 8px', borderRadius: 8, border: `1px solid ${C.border}`,
                            background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          }}>
                          <Icon d={ICONS.eye} size={13} color='#2E6DE7' />
                        </button>

                        {/* Approve (only for pending) */}
                        {s.status === 'pending' && (
                          <button
                            onClick={() => approve(s)}
                            disabled={busy}
                            title="Approve registration"
                            style={{
                              padding: '5px 10px', borderRadius: 8, border: 'none',
                              background: busy ? '#D1FAE5' : '#059669',
                              color: 'white', cursor: busy ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', gap: 4,
                              fontSize: 12, fontWeight: 600,
                            }}>
                            <Icon d={ICONS.check} size={12} color='white' />
                            {busy ? '…' : 'Approve'}
                          </button>
                        )}

                        {/* Reject / delete */}
                        {s.status === 'pending' && (
                          <button
                            onClick={() => reject(s)}
                            disabled={busy}
                            title="Reject and delete registration"
                            style={{
                              padding: '5px 10px', borderRadius: 8, border: 'none',
                              background: busy ? '#FEE2E2' : '#DC2626',
                              color: 'white', cursor: busy ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', gap: 4,
                              fontSize: 12, fontWeight: 600,
                            }}>
                            <Icon d={ICONS.trash} size={12} color='white' />
                            {busy ? '…' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Detail / Review Modal ──────────────────────────────────────────── */}
      {selected && (
        <div
          onClick={e => e.target === e.currentTarget && setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(15,42,74,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}>
          <div style={{
            background: 'white', borderRadius: 20, width: '100%', maxWidth: 540,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
          }}>

            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: `1px solid ${C.border}`,
              position: 'sticky', top: 0, background: 'white', zIndex: 10,
            }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 17, fontWeight: 700, margin: 0 }}>
                  Application Review
                </h3>
                <p style={{ color: '#64748B', fontSize: 12, margin: '2px 0 0' }}>
                  Submitted {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  }) : '—'}
                </p>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8 }}>
                <Icon d={ICONS.close} size={16} color='#94A3B8' />
              </button>
            </div>

            {/* Applicant hero row */}
            <div style={{
              padding: '20px 24px',
              background: `linear-gradient(135deg, ${C.navy} 0%, #1a3a5c 100%)`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Playfair Display',serif",
                fontSize: 22, fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {(selected.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display',serif" }}>
                  {selected.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 }}>
                  {selected.email}
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                  <CategoryBadge value={selected.category} />
                  <StatusPill status={selected.status} />
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ padding: '20px 24px' }}>

              {selected.category === 'Ordinary' && (
                <div style={{
                  background: C.white, borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                  border: `1px solid ${C.border}`,
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', marginBottom: 10 }}>
                    ACADEMIC DETAILS
                  </p>
                  <DetailRow label="Student ID"  value={selected.studentId} />
                  <DetailRow label="Department"  value={selected.department} />
                  <DetailRow label="Year"        value={selected.year} />
                </div>
              )}

              <div style={{
                background: C.white, borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                border: `1px solid ${C.border}`,
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', marginBottom: 10 }}>
                  CONTACT & LOCATION
                </p>
                <DetailRow label="Phone"         value={selected.phone} />
                <DetailRow label="Room No."      value={selected.roomNumber} />
                <DetailRow label="Hostel"        value={selected.hostel} />
                <DetailRow label="Locality"      value={selected.locality} />
                <DetailRow label="Home Address"  value={selected.homeAddress} />
              </div>

              <div style={{
                background: C.white, borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                border: `1px solid ${C.border}`,
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', marginBottom: 10 }}>
                  CHURCH & MINISTRY
                </p>
                <DetailRow label="Home Church"   value={selected.churchName} />
                <DetailRow label="Band Interest" value={(selected.joinedBands || []).join(', ') || '—'} />
              </div>
            </div>

            {/* Action footer — only shown for pending */}
            {selected.status === 'pending' && (
              <div style={{
                padding: '16px 24px', borderTop: `1px solid ${C.border}`,
                display: 'flex', gap: 10, justifyContent: 'flex-end',
                position: 'sticky', bottom: 0, background: 'white',
              }}>
                <button onClick={() => setSelected(null)}
                  style={{
                    padding: '9px 18px', borderRadius: 10, border: `1px solid ${C.border}`,
                    background: 'white', color: '#64748B', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                  }}>
                  Review later
                </button>
                <button
                  onClick={() => reject(selected)}
                  disabled={acting === selected.id}
                  style={{
                    padding: '9px 18px', borderRadius: 10, border: 'none',
                    background: acting === selected.id ? '#FEE2E2' : '#DC2626',
                    color: 'white', cursor: acting === selected.id ? 'not-allowed' : 'pointer',
                    fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <Icon d={ICONS.trash} size={13} color='white' />
                  Reject Application
                </button>
                <button
                  onClick={() => approve(selected)}
                  disabled={acting === selected.id}
                  style={{
                    padding: '9px 18px', borderRadius: 10, border: 'none',
                    background: acting === selected.id ? '#D1FAE5' : '#059669',
                    color: 'white', cursor: acting === selected.id ? 'not-allowed' : 'pointer',
                    fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <Icon d={ICONS.check} size={13} color='white' />
                  Approve & Welcome
                </button>
              </div>
            )}

            {/* Already-processed footer */}
            {selected.status !== 'pending' && (
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, textAlign: 'right' }}>
                <button onClick={() => setSelected(null)}
                  style={{
                    padding: '9px 18px', borderRadius: 10, border: `1px solid ${C.border}`,
                    background: 'white', color: '#64748B', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                  }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
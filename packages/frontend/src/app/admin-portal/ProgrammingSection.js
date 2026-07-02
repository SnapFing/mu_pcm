'use client';

import { useState } from 'react';
import { useProgramming, useEvents } from '../context/DataContext';

const C = {
  primary: '#2E6DE7',
  navy:    '#0F2A4A',
  purple:  '#7C3AED',
  white:   '#F5F7FF',
  border:  '#E2E8F7',
};

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
  border: `1px solid ${C.border}`, background: '#FFFFFF', color: C.navy,
  outline: 'none', fontFamily: "'Noto Sans', sans-serif",
};
const labelStyle = { display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: C.navy, marginBottom: 6, textTransform: 'uppercase' };

const BAND_OPTIONS = [
  'Prayer Band', 'Preaching & Witnessing Band', 'Health Band',
  'Music Committee', 'Education & Library Committee', 'Welfare Committee',
  'Catering Committee', 'Technical Committee', 'Other',
];

function emptyRow() {
  return { 
    id: `row_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, 
    band: BAND_OPTIONS[0], 
    date: '', 
    presenter: '',
    presenterEmail: '', 
    standardsConfirmed: false,
    confirmedBy: '',
    confirmedAt: '',
    notifiedAt: '',
  };

}

export default function ProgrammingSection({ token }) {
  const { items, add, update, remove } = useProgramming();
  const { add: addEvent } = useEvents();

  const [modal, setModal] = useState(null); // 'add' | plan object
  const blank = { title: '', termLabel: '', notes: '', schedule: [] };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState(null); // row id currently being promoted
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const openAdd  = () => { setForm(blank); setModal('add'); };
  const openEdit = (plan) => { setForm({ ...blank, ...plan, schedule: plan.schedule || [] }); setModal(plan); };
  const close    = () => setModal(null);

  const save = async () => {
    setSaving(true);
    try {
      const result = modal === 'add' ? await add(form) : await update({ ...form, id: modal.id });
      if (result?.ok) { showToast('Plan saved'); close(); }
      else showToast(result?.error || 'Could not save the plan.', false);
    } finally {
      setSaving(false);
    }
  };

  const removePlan = async (id) => {
    if (!confirm('Delete this plan? This cannot be undone.')) return;
    const result = await remove(id);
    if (result?.ok) showToast('Plan deleted');
    else showToast(result?.error || 'Could not delete.', false);
  };

  // ── Schedule row editing (within the modal form) ─────────────────────
  const addRow    = () => setForm(p => ({ ...p, schedule: [...(p.schedule || []), emptyRow()] }));
  const removeRow = (id) => setForm(p => ({ ...p, schedule: (p.schedule || []).filter(r => r.id !== id) }));
  const updateRow = (id, field, value) => setForm(p => ({
    ...p,
    schedule: (p.schedule || []).map(r => r.id === id ? { ...r, [field]: value } : r),
  }));

  // ── Promote a draft row to a real public Event ───────────────────────
  const promoteRow = async (plan, row) => {
    if (!row.date) { showToast('Set a date on this row before promoting it.', false); return; }
    if (!confirm(`Create a public Event for "${row.band}" on ${row.date}?`)) return;
    setPromoting(row.id);
    try {
      const result = await addEvent({
        title: `${row.band} — ${plan.termLabel || plan.title || ''}`.trim(),
        date: row.date,
        time: '',
        venue: '',
        description: row.presenter ? `Presented by ${row.presenter}.` : '',
        image: '',
        status: 'Upcoming',
        category: 'Worship Services',
        featured: false,
        contactNumber: '',
        mapsQuery: '',
      });
      if (result?.ok) showToast('Public event created — finish the details in Events.');
      else showToast(result?.error || 'Could not create the event.', false);
    } finally {
      setPromoting(null);
    }
  };

  return (
    <div style={{ position: 'relative' }}>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: toast.ok ? C.navy : '#DC2626',
          color: 'white', padding: '12px 20px', borderRadius: 12,
          fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          maxWidth: 360,
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 22, fontWeight: 700, margin: 0 }}>
            Programming Workspace
          </h2>
          <p style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>
            Private planning space — visible only to the Programming Committee and admins. Nothing here is public until promoted.
          </p>
        </div>
        <button onClick={openAdd}
          style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: C.primary, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + New Plan
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', background: 'white', border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 500 }}>No plans yet — create one to start scheduling the term.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((plan) => (
            <div key={plan.id} style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{plan.title || 'Untitled plan'}</p>
                  {plan.termLabel && <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{plan.termLabel}</p>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(plan)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'white', color: C.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => removePlan(plan.id)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(220,38,38,0.25)', background: 'rgba(220,38,38,0.05)', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>

              {plan.notes && (
                <div style={{ padding: '14px 20px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{plan.notes}</p>
                </div>
              )}

              {(plan.schedule || []).length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: C.white }}>
                        {['Band', 'Date', 'Presenter', 'Standards', ''].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '9px 16px', fontSize: 11, fontWeight: 700, color: C.navy }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {plan.schedule.map((row) => (
                        <tr key={row.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td style={{ padding: '9px 16px', color: '#334155' }}>{row.band}</td>
                          <td style={{ padding: '9px 16px', color: '#334155' }}>{row.date || '—'}</td>
                          <td style={{ padding: '9px 16px', color: '#334155' }}>{row.presenter || '—'}</td>
                          <td style={{ padding: '9px 16px' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                              background: row.standardsConfirmed ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.12)',
                              color: row.standardsConfirmed ? '#059669' : '#64748B',
                            }}>
                              {row.standardsConfirmed ? 'Confirmed' : 'Pending'}
                            </span>
                          </td>
                          
                          <td style={{ padding: '9px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => promoteRow(plan, row)}
                              disabled={promoting === row.id}
                              style={{
                                padding: '5px 10px', borderRadius: 8, border: 'none',
                                background: promoting === row.id ? '#94A3B8' : C.primary,
                                color: 'white', fontSize: 11, fontWeight: 600,
                                cursor: promoting === row.id ? 'not-allowed' : 'pointer',
                              }}>
                              {promoting === row.id ? 'Creating…' : 'Promote'}
                            </button>
                          </td>
                          
                          <td style={{ padding: '9px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            {row.presenterEmail && (
                              <button
                                onClick={() => notifyPresenter(plan, row)}
                                disabled={notifying === row.id}
                                style={{
                                  padding: '5px 10px', borderRadius: 8, border: `1px solid ${C.border}`,
                                  background: row.notifiedAt ? '#F5F7FF' : 'white',
                                  color: notifying === row.id ? '#94A3B8' : C.primary,
                                  fontSize: 11, fontWeight: 600, cursor: notifying === row.id ? 'not-allowed' : 'pointer',
                                }}>
                                {notifying === row.id ? 'Sending…' : row.notifiedAt ? '✓ Notified' : 'Notify'}
                              </button>
                            )}
                            <button onClick={() => promoteRow(plan, row)} disabled={promoting === row.id} /* ...existing... */>
                              {promoting === row.id ? 'Creating…' : 'Promote'}
                            </button>
                          </div>
                        </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit modal ────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,42,74,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && close()}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'white' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 17, fontWeight: 700 }}>
                {modal === 'add' ? 'New Plan' : 'Edit Plan'}
              </h3>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 18 }}>✕</button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Plan Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={inputStyle} placeholder="e.g. Semester 1 Worship Schedule" />
              </div>
              <div>
                <label style={labelStyle}>Term Label</label>
                <input value={form.termLabel} onChange={e => setForm(p => ({ ...p, termLabel: e.target.value }))}
                  style={inputStyle} placeholder="e.g. Semester 1, 2026" />
              </div>
              <div>
                <label style={labelStyle}>Strategic Plan Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="Term goals, focus areas, review dates…" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Draft Schedule</label>
                  <button type="button" onClick={addRow}
                    style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
                    + Add row
                  </button>
                </div>

                {(form.schedule || []).length === 0 && (
                  <p style={{ fontSize: 12, color: '#94A3B8' }}>No slots yet — add one to start planning.</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(form.schedule || []).map((row) => (
                    <div key={row.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 8 }}>
                      <select value={row.band} onChange={e => updateRow(row.id, 'band', e.target.value)}
                        style={{ ...inputStyle, flex: '1 1 150px' }}>
                        {BAND_OPTIONS.map(b => <option key={b}>{b}</option>)}
                      </select>
                      
                      <input type="date" value={row.date} onChange={e => updateRow(row.id, 'date', e.target.value)}
                        style={{ ...inputStyle, flex: '1 1 130px' }} />
                      
                      <input value={row.presenter} onChange={e => updateRow(row.id, 'presenter', e.target.value)}
                        placeholder="Presenter" style={{ ...inputStyle, flex: '1 1 130px' }} />
                      
                      <input value={row.presenterEmail} onChange={e => updateRow(row.id, 'presenterEmail', e.target.value)}
                        placeholder="Presenter Email" style={{ ...inputStyle, flex: '1 1 130px' }} />
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <input type="checkbox" checked={!!row.standardsConfirmed}
                          onChange={e => updateRow(row.id, 'standardsConfirmed', e.target.checked)} />
                        Standards ok
                      </label>
                      <button type="button" onClick={() => removeRow(row.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button onClick={close} style={{ padding: '9px 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: 'white', color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: saving ? '#94A3B8' : C.primary, color: 'white', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving…' : 'Save Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
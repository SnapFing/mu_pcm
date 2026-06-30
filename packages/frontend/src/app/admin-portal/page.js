"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp, getApps } from "firebase/app";
import StudentRegistrationsSection from './StudentRegistrationsSection';
import MemberRegistersSection from './MemberRegistersSection';
import MinutesSection from './MinutesSection';
import FileUpload from '@/app/ui/FileUpload';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onIdTokenChanged,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import {
  useAnnouncements,
  useEvents,
  useJournals,
  useMedia,
  useHeroes,
  useBanners,
  useGroups,
  useResources,
  usePrayers,
  useContacts,
  useAbout,
  useData,
  requestJson,
} from "../context/DataContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseAuth() {
  if (!firebaseConfig.apiKey) return null;
  if (!getApps().length) initializeApp(firebaseConfig);
  return getAuth();
}

async function fetchAdminProfile(idToken) {
  const res = await fetch(`${API}/api/users/me`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "This account is not authorised for the admin portal.");
  }
  return data;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, className = "", style = {} }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}
  >
    <path d={d} />
  </svg>
);
const Icons = {
  dashboard:  "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  journals:   "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  announce:   "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  media:      "M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  heroes:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  events:     "M8 2v4 M16 2v4 M3 10h18 M21 8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V8z",
  groups:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M9 3a4 4 0 010 8 M16 3.13a4 4 0 010 7.75",
  resources:  "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  prayer:     "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  about:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  contact:    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  plus:       "M12 5v14 M5 12h14",
  edit:       "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:      "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  close:      "M18 6L6 18 M6 6l12 12",
  search:     "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  logout:     "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  download:   "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  reply:      "M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5 M19 15l-7 7-7-7",
  check:      "M20 6L9 17l-5-5",
  eye:        "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  chevronL:   "M15 18l-6-6 6-6",
  chevronR:   "M9 18l6-6-6-6",
  reset:      "M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  lock:       "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
  users:      "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  primary: "#2E6DE7",
  navy:    "#0F2A4A",
  purple:  "#7C3AED",
  white:   "#F5F7FF",
  border:  "#E2E8F7",
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════
function useAdminAuth() {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured");
    const cred    = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await cred.user.getIdToken();
    const profile = await fetchAdminProfile(idToken);
    const userData = {
      uid:         cred.user.uid,
      email:       cred.user.email,
      role:        profile.role,
      displayName: profile.displayName,
      active:      profile.active,
    };
    setToken(idToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) { setLoading(false); return; }

    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null); setToken(null); setLoading(false);
        return;
      }
      try {
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        const profile = await fetchAdminProfile(idToken);
        setUser({
          uid:         fbUser.uid,
          email:       fbUser.email,
          role:        profile.role,
          displayName: profile.displayName,
          active:      profile.active,
        });
      } catch (err) {
        console.error("[auth] session error:", err.message);
        await signOut(auth);
        setUser(null); setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  return { user, token, loading, login, logout };
}

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD RESET
// ═══════════════════════════════════════════════════════════════════════════
function ResetPasswordHandler() {
  const [oobCode, setOobCode]         = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage]         = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    const mode = params.get("mode");
    if (mode === "resetPassword" && code) {
      setOobCode(code);
      verifyPasswordResetCode(getFirebaseAuth(), code)
        .then(() => setMessage("Enter your new password below."))
        .catch((err) => setError(err.message || "Invalid or expired reset link."));
    }
  }, []);

  const handleReset = async () => {
    if (!newPassword || newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword);
      alert("Password changed successfully! You can now log in.");
      window.location.href = "/admin-portal";
    } catch (err) {
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.navy }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: "white" }}>
        <div className="px-8 py-8 text-center" style={{ background: C.navy }}>
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: C.primary }}>
            <Icon d={Icons.lock} size={22} className="text-white" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 22, fontWeight: 700 }}>Set New Password</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>MU SDA PCM Admin</p>
        </div>
        <div className="px-8 py-8 flex flex-col gap-4">
          {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}
          {message && <p className="text-sm text-center" style={{ color: C.navy }}>{message}</p>}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy, letterSpacing: "0.05em" }}>NEW PASSWORD</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters"
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14, border: `1px solid ${C.border}`, background: C.white, color: C.navy, outline: "none", fontFamily: "'Noto Sans', sans-serif" }} />
          </div>
          <button onClick={handleReset} disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2" style={{ background: loading ? "#94A3B8" : C.primary, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN GATE
// ═══════════════════════════════════════════════════════════════════════════
function LoginGate({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) { setError("Please enter email and password."); return; }
    setLoading(true); setError("");
    try { await onLogin(email, pass); }
    catch (err) { setError(err.message || "Invalid admin credentials."); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email first");
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      const resetUrl = typeof window !== "undefined" ? `${window.location.origin}/admin-portal` : "/admin-portal";
      await sendPasswordResetEmail(auth, email, { url: resetUrl });
      alert("Password reset email sent to " + email);
    } catch (err) { setError(err.message || "Failed to send reset email"); }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14, border: `1px solid ${C.border}`, background: C.white, color: C.navy, outline: "none", fontFamily: "'Noto Sans', sans-serif" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.navy }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: "white" }}>
        <div className="px-8 py-8 text-center" style={{ background: C.navy }}>
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: C.primary }}>
            <Icon d={Icons.lock} size={22} className="text-white" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 22, fontWeight: 700 }}>Admin Portal</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>MU SDA PCM restricted access</p>
        </div>
        <div className="px-8 py-8 flex flex-col gap-4">
          {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy, letterSpacing: "0.05em" }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mupcm.org" style={inputStyle} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy, letterSpacing: "0.05em" }}>PASSWORD</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" style={inputStyle} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2" style={{ background: loading ? "#94A3B8" : C.primary, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button onClick={handleForgotPassword} className="text-xs font-medium underline mt-2" style={{ color: C.primary, background: "none", border: "none", cursor: "pointer" }}>
            Forgot password?
          </button>
          <p className="text-center text-xs mt-2" style={{ color: "#94A3B8" }}>Firebase admin authentication required.</p>
        </div>
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
const Badge = ({ text }) => {
  const m = {
    Published: "bg-emerald-100 text-emerald-700",
    Active:    "bg-blue-100 text-blue-700",
    Draft:     "bg-amber-100 text-amber-700",
    Archived:  "bg-slate-100 text-slate-500",
    Featured:  "bg-purple-100 text-purple-700",
    Past:      "bg-slate-100 text-slate-500",
    Upcoming:  "bg-blue-100 text-blue-700",
    Inactive:  "bg-red-100 text-red-500",
    Unread:    "bg-orange-100 text-orange-700",
    Prayed:    "bg-emerald-100 text-emerald-700",
    Read:      "bg-slate-100 text-slate-500",
    Replied:   "bg-blue-100 text-blue-700",
    editor:    "bg-blue-100 text-blue-700",
    admin:     "bg-purple-100 text-purple-700",
    super_admin: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m[text] || "bg-gray-100 text-gray-600"}`}>{text}</span>;
};

// ── Modal ──────────────────────────────────────────────────────────────────
const Modal = ({ title, children, onClose, wide = false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,42,74,0.6)", backdropFilter: "blur(4px)" }}>
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: C.border }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 17, fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
          <Icon d={Icons.close} size={17} className="text-slate-400" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

// ── Form helpers ───────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy, letterSpacing: "0.04em" }}>
      {label.toUpperCase()}
    </label>
    {children}
  </div>
);
const inputCls = "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-300";
const inputStyle = { borderColor: C.border, background: C.white, color: C.navy, fontFamily: "'Noto Sans',sans-serif" };
const Input    = (p) => <input    {...p} className={inputCls} style={inputStyle} />;
const Textarea = (p) => <textarea {...p} rows={p.rows || 3} className={`${inputCls} resize-none`} style={inputStyle} />;
const Sel = ({ options, ...p }) => (
  <select {...p} className={inputCls} style={inputStyle}>
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
);
const MFooter = ({ onClose, onSave, saving = false }) => (
  <div className="flex justify-end gap-2 mt-4">
    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: C.border, color: "#64748B" }}>Cancel</button>
    <button onClick={onSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: saving ? '#94A3B8' : C.primary, cursor: saving ? 'not-allowed' : 'pointer' }}>
      {saving ? 'Saving…' : 'Save'}
    </button>
  </div>
);

const saveAndClose = async ({ modal, form, add, update, setModal }) => {
  const result = modal === "add" ? await add(form) : await update({ ...form, id: modal.id });
  if (result?.ok) setModal(null);
  else alert(result?.error || "The change could not be saved.");
  return result;
};

// ── Table ──────────────────────────────────────────────────────────────────
const Table = ({ cols, rows, onEdit, onDelete, extra }) => (
  <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.border }}>
    <table className="w-full text-sm" style={{ fontFamily: "'Noto Sans',sans-serif" }}>
      <thead>
        <tr style={{ background: C.white }}>
          {cols.map((c) => (
            <th key={c.key} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.navy, letterSpacing: "0.04em" }}>
              {c.label.toUpperCase()}
            </th>
          ))}
          <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: C.navy }}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id} className="border-t hover:bg-blue-50 transition-colors"
            style={{ borderColor: C.border, background: i % 2 === 0 ? "white" : "#FAFBFF" }}>
            {cols.map((c) => (
              <td key={c.key} className="px-4 py-3" style={{ color: "#334155" }}>
                {c.key === "status" || c.key === "active" || c.key === "role"
                  ? <Badge text={row[c.key]} />
                  : c.clip
                  ? <span className="block max-w-xs truncate">{row[c.key]}</span>
                  : row[c.key]}
              </td>
            ))}
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1.5">
                {extra && extra(row)}
                {onEdit   && <button onClick={() => onEdit(row)}      className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors"><Icon d={Icons.edit}  size={14} className="text-blue-600" /></button>}
                {onDelete && <button onClick={() => onDelete(row.id)} className="p-1.5 rounded-lg hover:bg-red-100  transition-colors"><Icon d={Icons.trash} size={14} className="text-red-500"  /></button>}
              </div>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={cols.length + 1} className="px-4 py-10 text-center text-slate-400 text-sm">No records found.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

// ── Section Header ─────────────────────────────────────────────────────────
const SHead = ({ title, sub, onAdd, search, onSearch }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 22, fontWeight: 700 }}>{title}</h2>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{sub}</p>}
    </div>
    <div className="flex items-center gap-2">
      {onSearch !== undefined && (
        <div className="relative">
          <Icon d={Icons.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search…"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none"
            style={{ borderColor: C.border, background: C.white, color: C.navy, width: 165 }} />
        </div>
      )}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all" style={{ background: C.primary }}>
          <Icon d={Icons.plus} size={14} className="text-white" />Add New
        </button>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ── Announcements ──────────────────────────────────────────────────────────
function AnnouncementsSection({ role, token }) {
  const { items, add, update, remove } = useAnnouncements();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title: "", body: "", date: "", type: "General", status: "Active", image: "" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    setSaving(true);
    try {
      const result = modal === "add" ? await add(form) : await update({ ...form, id: modal.id });
      if (result?.ok) setModal(null);
      else alert(result?.error || "The change could not be saved.");
    } finally { setSaving(false); }
  };

  return (
    <div>
      <SHead title="Announcements" sub={`${items.length} total`} onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "title", label: "Title" }, { key: "body", label: "Body", clip: true }, { key: "date", label: "Date" }, { key: "type", label: "Type" }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "New Announcement" : "Edit Announcement"} onClose={() => setModal(null)}>
          <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Title" /></Field>
          <Field label="Body"><Textarea value={form.body} onChange={f("body")} rows={4} placeholder="Content…" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")} /></Field></div>
            <div className="flex-1"><Field label="Type"><Sel value={form.type} onChange={f("type")} options={["General", "Worship", "Prayer", "Admin", "Event"]} /></Field></div>
          </div>
          <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Active", "Archived"]} /></Field>
          <FileUpload
            token={token}
            accept="image/*"
            label="Announcement Image"
            hint="JPEG, PNG or WebP · max 5 MB"
            currentUrl={form.image}
            onUpload={({ url }) => setForm(p => ({ ...p, image: url }))}
            onRemove={() => setForm(p => ({ ...p, image: '' }))}
          />
          <MFooter onClose={() => setModal(null)} onSave={save} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

// ── Events ─────────────────────────────────────────────────────────────────
function EventsSection({ role, token }) {
  const { items, add, update, remove } = useEvents();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title: "", date: "", time: "", venue: "", description: "", image: "", status: "Upcoming", category: "Worship Services", featured: false, contactNumber: "", mapsQuery: "" };
  const [form, setForm] = useState(blank);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));
  const save = () => saveAndClose({ modal, form, add, update, setModal });

  return (
    <div>
      <SHead title="Events" sub={`${items.length} events`} onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "title", label: "Title", clip: true }, { key: "date", label: "Date" }, { key: "time", label: "Time" }, { key: "venue", label: "Venue" }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "Create Event" : "Edit Event"} onClose={() => setModal(null)}>
          <Field label="Event Title"><Input value={form.title} onChange={f("title")} placeholder="Event name" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")} /></Field></div>
            <div className="flex-1"><Field label="Time"><Input type="time" value={form.time} onChange={f("time")} /></Field></div>
          </div>
          <Field label="Venue"><Input value={form.venue} onChange={f("venue")} placeholder="Location / Hall" /></Field>
          <Field label="Contact Number (optional)">
            <Input type="tel" value={form.contactNumber} onChange={f("contactNumber")} placeholder="e.g. +260 977 123 456" />
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>If set, a "Call" button appears on the event card.</p>
          </Field>
          <Field label="Map Location (optional)">
            <Input value={form.mapsQuery} onChange={f("mapsQuery")} placeholder="e.g. Mulungushi University, Kabwe" />
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Leave blank to use Venue. Be specific for best map results.</p>
          </Field>
          <Field label="Description"><Textarea value={form.description} onChange={f("description")} rows={3} placeholder="Event details…" /></Field>
          <FileUpload
            token={token}
            accept="image/*"
            label="Event Image"
            hint="JPEG, PNG or WebP · max 5 MB · landscape works best"
            currentUrl={form.image}
            onUpload={({ url }) => setForm(p => ({ ...p, image: url }))}
            onRemove={() => setForm(p => ({ ...p, image: '' }))}
          />
          <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Upcoming", "Past"]} /></Field>
          <Field label="Category">
            <Sel value={form.category} onChange={f("category")} options={["Worship Services", "Bible Studies", "Community Service", "Retreats & Camps", "Prayer"]} />
          </Field>
          <Field label="Featured">
            <Sel value={form.featured ? "Yes" : "No"} onChange={(e) => setForm(p => ({ ...p, featured: e.target.value === "Yes" }))} options={["No", "Yes"]} />
          </Field>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ── Journals ───────────────────────────────────────────────────────────────
function JournalsSection({ role }) {
  const { items, add, update, remove } = useJournals();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title: "", author: "", category: "Academic", date: "", body: "", status: "Published" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()) || (x.author || "").toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    setSaving(true);
    try {
      const result = await saveAndClose({ modal, form, add, update, setModal });
      if (result?.ok) setForm(blank);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <SHead title="Journals & Articles" sub={`${items.length} entries`} onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "title", label: "Title", clip: true }, { key: "author", label: "Author" }, { key: "category", label: "Category" }, { key: "date", label: "Date" }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "Add Article" : "Edit Article"} onClose={() => setModal(null)}>
          <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Article title" /></Field>
          <Field label="Author"><Input value={form.author} onChange={f("author")} placeholder="Author name" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Category"><Sel value={form.category} onChange={f("category")} options={["Academic", "Spiritual Growth", "Personal Development", "Community"]} /></Field></div>
            <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")} /></Field></div>
          </div>
          <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft", "Published"]} /></Field>
          <Field label="Article Content"><Textarea value={form.body} onChange={f("body")} rows={8} placeholder="Write the full article here…" /></Field>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ── Media ──────────────────────────────────────────────────────────────────
function MediaSection({ role }) {
  const { items, add, update, remove } = useMedia();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title: "", type: "Sermon", presenter: "", date: "", status: "Published", url: "" };
  const [form, setForm] = useState(blank);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));
  const save = () => saveAndClose({ modal, form, add, update, setModal });

  return (
    <div>
      <SHead title="Media Library" sub={`${items.length} items`} onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "title", label: "Title", clip: true }, { key: "type", label: "Type" }, { key: "presenter", label: "Presenter" }, { key: "date", label: "Date" }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "Add Media" : "Edit Media"} onClose={() => setModal(null)}>
          <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Media title" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Type"><Sel value={form.type} onChange={f("type")} options={["Sermon", "Event Video", "Photo Gallery", "Music"]} /></Field></div>
            <div className="flex-1"><Field label="Presenter"><Input value={form.presenter} onChange={f("presenter")} placeholder="Name" /></Field></div>
          </div>
          <Field label="YouTube / URL"><Input value={form.url} onChange={f("url")} placeholder="https://…" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")} /></Field></div>
            <div className="flex-1"><Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft", "Published"]} /></Field></div>
          </div>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ── Heroes ─────────────────────────────────────────────────────────────────
function HeroesSection({ role, token }) {
  const { items, add, update, remove } = useHeroes();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { name: "", role: "", year: "2024-25", bio: "", image: "", status: "Featured" };
  const [form, setForm] = useState(blank);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));
  const save = () => saveAndClose({ modal, form, add, update, setModal });

  return (
    <div>
      <SHead title="Campus Heroes" sub={`${items.length} heroes`} onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "name", label: "Name" }, { key: "role", label: "Role", clip: true }, { key: "year", label: "Year" }, { key: "bio", label: "Bio", clip: true }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "Add Hero" : "Edit Hero"} onClose={() => setModal(null)}>
          <Field label="Full Name"><Input value={form.name} onChange={f("name")} placeholder="Full name" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Role"><Input value={form.role} onChange={f("role")} placeholder="e.g. Choir Director" /></Field></div>
            <div className="flex-1"><Field label="Year"><Input value={form.year} onChange={f("year")} placeholder="2024-25" /></Field></div>
          </div>
          <FileUpload
            token={token}
            accept="image/*"
            label="Hero Photo"
            hint="Portrait or square photo · max 5 MB"
            currentUrl={form.image}
            onUpload={({ url }) => setForm(p => ({ ...p, image: url }))}
            onRemove={() => setForm(p => ({ ...p, image: '' }))}
          />
          <Field label="Bio / Story"><Textarea value={form.bio} onChange={f("bio")} rows={4} placeholder="Their contribution…" /></Field>
          <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft", "Featured"]} /></Field>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ── Groups ─────────────────────────────────────────────────────────────────
function GroupsSection({ role }) {
  const { items, add, update, remove } = useGroups();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { name: "", leader: "", schedule: [], members: "", description: "", status: "Active" };
  const [form, setForm] = useState(blank);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));

  const addScheduleRow    = () => setForm(p => ({ ...p, schedule: [...(p.schedule || []), { day: 'Monday', time: '' }] }));
  const removeScheduleRow = (i) => setForm(p => ({ ...p, schedule: (p.schedule || []).filter((_, idx) => idx !== i) }));
  const updateScheduleRow = (i, field, value) => setForm(p => {
    const s = [...(p.schedule || [])]; s[i] = { ...s[i], [field]: value }; return { ...p, schedule: s };
  });

  const save = () => saveAndClose({ modal, form: { ...form, members: Number(form.members) || 0 }, add, update, setModal });

  return (
    <div>
      <SHead title="Ministry Groups" sub={`${items.length} groups`} onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "name", label: "Group" }, { key: "leader", label: "Leader" }, { key: "members", label: "Members" }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r, schedule: r.schedule || [] }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "Create Group" : "Edit Group"} onClose={() => setModal(null)}>
          <Field label="Group Name"><Input value={form.name} onChange={f("name")} placeholder="e.g. Prayer Band" /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Leader"><Input value={form.leader} onChange={f("leader")} placeholder="Leader name" /></Field></div>
            <div className="flex-1"><Field label="Members"><Input type="number" value={form.members} onChange={f("members")} placeholder="0" /></Field></div>
          </div>
          <Field label="Meeting Schedule">
            {(form.schedule || []).map((s, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <select value={s.day} onChange={e => updateScheduleRow(i, 'day', e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: '#E2E8F7' }}>
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
                </select>
                <input type="time" value={s.time} onChange={e => updateScheduleRow(i, 'time', e.target.value)} className="w-28 px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: '#E2E8F7' }} />
                <button type="button" onClick={() => removeScheduleRow(i)} className="p-1 text-red-500 hover:bg-red-50 rounded">✕</button>
              </div>
            ))}
            <button type="button" onClick={addScheduleRow} className="text-xs text-blue-600 underline mt-1">+ Add meeting time</button>
          </Field>
          <Field label="Description"><Textarea value={form.description} onChange={f("description")} rows={2} placeholder="Brief description…" /></Field>
          <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Active", "Inactive"]} /></Field>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ── Group Join Requests ────────────────────────────────────────────────────
function GroupRequestsSection() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    try {
      const result = await requestJson(`${API}/api/groups/requests/all`);
      setRequests(result?.ok ? (result.data || []) : []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;

  return (
    <div>
      <SHead title="Group Join Requests" sub={`${requests.length} requests`} />
      <Table
        cols={[
          { key: "name", label: "Name" }, { key: "email", label: "Email", clip: true },
          { key: "groupName", label: "Group" }, { key: "phone", label: "Phone", clip: true },
          { key: "submittedAt", label: "Date" }, { key: "status", label: "Status" },
        ]}
        rows={requests.map(r => ({ ...r, submittedAt: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—' }))}
      />
    </div>
  );
}

// ── Resources ──────────────────────────────────────────────────────────────
function ResourcesSection({ role, token }) {
  const { items, add, update, remove } = useResources();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title: "", description: "", category: "Planning", fileType: "PDF", status: "Published", fileUrl: "" };
  const [form, setForm] = useState(blank);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const filtered = items.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    const result = modal === "add" ? await add(form) : await update({ ...form, id: modal.id });
    if (result?.ok) { setModal(null); setForm(blank); }
    else alert(result?.error || "The change could not be saved.");
  };

  return (
    <div>
      <SHead title="Resources" sub="Downloadable files & guides" onAdd={() => { setForm(blank); setModal("add"); }} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "title", label: "Title", clip: true }, { key: "description", label: "Description", clip: true }, { key: "category", label: "Category" }, { key: "fileType", label: "Type" }, { key: "status", label: "Status" }]}
        rows={filtered} onEdit={(r) => { setForm({ ...r }); setModal(r); }} onDelete={role !== "editor" ? remove : null}
        extra={(r) => r.fileUrl ? (
          <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors" title="Download file">
            <Icon d={Icons.download} size={14} className="text-emerald-600" />
          </a>
        ) : null}
      />
      {modal && (
        <Modal title={modal === "add" ? "Add Resource" : "Edit Resource"} onClose={() => setModal(null)}>
          <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Resource title" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={f("description")} rows={2} placeholder="Brief description…" /></Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Category">
                <Sel value={form.category} onChange={f("category")} options={["Planning", "Study", "Spiritual", "Health", "General"]} />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="File Type">
                {/* Explicitly mapping uppercase options handled by CAT_COLORS / ResourceCard */}
                <Sel value={form.fileType} onChange={f("fileType")} options={["PDF", "DOCX", "XLSX", "DOC", "XLS", "Link"]} />
              </Field>
            </div>
          </div>
          <FileUpload
            token={token}
            accept=".pdf,.docx,.xlsx,.doc,.xls"
            label="Upload File"
            hint="PDF, Word or Excel · max 10 MB"
            currentUrl={form.fileUrl}
            onUpload={({ url }) => setForm(p => ({ ...p, fileUrl: url }))}
            onRemove={() => setForm(p => ({ ...p, fileUrl: '' }))}
          />
          <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft", "Published"]} /></Field>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ── Prayer Requests ────────────────────────────────────────────────────────
function PrayerSection() {
  const { items, update, remove, load } = usePrayers();
  const [viewing, setViewing]       = useState(null);
  const [replyText, setReplyText]   = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [search, setSearch]         = useState("");
  const filtered = items.filter((x) =>
    (x.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (x.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (x.request || "").toLowerCase().includes(search.toLowerCase())
  );
  const unread = items.filter((x) => x.status === "Unread").length;

  const openView  = (row) => { setViewing(row); setReplyText(""); };
  const closeView = () => { setViewing(null); setReplyText(""); };

  const sendReply = async () => {
    if (!viewing?.email || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const result = await requestJson(`${API}/api/prayers/${viewing.id}/reply`, { method: "POST", body: JSON.stringify({ message: replyText.trim() }) });
      if (!result.ok) { alert(result.error || "Could not send the reply."); return; }
      await load(); closeView();
    } finally { setSendingReply(false); }
  };

  return (
    <div>
      <SHead title="Prayer Requests" sub={`${items.length} requests · ${unread} unread`} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "name", label: "From" }, { key: "email", label: "Email", clip: true }, { key: "request", label: "Request", clip: true }, { key: "date", label: "Date" }, { key: "status", label: "Status" }]}
        rows={filtered.map((r) => ({ ...r, email: r.email || "—" }))}
        onDelete={remove}
        extra={(row) => (<>
          <button onClick={() => update({ ...row, status: row.status === "Unread" ? "Prayed" : "Unread" })} className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors" title="Toggle Prayed">
            <Icon d={Icons.check} size={14} className={row.status === "Prayed" ? "text-emerald-600" : "text-slate-300"} />
          </button>
          <button onClick={() => openView(row)} className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors" title="View">
            <Icon d={Icons.eye} size={14} className="text-blue-500" />
          </button>
        </>)}
      />
      {viewing && (
        <Modal title="Prayer Request" onClose={closeView}>
          <div className="rounded-xl p-4 mb-4" style={{ background: C.white, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>{viewing.name}</p>
                {viewing.email && <p className="text-xs" style={{ color: "#64748B" }}>{viewing.email}</p>}
              </div>
              <div className="text-right"><Badge text={viewing.status} /><p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{viewing.date}</p></div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>{viewing.request}</p>
          </div>
          {viewing.lastReply && (
            <div className="rounded-xl p-4 mb-4" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#059669" }}>LAST REPLY SENT</p>
              <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>{viewing.lastReply}</p>
            </div>
          )}
          {viewing.email ? (
            <Field label="Reply by email">
              <Textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={`Write an encouraging reply to ${viewing.name}…`} />
            </Field>
          ) : (
            <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>{viewing.name} didn't share an email address — please pray and follow up in person if possible.</p>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={closeView} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: C.border, color: "#64748B" }}>Close</button>
            <button onClick={() => { update({ ...viewing, status: "Prayed" }); closeView(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#059669" }}>
              <Icon d={Icons.check} size={14} className="text-white" /> Mark as Prayed
            </button>
            {viewing.email && (
              <button onClick={sendReply} disabled={sendingReply || !replyText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: sendingReply || !replyText.trim() ? "#94A3B8" : C.primary, cursor: sendingReply || !replyText.trim() ? "not-allowed" : "pointer" }}>
                <Icon d={Icons.reply} size={14} className="text-white" /> {sendingReply ? "Sending…" : "Send Reply"}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Contact Inbox ──────────────────────────────────────────────────────────
function ContactSection({ role }) {
  const { items, update, remove, load } = useContacts();
  const [viewing, setViewing]       = useState(null);
  const [replyText, setReplyText]   = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [search, setSearch]         = useState("");
  const filtered = items.filter((x) =>
    (x.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (x.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (x.subject || "").toLowerCase().includes(search.toLowerCase())
  );
  const unread = items.filter((x) => x.status === "Unread").length;

  const openMsg   = (row) => { update({ ...row, status: row.status === "Unread" ? "Read" : row.status }); setViewing(row); setReplyText(""); };
  const closeView = () => { setViewing(null); setReplyText(""); };

  const sendReply = async () => {
    if (!viewing?.email || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const result = await requestJson(`${API}/api/contacts/${viewing.id}/reply`, { method: "POST", body: JSON.stringify({ reply: replyText.trim() }) });
      if (!result.ok) { alert(result.error || "Could not send the reply."); return; }
      await load(); closeView();
    } finally { setSendingReply(false); }
  };

  return (
    <div>
      <SHead title="Contact Inbox" sub={`${items.length} messages · ${unread} unread`} search={search} onSearch={setSearch} />
      <Table
        cols={[{ key: "name", label: "From" }, { key: "email", label: "Email", clip: true }, { key: "subject", label: "Subject", clip: true }, { key: "date", label: "Date" }, { key: "status", label: "Status" }]}
        rows={filtered.map((r) => ({ ...r, email: r.email || "—" }))}
        onDelete={role !== "editor" ? remove : null}
        extra={(row) => (
          <button onClick={() => openMsg(row)} className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors" title="View">
            <Icon d={Icons.eye} size={14} className="text-blue-500" />
          </button>
        )}
      />
      {viewing && (
        <Modal title="Message" onClose={closeView} wide>
          <div className="rounded-xl p-4 mb-4" style={{ background: C.white, border: `1px solid ${C.border}` }}>
            <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b" style={{ borderColor: C.border }}>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "#94A3B8" }}>FROM</p>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>{viewing.name}</p>
                <p className="text-xs" style={{ color: "#64748B" }}>{viewing.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs mb-0.5" style={{ color: "#94A3B8" }}>DATE</p>
                <p className="text-sm" style={{ color: C.navy }}>{viewing.date}</p>
                <Badge text={viewing.status} />
              </div>
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>SUBJECT</p>
            <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>{viewing.subject}</p>
            <p className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>MESSAGE</p>
            <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>{viewing.message}</p>
          </div>
          {viewing.email ? (
            <Field label="Reply by email">
              <Textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={`Write a reply to ${viewing.name}…`} />
            </Field>
          ) : (
            <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>No email address was provided.</p>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={closeView} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: C.border, color: "#64748B" }}>Close</button>
            {viewing.email && (
              <button onClick={sendReply} disabled={sendingReply || !replyText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: sendingReply || !replyText.trim() ? "#94A3B8" : C.primary, cursor: sendingReply || !replyText.trim() ? "not-allowed" : "pointer" }}>
                <Icon d={Icons.reply} size={14} className="text-white" />
                {sendingReply ? "Sending…" : "Send Reply"}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── About Editor ───────────────────────────────────────────────────────────
function AboutSection() {
  const { about, setAbout } = useAbout();
  return <AboutEditor key={JSON.stringify(about || {})} about={about} setAbout={setAbout} />;
}

function AboutEditor({ about, setAbout }) {
  const [form, setForm] = useState({ mission: "", vision: "", history: "", address: "", email: "", phone: "", facebook: "", instagram: "", ...about });
  const [saved, setSaved] = useState(false);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const save = async () => {
    const result = await setAbout(form);
    if (!result?.ok) { alert(result?.error || "The about page could not be saved."); return; }
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SHead title="About Page Editor" sub="Mission, vision, contact info & social links" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5 bg-white" style={{ borderColor: C.border }}>
          <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: C.navy }}>CONTENT</p>
          <Field label="Mission Statement"><Textarea value={form.mission} onChange={f("mission")} rows={3} /></Field>
          <Field label="Vision"><Textarea value={form.vision} onChange={f("vision")} rows={3} /></Field>
          <Field label="History / Background"><Textarea value={form.history} onChange={f("history")} rows={4} /></Field>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border p-5 bg-white" style={{ borderColor: C.border }}>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: C.navy }}>CONTACT INFO</p>
            <Field label="Address"><Input value={form.address} onChange={f("address")} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={f("email")} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={f("phone")} /></Field>
          </div>
          <div className="rounded-2xl border p-5 bg-white" style={{ borderColor: C.border }}>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: C.navy }}>SOCIAL LINKS</p>
            <Field label="Facebook"><Input value={form.facebook} onChange={f("facebook")} placeholder="https://facebook.com/…" /></Field>
            <Field label="Instagram"><Input value={form.instagram} onChange={f("instagram")} placeholder="https://instagram.com/…" /></Field>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <button onClick={save} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: saved ? "#059669" : C.primary }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ── Users Management ───────────────────────────────────────────────────────
function UsersSection({ token }) {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState({ email: "", displayName: "", role: "editor" });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to load users");
      setUsers(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (token) fetchUsers(); }, [fetchUsers, token]);

  const handleInvite = async () => {
    if (!form.email || !form.role) return;
    const res = await fetch(`${API}/api/users/invite`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    if (res.ok) { setModal(null); fetchUsers(); alert('Invitation sent successfully.'); }
    else { const err = await res.json().catch(() => ({})); alert(err.error || "Invitation failed"); }
  };

  const handleRoleChange = async (uid, newRole) => {
    if (!confirm(`Change role to ${newRole}?`)) return;
    const res = await fetch(`${API}/api/users/${uid}/role`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ role: newRole }) });
    if (res.ok) { fetchUsers(); setModal(null); }
    else { const err = await res.json().catch(() => ({})); alert(err.error || "Failed to change role"); }
  };

  const handleStatus = async (uid, active) => {
    if (!confirm(`Are you sure you want to ${active ? "activate" : "deactivate"} this user?`)) return;
    const res = await fetch(`${API}/api/users/${uid}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ active }) });
    if (res.ok) fetchUsers();
    else { const err = await res.json().catch(() => ({})); alert(err.error || "Status update failed"); }
  };

  const handleDelete = async (uid) => {
    if (!confirm("Permanently delete this user?")) return;
    const res = await fetch(`${API}/api/users/${uid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchUsers();
    else { const err = await res.json().catch(() => ({})); alert(err.error || "Delete failed"); }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading users...</div>;

  return (
    <div>
      <SHead title="Manage Administrators" sub={`${users.length} admin users`} onAdd={() => { setForm({ email: "", displayName: "", role: "editor" }); setModal("invite"); }} />
      <Table
        cols={[{ key: "email", label: "Email" }, { key: "displayName", label: "Name" }, { key: "role", label: "Role" }, { key: "active", label: "Active" }, { key: "createdAt", label: "Added" }]}
        rows={users.map(u => ({ ...u, active: u.active ? "Active" : "Inactive", createdAt: u.createdAt?.slice(0,10) || "" }))}
        onDelete={(id) => handleDelete(id)}
        extra={(row) => (<>
          <button onClick={() => setModal({ uid: row.uid, currentRole: row.role })} className="p-1.5 rounded-lg hover:bg-blue-100" title="Change role">
            <Icon d={Icons.edit} size={14} className="text-blue-600" />
          </button>
          <button onClick={() => handleStatus(row.uid, row.active === "Active" ? false : true)} className={`p-1.5 rounded-lg hover:bg-amber-100 ${row.active === "Active" ? "text-red-500" : "text-emerald-600"}`} title={row.active === "Active" ? "Deactivate" : "Activate"}>
            <Icon d={row.active === "Active" ? Icons.close : Icons.check} size={14} />
          </button>
          <button onClick={async () => {
            if (!confirm(`Send password reset email to ${row.email}?`)) return;
            const res = await fetch(`${API}/api/users/${row.uid}/reset-password`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json().catch(() => ({}));
            if (res.ok) alert(`Reset email sent to ${row.email}`);
            else alert(data.error || 'Failed to send reset email');
          }} className="p-1.5 rounded-lg hover:bg-blue-100" title="Send password reset email">
            <Icon d={Icons.reset} size={14} className="text-blue-500" />
          </button>
        </>)}
      />
      {modal === "invite" && (
        <Modal title="Invite New Admin" onClose={() => setModal(null)}>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" /></Field>
          <Field label="Display Name"><Input value={form.displayName} onChange={(e) => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="John Doe" /></Field>
          <Field label="Role"><Sel value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} options={["editor", "admin", "super_admin", "secretary", "prayer_band_leader", "publicity_secretary"]} /></Field>
          <MFooter onClose={() => setModal(null)} onSave={handleInvite} />
        </Modal>
      )}
      {modal && modal.uid && (
        <Modal title="Change Role" onClose={() => setModal(null)}>
          <p className="text-sm mb-4">Select a new role for <strong>{users.find(u => u.uid === modal.uid)?.email}</strong></p>
          <Field label="New Role"><Sel value={modal.currentRole} onChange={(e) => setModal({ ...modal, currentRole: e.target.value })} options={["editor", "admin", "super_admin", "secretary", "prayer_band_leader", "publicity_secretary"]} /></Field>
          <MFooter onClose={() => setModal(null)} onSave={() => handleRoleChange(modal.uid, modal.currentRole)} />
        </Modal>
      )}
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────────────────────
function OverviewSection({ setSection, role }) {
  const { items: journals }      = useJournals();
  const { items: announcements } = useAnnouncements();
  const { items: media }         = useMedia();
  const { items: heroes }        = useHeroes();
  const { items: events }        = useEvents();
  const { items: groups }        = useGroups();
  const { items: resources }     = useResources();
  const { items: prayers }       = usePrayers();
  const { items: contacts }      = useContacts();

  const stats = [
    { label: "Journals",      value: journals.length,      icon: Icons.journals,  color: C.primary, key: "journals"      },
    { label: "Announcements", value: announcements.length, icon: Icons.announce,  color: C.purple,  key: "announcements" },
    { label: "Media Items",   value: media.length,         icon: Icons.media,     color: C.navy,    key: "media"         },
    { label: "Heroes",        value: heroes.length,        icon: Icons.heroes,    color: "#059669", key: "heroes"        },
    { label: "Events",        value: events.length,        icon: Icons.events,    color: "#F59E0B", key: "events"        },
    { label: "Groups",        value: groups.length,        icon: Icons.groups,    color: "#DC2626", key: "groups"        },
    { label: "Resources",     value: resources.length,     icon: Icons.resources, color: "#0891B2", key: "resources"     },
    { label: "Unread Messages", value: contacts.filter(x => x.status === "Unread").length + prayers.filter(x => x.status === "Unread").length, icon: Icons.contact, color: C.purple, key: "contact" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 24, fontWeight: 700 }}>Welcome back, Admin</h2>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Changes you make here are reflected instantly on all public pages.</p>
        </div>
        {role === "super_admin" && (
          <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border hover:bg-red-50 transition-colors" style={{ borderColor: "#FCA5A5", color: "#EF4444" }}>
            <Icon d={Icons.reset} size={13} /> Refresh Page
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.key} onClick={() => setSection(s.key)} className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group bg-white" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.color + "18" }}>
                <Icon d={s.icon} size={18} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>→</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: C.navy }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border p-4 bg-blue-50" style={{ borderColor: "#BFDBFE" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: C.primary }}>💡 Live backend sync</p>
        <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>All data is read from and written to your Express + Firestore backend in real time.</p>
      </div>
    </div>
  );
}

// ── Banners ────────────────────────────────────────────────────────────────
function BannersSection({ token }) {
  const { items, add, update, remove } = useBanners();
  const [modal, setModal] = useState(null);
  const blank = { caption: '', status: 'Active', order: items.length + 1, image: '' };
  const [form, setForm]   = useState(blank);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const save = () => saveAndClose({ modal, form, add, update, setModal });

  return (
    <div>
      <SHead title="Banner Slides" sub="Landing page hero carousel — group photos, church sessions, campus life"
        onAdd={() => { setForm({ ...blank, order: items.length + 1 }); setModal('add'); }} />
      <Table
        cols={[{ key: 'image', label: 'Image' }, { key: 'caption', label: 'Caption', clip: true }, { key: 'order', label: 'Order' }, { key: 'status', label: 'Status' }]}
        rows={items.map((r) => ({
          ...r,
          image: r.image ? <img src={r.image} alt="slide" className="w-16 h-10 object-cover rounded" /> : <span className="text-xs text-slate-400">No image</span>,
        }))}
        onEdit={(r) => { setForm({ ...r }); setModal(r); }}
        onDelete={remove}
      />
      {modal && (
        <Modal title={modal === 'add' ? 'Add Banner Slide' : 'Edit Banner Slide'} onClose={() => setModal(null)}>
          <FileUpload
            token={token}
            accept="image/*"
            label="Slide Image"
            hint="Landscape orientation works best · max 5 MB"
            currentUrl={form.image}
            onUpload={({ url }) => setForm(p => ({ ...p, image: url }))}
            onRemove={() => setForm(p => ({ ...p, image: '' }))}
          />
          <Field label="Caption (optional)">
            <Input value={form.caption} onChange={f('caption')} placeholder="e.g. Sabbath worship service — July 2025" />
          </Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Display Order"><Input type="number" value={form.order} onChange={f('order')} placeholder="1" /></Field></div>
            <div className="flex-1"><Field label="Status"><Sel value={form.status} onChange={f('status')} options={['Active', 'Inactive']} /></Field></div>
          </div>
          <MFooter onClose={() => setModal(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const { user, token, loading, login, logout } = useAdminAuth();
  const [section, setSection]   = useState("overview");
  const [open, setOpen]         = useState(true);
  const [isResetLink, setIsResetLink] = useState(false);

  const { items: prayers,  load: loadPrayers  } = usePrayers();
  const { items: contacts, load: loadContacts } = useContacts();

  useEffect(() => { if (user) { loadPrayers(); loadContacts(); } }, [user, loadPrayers, loadContacts]);
  useEffect(() => { const p = new URLSearchParams(window.location.search); setIsResetLink(p.get("mode") === "resetPassword"); }, []);

  const unreadPrayers  = prayers.filter(x => x.status === "Unread").length;
  const unreadContacts = contacts.filter(x => x.status === "Unread").length;
  const totalUnread    = unreadPrayers + unreadContacts;

  const nav = useMemo(() => {
    const isSecretary = user?.role === 'secretary';
    if (isSecretary) {
      return [
        { key: "student-registrations", label: "Student Registrations", icon: Icons.users },
        { key: "members-register",      label: "Members Register",      icon: Icons.journals },
        { key: "minutes",               label: "Meeting Minutes",       icon: Icons.about },
      ];
    }
    const base = [
      { key: "overview",      label: "Overview",       icon: Icons.dashboard },
      { key: "announcements", label: "Announcements",  icon: Icons.announce  },
      { key: "events",        label: "Events",         icon: Icons.events    },
      { key: "journals",      label: "Journals",       icon: Icons.journals  },
      { key: "media",         label: "Media",          icon: Icons.media     },
      { key: "heroes",        label: "Heroes",         icon: Icons.heroes    },
      { key: "banners",       label: "Banner Slides",  icon: Icons.media     },
      { key: "groups",        label: "Groups",         icon: Icons.groups, divider: true },
      ...(user?.role !== 'editor' ? [{ key: "group-requests", label: "Group Requests", icon: Icons.users, badge: 0 }] : []),
      { key: "resources",     label: "Resources",      icon: Icons.resources },
    ];
    if (user?.role !== 'editor') {
      base.push(
        { key: "prayer",  label: "Prayer Requests",      icon: Icons.prayer,  badge: unreadPrayers  },
        { key: "contact", label: "Contact Inbox",         icon: Icons.contact, badge: unreadContacts, divider: true },
        { key: "student-registrations", label: "Student Registrations", icon: Icons.users    },
        { key: "members-register",      label: "Members Register",      icon: Icons.journals },
        { key: "minutes",               label: "Meeting Minutes",       icon: Icons.about    },
      );
    }
    base.push({ key: "about", label: "About Editor", icon: Icons.about });
    if (user?.role === "super_admin") base.push({ key: "users", label: "Manage Users", icon: Icons.users, divider: true });
    return base;
  }, [user, unreadPrayers, unreadContacts]);

  const sectionMap = {
    overview:               <OverviewSection setSection={setSection} role={user?.role} />,
    announcements:          <AnnouncementsSection role={user?.role} token={token} />,
    events:                 <EventsSection role={user?.role} token={token} />,
    journals:               <JournalsSection role={user?.role} />,
    media:                  <MediaSection role={user?.role} />,
    heroes:                 <HeroesSection role={user?.role} token={token} />,
    banners:                <BannersSection token={token} />,
    groups:                 <GroupsSection role={user?.role} />,
    'group-requests':       <GroupRequestsSection />,
    resources:              <ResourcesSection role={user?.role} token={token} />,
    prayer:                 <PrayerSection />,
    contact:                <ContactSection role={user?.role} />,
    about:                  <AboutSection />,
    users:                  <UsersSection token={token} />,
    'student-registrations': <StudentRegistrationsSection token={token} />,
    'members-register':      <MemberRegistersSection token={token} />,
    'minutes':               <MinutesSection token={token} />,
  };

  const current = nav.find(n => n.key === section);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.navy }}>
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return isResetLink ? <ResetPasswordHandler /> : <LoginGate onLogin={login} />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: C.white, fontFamily: "'Noto Sans',sans-serif" }}>

      {/* Sidebar */}
      <aside className="flex-shrink-0 flex flex-col" style={{ width: open ? 224 : 60, background: C.navy, transition: "width 0.22s ease" }}>
        <div className="flex items-center gap-2.5 px-3.5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.primary }}>
            <span style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: 13, fontWeight: 700 }}>M</span>
          </div>
          {open && (
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: 13, fontWeight: 700 }}>MU PCM</div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 9, letterSpacing: "0.08em" }}>ADMIN PORTAL</div>
            </div>
          )}
          <button onClick={() => setOpen(p => !p)} className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0">
            <Icon d={open ? Icons.chevronL : Icons.chevronR} size={15} className="text-white/40" />
          </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
          {nav.map((item) => {
            const active = section === item.key;
            return (
              <div key={item.key}>
                {item.divider && <div className="my-1.5 mx-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }} />}
                <button onClick={() => setSection(item.key)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 transition-all relative text-left"
                  style={{ color: active ? "white" : "rgba(255,255,255,0.46)" }}>
                  {active && <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ background: C.primary }} />}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: active ? C.primary + "30" : "transparent" }}>
                    <Icon d={item.icon} size={15} />
                  </div>
                  {open && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center flex-shrink-0 ml-1" style={{ background: "#EF4444", color: "white", fontSize: 9, fontWeight: 700 }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {!open && item.badge > 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.primary }}>
              <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>A</span>
            </div>
            {open && (<>
              <div className="flex-1 min-w-0">
                <div style={{ color: "white", fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || "Administrator"}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{user?.role || "PCM Admin"}</div>
              </div>
              <button onClick={logout} className="p-1 rounded hover:bg-white/10 transition-colors" title="Sign out">
                <Icon d={Icons.logout} size={13} className="text-white/35" />
              </button>
            </>)}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b bg-white" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2">
            {current && <Icon d={current.icon} size={15} className="text-blue-600" />}
            <span style={{ fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 15, fontWeight: 700 }}>{current?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            {totalUnread > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#EF4444" }} />
                <span className="text-xs" style={{ color: "#EF4444" }}>{totalUnread} unread</span>
              </div>
            )}
            <span className="text-xs" style={{ color: "#94A3B8" }}>Leaders' Control Panel</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{sectionMap[section]}</div>
      </div>
    </div>
  );
}
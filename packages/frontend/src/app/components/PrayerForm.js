"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PrayerForm() {
  const [form, setForm] = useState({ name: "", email: "", request: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.request) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/prayers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: new Date().toISOString().split("T")[0] }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", request: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {status === "success" && (
        <div className="mb-4 p-4 rounded-xl text-sm font-medium" style={{ background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.2)" }}>
          🙏 Your prayer request has been received. We will be praying for you.
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 p-4 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>
          Something went wrong. Please try again.
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#0F2A4A" }}>YOUR NAME *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Full name" className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#E2E8F7", background: "#F5F7FF", color: "#0F2A4A" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#0F2A4A" }}>EMAIL (OPTIONAL)</label>
          <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com" type="email" className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#E2E8F7", background: "#F5F7FF", color: "#0F2A4A" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#0F2A4A" }}>PRAYER REQUEST *</label>
          <textarea value={form.request} onChange={e => setForm(p => ({ ...p, request: e.target.value }))}
            placeholder="Share what you'd like us to pray for..." rows={5}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
            style={{ borderColor: "#E2E8F7", background: "#F5F7FF", color: "#0F2A4A" }} />
        </div>
        <button onClick={submit} disabled={loading || !form.name || !form.request}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: loading ? "#94A3B8" : "#2E6DE7" }}>
          {loading ? "Submitting..." : "Submit Prayer Request 🙏"}
        </button>
      </div>
    </div>
  );
}

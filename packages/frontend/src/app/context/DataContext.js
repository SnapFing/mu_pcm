"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Sanitise raw backend error messages ──────────────────────────────────
// Prevents internal Firebase / OAuth2 error strings from reaching the UI.
// Returns a clean, user-facing message instead.
function sanitiseError(raw) {
  if (!raw || typeof raw !== "string") return "Something went wrong. Please try again.";

  const lower = raw.toLowerCase();

  // Firebase Admin / Google credential errors
  if (
    lower.includes("oauth2") ||
    lower.includes("credential") ||
    lower.includes("initializeapp") ||
    lower.includes("google api") ||
    lower.includes("service account") ||
    lower.includes("private key")
  ) {
    return "The server is temporarily unavailable. Please try again in a moment.";
  }

  // Network / fetch errors
  if (
    lower.includes("fetch failed") ||
    lower.includes("econnrefused") ||
    lower.includes("network") ||
    lower.includes("enotfound")
  ) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  // Generic Firebase errors — surface these as-is (they're already readable)
  if (lower.includes("auth/")) return raw;

  // Anything else — return as-is (it's a known application error)
  return raw;
}

// ── Auth headers ─────────────────────────────────────────────────────────
async function authHeaders() {
  const requestHeaders = { "Content-Type": "application/json" };
  try {
    if (getApps().length) {
      const user = getAuth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn("[authHeaders] token fetch failed:", err?.message || err);
  }
  return requestHeaders;
}

const emptyAbout = {
  mission: "", vision: "", history: "",
  address: "", email: "", phone: "",
  facebook: "", instagram: "",
};

const DataContext = createContext(null);

async function readJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ── requestJson ───────────────────────────────────────────────────────────
export async function requestJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...(await authHeaders()), ...(options.headers || {}) },
    });
    const data = await readJson(res);

    if (!res.ok) {
      const raw = data?.error || data?.message || `Request failed (${res.status})`;
      return {
        ok: false,
        status: res.status,
        error: sanitiseError(raw),
        data,
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    // Network-level failure (backend not running, DNS failure, etc.)
    return {
      ok: false,
      status: 0,
      error: sanitiseError(err.message || "Network error"),
      data: null,
    };
  }
}

function hasFirebaseUser() {
  return getApps().length && getAuth().currentUser;
}

// ── useCollectionState ────────────────────────────────────────────────────
function useCollectionState(key, { requiresAuthToLoad = false } = {}) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = useCallback(async () => {
    try {
      if (requiresAuthToLoad && !hasFirebaseUser()) {
        setItems([]);
        setError("");
        setLoading(false);
        return { ok: true, skipped: true };
      }

      setLoading(true);
      const result = await requestJson(`${API}/api/${key}`, { cache: "no-store" });
      if (!result.ok) {
        console.warn(`[${key}] fetch failed:`, result.error);
        // Store the sanitised error (never the raw Firebase string)
        setError(result.error);
        setItems([]);
        return result;
      }

      setError("");
      setItems(Array.isArray(result.data) ? result.data : []);
      return result;
    } catch (err) {
      const message = sanitiseError(err.message || "Unable to load items.");
      console.warn(`[${key}] fetch error:`, err);
      setError(message);
      setItems([]);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [key, requiresAuthToLoad]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (item) => {
    try {
      const result = await requestJson(`${API}/api/${key}`, {
        method: "POST",
        body: JSON.stringify(item),
      });
      if (!result.ok) return { ok: false, error: result.error || "Unable to add item." };
      const created = { ...item, id: result.data?.id };
      setItems((prev) => [created, ...prev]);
      await load();
      return { ok: true, item: created };
    } catch (err) {
      return { ok: false, error: sanitiseError(err.message) || "Unable to add item." };
    }
  }, [key, load]);

  const update = useCallback(async (item) => {
    try {
      const { id, ...payload } = item;
      if (!id) return { ok: false, error: "Missing item id." };
      const result = await requestJson(`${API}/api/${key}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!result.ok) return { ok: false, error: result.error || "Unable to update item." };
      const updated = { ...payload, id };
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...updated } : x)));
      await load();
      return { ok: true, item: updated };
    } catch (err) {
      return { ok: false, error: sanitiseError(err.message) || "Unable to update item." };
    }
  }, [key, load]);

  const remove = useCallback(async (id) => {
    try {
      if (!id) return { ok: false, error: "Missing item id." };
      const result = await requestJson(`${API}/api/${key}/${id}`, { method: "DELETE" });
      if (!result.ok) return { ok: false, error: result.error || "Unable to delete item." };
      setItems((prev) => prev.filter((x) => x.id !== id));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: sanitiseError(err.message) || "Unable to delete item." };
    }
  }, [key]);

  return { items, loading, error, load, add, update, remove };
}

// ── useAboutState ─────────────────────────────────────────────────────────
function useAboutState() {
  const [about, setAboutLocal] = useState(emptyAbout);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await requestJson(`${API}/api/about`, { cache: "no-store" });
      if (!result.ok) {
        setError(result.error);
        return result;
      }
      setAboutLocal({ ...emptyAbout, ...(result.data || {}) });
      return result;
    } catch (err) {
      const message = sanitiseError(err.message || "Unable to load about content.");
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setAbout = useCallback(async (data) => {
    try {
      const result = await requestJson(`${API}/api/about`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!result.ok) return { ok: false, error: result.error || "Unable to update about content." };
      setAboutLocal({ ...emptyAbout, ...data });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: sanitiseError(err.message) || "Unable to update about content." };
    }
  }, []);

  return { about, setAbout, loading, error, load };
}

// ── DataProvider ──────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const announcements = useCollectionState("announcements");
  const events        = useCollectionState("events");
  const journals      = useCollectionState("journals");
  const media         = useCollectionState("media");
  const heroes        = useCollectionState("heroes");
  const banners       = useCollectionState("banners");
  const groups        = useCollectionState("groups");
  const resources     = useCollectionState("resources");
  const prayers       = useCollectionState("prayers", { requiresAuthToLoad: true });
  const contacts      = useCollectionState("contacts", { requiresAuthToLoad: true });
  const aboutState    = useAboutState();

  const reset = () => window.location.reload();

  return (
    <DataContext.Provider value={{
      reset,
      announcements, events, journals, media,
      heroes, banners, groups, resources, prayers, contacts,
      about: aboutState.about,
      aboutState,
      setAbout: aboutState.setAbout,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────
export const useAnnouncements = () => useContext(DataContext).announcements;
export const useEvents        = () => useContext(DataContext).events;
export const useJournals      = () => useContext(DataContext).journals;
export const useMedia         = () => useContext(DataContext).media;
export const useHeroes        = () => useContext(DataContext).heroes;
export const useGroups        = () => useContext(DataContext).groups;
export const useResources     = () => useContext(DataContext).resources;
export const usePrayers       = () => useContext(DataContext).prayers;
export const useContacts      = () => useContext(DataContext).contacts;
export const useBanners       = () => useContext(DataContext).banners;

export function useAbout() {
  const ctx = useContext(DataContext);
  return { about: ctx.about, setAbout: ctx.setAbout, aboutState: ctx.aboutState };
}

export function useData() {
  return useContext(DataContext);
}
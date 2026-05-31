"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function authHeaders() {
  const requestHeaders = {
    "Content-Type": "application/json",
  };

  if (!getApps().length) return requestHeaders;

  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    requestHeaders.Authorization = `Bearer ${token}`;
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

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...(await authHeaders()), ...(options.headers || {}) },
  });
  const data = await readJson(res);

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: data?.error || data?.message || `Request failed with status ${res.status}`,
      data,
    };
  }

  return { ok: true, status: res.status, data };
}

function hasFirebaseUser() {
  return getApps().length && getAuth().currentUser;
}

function useCollectionState(key, { requiresAuthToLoad = false } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


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
        console.error(`[${key}] fetch failed:`, result.data || result.error);
        setError(result.error);
        setItems([]);
        return result;
      }

      setItems(Array.isArray(result.data) ? result.data : []);
      return result;
    } catch (err) {
      const message = err.message || "Unable to load items.";
      console.error(`[${key}] fetch error:`, err);
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
      if (!result.ok) {
        console.error(`[${key}] add failed:`, result.data || result.error);
        return { ok: false, error: result.error || "Unable to update item." };
      }
      const created = { ...item, id: result.data?.id };
      setItems((prev) => [created, ...prev]);
      await load();
      return { ok: true, item: created };
    } catch (err) {
      console.error(`[${key}] add error:`, err);
      return { ok: false, error: err.message || "Unable to add item." };
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
      if (!result.ok) {
        console.error(`[${key}] update failed:`, result.data || result.error);
        return { ok: false, error: result.error || "Unable to update item." };
      }

      const updated = { ...payload, id };
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...updated } : x)));
      await load();
      return { ok: true, item: updated };
    } catch (err) {
      console.error(`[${key}] update error:`, err);
      return { ok: false, error: err.message || "Unable to update item." };
    }

  }, [key, load]);

  const remove = useCallback(async (id) => {
    try {
      if (!id) return { ok: false, error: "Missing item id." };

      const result = await requestJson(`${API}/api/${key}/${id}`, { method: "DELETE" });
      if (!result.ok) {
        console.error(`[${key}] delete failed:`, result.data || result.error);
        return { ok: false, error: result.error || "Unable to delete item." };
      }

      setItems((prev) => prev.filter((x) => x.id !== id));
      return { ok: true };
    } catch (err) {
      console.error(`[${key}] remove error:`, err);
      return { ok: false, error: err.message || "Unable to delete item." };
    }
  }, [key]);

  return { items, loading, error, load, add, update, remove };
}


function useAboutState() {
  const [about, setAboutLocal] = useState(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await requestJson(`${API}/api/about`, { cache: "no-store" });
      if (!result.ok) {
        console.error("[about] fetch failed:", result.data || result.error);
        setError(result.error);
        return result;
      }

      setAboutLocal({ ...emptyAbout, ...(result.data || {}) });
      return result;
    } catch (err) {
      const message = err.message || "Unable to load about content.";
      console.error("[about] fetch error:", err);
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

      if (!result.ok) {
        console.error("[about] update failed:", result.data || result.error);
        return { ok: false, error: result.error || "Unable to update about content." };
      }

      setAboutLocal({ ...emptyAbout, ...data });
      return { ok: true };
    } catch (err) {
      console.error("[about] update error:", err);
      return { ok: false, error: err.message || "Unable to update about content." };
    }
  }, []);

  return { about, setAbout, loading, error, load };
}

export function DataProvider({ children }) {
  const announcements = useCollectionState("announcements");
  const events        = useCollectionState("events");
  const journals      = useCollectionState("journals");
  const media         = useCollectionState("media");
  const heroes        = useCollectionState("heroes");
  const groups        = useCollectionState("groups");
  const resources     = useCollectionState("resources");
  const prayers       = useCollectionState("prayers", { requiresAuthToLoad: true });
  const contacts      = useCollectionState("contacts", { requiresAuthToLoad: true });
  const aboutState    = useAboutState();

  const state = {
    announcements: announcements.items,
    events:        events.items,
    journals:      journals.items,
    media:         media.items,
    heroes:        heroes.items,
    groups:        groups.items,
    resources:     resources.items,
    prayers:       prayers.items,
    contacts:      contacts.items,
    about:         aboutState.about,
  };

  const reset = () => window.location.reload();

  return (
    <DataContext.Provider value={{
      state, reset,
      announcements, events, journals, media,
      heroes, groups, resources, prayers, contacts,
      about: aboutState.about,
      aboutState,
      setAbout: aboutState.setAbout,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useAnnouncements = () => useContext(DataContext).announcements;
export const useEvents        = () => useContext(DataContext).events;
export const useJournals      = () => useContext(DataContext).journals;
export const useMedia         = () => useContext(DataContext).media;
export const useHeroes        = () => useContext(DataContext).heroes;
export const useGroups        = () => useContext(DataContext).groups;
export const useResources     = () => useContext(DataContext).resources;
export const usePrayers       = () => useContext(DataContext).prayers;
export const useContacts      = () => useContext(DataContext).contacts;

export function useAbout() {
  const ctx = useContext(DataContext);
  return { about: ctx.about, setAbout: ctx.setAbout, aboutState: ctx.aboutState };
}

export function useData() {
  return useContext(DataContext);
}

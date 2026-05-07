"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "mupcm_admin_2026";

const headers = (isWrite = false) => ({
  "Content-Type": "application/json",
  "x-admin-token": ADMIN_TOKEN,
});

const DataContext = createContext(null);

function useCollectionState(key) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/${key}`, { headers: headers() });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`[${key}] fetch error:`, err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (item) => {
    try {
      const res = await fetch(`${API}/api/${key}`, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(`[${key}] add failed:`, data);
        return { ok: false, error: data?.error || "Unable to add item." };
      }

      const created = { ...item, id: data.id };
      setItems((prev) => [created, ...prev]);
      load();
      return { ok: true, item: created };
    } catch (err) {
      console.error(`[${key}] add error:`, err);
      return { ok: false, error: err.message || "Unable to add item." };
    }
  }, [key, load]);

  const update = useCallback(async (item) => {
    try {
      const { id, ...payload } = item;
      const res = await fetch(`${API}/api/${key}/${id}`, {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error(`[${key}] update failed:`, data);
        return { ok: false, error: data?.error || "Unable to update item." };
      }

      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...payload, id } : x)));
      load();
      return { ok: true, item: { ...payload, id } };
    } catch (err) {
      console.error(`[${key}] update error:`, err);
      return { ok: false, error: err.message || "Unable to update item." };
    }
  }, [key, load]);

  const remove = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/api/${key}/${id}`, {
        method: "DELETE",
        headers: headers(true),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error(`[${key}] remove failed:`, data);
        return { ok: false, error: data?.error || "Unable to delete item." };
      }

      setItems((prev) => prev.filter((x) => x.id !== id));
      return { ok: true };
    } catch (err) {
      console.error(`[${key}] remove error:`, err);
      return { ok: false, error: err.message || "Unable to delete item." };
    }
  }, [key]);

  return { items, loading, add, update, remove };
}

function useAboutState() {
  const [about, setAboutLocal] = useState({
    mission: "", vision: "", history: "",
    address: "", email: "", phone: "",
    facebook: "", instagram: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/about`, { headers: headers() })
      .then((r) => r.json())
      .then((data) => setAboutLocal(data))
      .catch((err) => console.error("[about] fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const setAbout = useCallback(async (data) => {
    try {
      const res = await fetch(`${API}/api/about`, {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("[about] update failed:", errorData);
        return { ok: false, error: errorData?.error || "Unable to update about content." };
      }

      setAboutLocal(data);
      return { ok: true };
    } catch (err) {
      console.error("[about] update error:", err);
      return { ok: false, error: err.message || "Unable to update about content." };
    }
  }, []);

  return { about, setAbout, loading };
}

export function DataProvider({ children }) {
  const announcements = useCollectionState("announcements");
  const events        = useCollectionState("events");
  const journals      = useCollectionState("journals");
  const media         = useCollectionState("media");
  const heroes        = useCollectionState("heroes");
  const groups        = useCollectionState("groups");
  const resources     = useCollectionState("resources");
  const prayers       = useCollectionState("prayers");
  const contacts      = useCollectionState("contacts");
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
  return { about: ctx.about, setAbout: ctx.setAbout };
}

export function useData() {
  return useContext(DataContext);
}

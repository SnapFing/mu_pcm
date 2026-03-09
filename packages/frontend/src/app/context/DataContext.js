"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";

const headers = (isWrite = false) => ({
  "Content-Type": "application/json",
  ...(isWrite && ADMIN_TOKEN ? { "x-admin-token": ADMIN_TOKEN } : {}),
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC COLLECTION HOOK FACTORY
// Creates { items, loading, add, update, remove } for any collection
// ─────────────────────────────────────────────────────────────────────────────
function useCollectionState(key) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all
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

  // Add
  const add = useCallback(async (item) => {
    try {
      const res = await fetch(`${API}/api/${key}`, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify(item),
      });
      const { id } = await res.json();
      setItems((prev) => [{ ...item, id }, ...prev]);
    } catch (err) {
      console.error(`[${key}] add error:`, err);
    }
  }, [key]);

  // Update
  const update = useCallback(async (item) => {
    try {
      await fetch(`${API}/api/${key}/${item.id}`, {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify(item),
      });
      setItems((prev) => prev.map((x) => (x.id === item.id ? item : x)));
    } catch (err) {
      console.error(`[${key}] update error:`, err);
    }
  }, [key]);

  // Remove
  const remove = useCallback(async (id) => {
    try {
      await fetch(`${API}/api/${key}/${id}`, {
        method: "DELETE",
        headers: headers(true),
      });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(`[${key}] remove error:`, err);
    }
  }, [key]);

  return { items, loading, add, update, remove };
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT STATE (single document, not a list)
// ─────────────────────────────────────────────────────────────────────────────
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
      await fetch(`${API}/api/about`, {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify(data),
      });
      setAboutLocal(data);
    } catch (err) {
      console.error("[about] update error:", err);
    }
  }, []);

  return { about, setAbout, loading };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
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

  // Build the flat `state` object so OverviewSection (which reads state.X.length) still works
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

  // reset() is a dev helper — with a real DB we just reload
  const reset = () => {
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{
      state,
      reset,
      announcements,
      events,
      journals,
      media,
      heroes,
      groups,
      resources,
      prayers,
      contacts,
      about: aboutState.about,
      setAbout: aboutState.setAbout,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS  — identical signatures to the old localStorage version
// ─────────────────────────────────────────────────────────────────────────────
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
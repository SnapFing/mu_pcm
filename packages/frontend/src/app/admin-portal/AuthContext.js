"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseAuth() {
  if (!firebaseConfig.apiKey) return null;
  if (!getApps().length) initializeApp(firebaseConfig);
  return getAuth();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured");
    
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await cred.user.getIdToken();
    
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    
    if (!res.ok) {
      await signOut(auth);
      throw new Error("User is not authorized for admin access");
    }
    
    const profile = await res.json();
    const userData = {
      uid: cred.user.uid,
      email: cred.user.email,
      role: profile.role,
      displayName: profile.displayName,
      active: profile.active,
    };
    
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
    setUser(null);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const idToken = await fbUser.getIdToken();
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error("Not admin");
        const profile = await res.json();
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          role: profile.role,
          displayName: profile.displayName,
          active: profile.active,
        });
      } catch {
        await signOut(auth);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
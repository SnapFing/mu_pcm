"use client";
import { useAbout } from "../context/DataContext";

export default function AboutPage() {
  const { about } = useAbout();

  return (
    <main>
      <h1>{about.mission}</h1>
      <p>{about.vision}</p>
      <p>{about.history}</p>
      <address>
        {about.address} · {about.email} · {about.phone}
      </address>
    </main>
  );
}
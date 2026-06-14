"use client";

import { useEffect, useRef } from "react";

export default function EventMap({ location }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !location) return;

    // Dynamically import leaflet (only on client)
    const L = require("leaflet");

    // Fix default marker icon paths (Next.js may break them)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current).setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Geocode the location string using Nominatim (free, no key required)
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 16);
          L.marker([lat, lon]).addTo(map);
        }
      })
      .catch((err) => console.error("Geocoding failed", err));

    return () => {
      map.remove();
    };
  }, [location]);

  return (
    <div
      ref={mapRef}
      style={{ height: "200px", width: "100%", borderRadius: "8px" }}
    />
  );
}

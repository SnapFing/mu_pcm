"use client";
import { usePrayers } from "../context/DataContext";
import PrayerForm from "../components/PrayerForm";

export default function PrayerPage() {
  const { add } = usePrayers();

  const handleSubmit = (formData) => {
    add({
      name:    formData.name || "Anonymous",
      email:   formData.email || "",
      request: formData.request,
      date:    new Date().toISOString().split("T")[0],
      status:  "Unread",   // admin will see this in the Prayer Requests inbox
    });
  };

  return (
    <main>
      <PrayerForm onSubmit={handleSubmit} />
    </main>
  );
}
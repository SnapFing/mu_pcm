"use client";
import PrayerForm from "./_components/PrayerForm";
import Navbar from "@/app/ui/Navbar";
import Footer from "@/app/ui/Footer";

export default function PrayerPage() {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
        <Navbar activePath="/prayer" />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
          <div className="mb-10 text-center">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#2E6DE7" }} className="uppercase mb-2">Prayer</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#0F2A4A" }}>
              Submit a Prayer Request
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#64748B" }}>
              Share your prayer request and our PCM community will intercede for you.
            </p>
          </div>
          <PrayerForm />
        </div>
        <Footer />
      </div>
    </>
  );
}

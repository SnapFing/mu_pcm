'use client';
import { useState } from 'react';

import { getAuth, onIdTokenChanged } from 'firebase/auth';
import Link from 'next/link';
//import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';
import {
  ShieldIcon, SparklesIcon, CheckCircle2Icon, ChevronRightIcon,
  CompassIcon, FeatherIcon, UtensilsIcon, MusicIcon,
  AwardIcon, BookOpenIcon, UsersIcon, PlayIcon,
  HeartPulseIcon, ArrowRightIcon, HelpCircleIcon,
  Volume2Icon, GraduationCapIcon,
} from '@/app/ui/Icon';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const auth = getAuth();
  if (!auth) return;
  const unsub = onIdTokenChanged(auth, (user) => {
    setIsLoggedIn(!!user);
  });
  return unsub;
}, []);

  useEffect(() => {
    fetch(`${API}/api/banners`)
      .then((r) => r.json())
      .then((data) => {
        const active = Array.isArray(data)
          ? data.filter((b) => b.status === 'Active' && b.image)
          : [];
        setSlides(active);
      })
      .catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const current = slides[index];

  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-screen">

      {/* Background — image slide or static fallback */}
      {current?.image ? (
        <div
          key={current.id}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(to bottom,
              rgba(15,42,74,0.45) 0%,
              rgba(15,42,74,0.75) 50%,
              rgba(15,42,74,0.97) 100%),
              url(${current.image})`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0F2A4A]">
          <div className="absolute inset-0 opacity-20 bg-radial-[circle_at_center,rgba(46,109,231,0.3)_0%,transparent_70%]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1e3b5c_0%,transparent_50%)]" />
        </div>
      )}

      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2E6DE7]/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-[120px]" />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20 text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <SparklesIcon className="w-4 h-4 text-[#2E6DE7]" />
          <span className="text-[11px] tracking-widest font-extrabold uppercase text-white/90">
            Mulungushi University Seventh‑day Adventist
          </span>
        </div>

        <h1 className="font-serif font-extrabold leading-tight text-white mb-6 tracking-tight text-4xl sm:text-5xl md:text-6xl max-w-3xl mx-auto">
          Public Campus Ministries
        </h1>

        {/* Slide caption */}
        {current?.caption && (
          <p className="text-white/80 text-sm font-medium mb-4 italic">
            {current.caption}
          </p>
        )}

        <p className="text-white/70 font-medium text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          "We are moved by the Holy Spirit, submitting ourselves to His bidding as co-workers with God in fulfilling the gospel commission on campus."
          <span className="block mt-2 text-xs italic text-white/50">— Preamble, MU SDA PCM Constitution</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-[#2E6DE7] hover:bg-[#2E6DE7]/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto bg-[#2E6DE7] hover:bg-[#2E6DE7]/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  Continue as Guest
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2"
                >
                  Sign Up as Student
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-white/40">
          Already a registered member?{' '}
          <Link href="/login" className="text-[#2E6DE7] font-semibold hover:underline">
            Log in safely
          </Link>
        </p>

        {/* Carousel controls */}
        {slides.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
            >
              <ChevronRightIcon className="w-4 h-4 text-white rotate-180" />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 22 : 7,
                    height: 7,
                    background: i === index ? '#2E6DE7' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
            >
              <ChevronRightIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function LandingPage() {
  // ── Membership checker states ─────────────────────────────────────
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [isEmployee, setIsEmployee] = useState(null);
  const [isAdventist, setIsAdventist] = useState(null);
  const [ageRange, setAgeRange] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Expanded card state for objectives
  const [hoveredObjective, setHoveredObjective] = useState(null);

  // Active band state tab
  const [activeBandTab, setActiveBandTab] = useState('witness');

  
  // Handle membership finder reset
  const handleResetFinder = () => {
    setIsEnrolled(null);
    setIsEmployee(null);
    setIsAdventist(null);
    setAgeRange('');
    setShowResult(false);
  };

  // Determine Category based on Article 7
  let calculatedCategory = '';
  let rightsDescription = '';
  let categoryBadgeColor = '';

  if (isAdventist === true) {
    if (isEnrolled === true || isEmployee === true) {
      calculatedCategory = 'Ordinary Member';
      rightsDescription = 'Article 7(1): You are fully eligible to hold any leadership office within the Executive Committee for up to 3 terms (1 term limit for Chairperson) and hold full voting rights in all Council deliberations.';
      categoryBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (ageRange === 'above35') {
      calculatedCategory = 'Honorary Member';
      rightsDescription = 'Article 7(2): You are eligible to serve as a consultative counselor or hold the auxiliary office of Patron or Matron, but do not possess direct voting rights on executive decisions.';
      categoryBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      calculatedCategory = 'Ordinary / Affiliated Member';
      rightsDescription = 'Article 7(1)(c): As an Adventist youth willing and committed, you are eligible to fully participate and hold leadership positions.';
      categoryBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  } else if (isAdventist === false) {
    calculatedCategory = 'Associate Member';
    rightsDescription = 'Article 7(3): Welcome! As an Associate, you compose persons desirous of the ministry’s spiritual ideals. Note that associates are not eligible to hold office or participate in binding decision-making.';
    categoryBadgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── Fonts ──────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&display=swap');
        *, body { font-family: 'Noto Sans', sans-serif; }
      `}</style>

      {/* <Navbar activePath="" /> /*}

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[#0F2A4A]">
          <div className="absolute inset-0 opacity-20 bg-radial-[circle_at_center,rgba(46,109,231,0.3)_0%,transparent_70%]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1e3b5c_0%,transparent_50%)]" />
        </div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2E6DE7]/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <SparklesIcon className="w-4 h-4 text-[#2E6DE7]" />
            <span className="text-[11px] tracking-widest font-extrabold uppercase text-white/90">
              Mulungushi University Seventh‑day Adventist
            </span>
          </div>

          <h1 className="font-serif font-extrabold leading-tight text-white mb-6 tracking-tight text-4xl sm:text-5xl md:text-6xl max-w-3xl mx-auto">
            Public Campus Ministries
          </h1>

          <p className="text-white/70 font-medium text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            "We are moved by the Holy Spirit, submitting ourselves to His bidding as co-workers with God in fulfilling the gospel commission on campus."
            <span className="block mt-2 text-xs italic text-white/50">— Preamble, MU SDA PCM Constitution</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-[#2E6DE7] hover:bg-[#2E6DE7]/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              Continue as Guest
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2"
            >
              Sign Up as Student
            </Link>
          </div>

          <p className="mt-8 text-xs text-white/40">
            Already a registered member?{' '}
            <Link href="/login" className="text-[#2E6DE7] font-semibold hover:underline">
              Log in safely
            </Link>
          </p>
        </div>
      </section>

      {/* ── Who We Are (Constitutional Identity) ─────────────────────── */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2E6DE7]/10 px-3 py-1 rounded-full text-xs font-bold text-[#2E6DE7] uppercase tracking-wider mb-4">
              <ShieldIcon className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] leading-tight mb-6">
              Who We Are & Our Master Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
              As established under <strong>Article 3</strong> of our Constitution, the Mulungushi University Seventh-day Adventist Campus Ministries is an affiliated branch of the <strong>Midlands East Zambia Conference of the SDA Church</strong>.
            </p>
            <div className="bg-[#F5F7FF] border-l-4 border-[#2E6DE7] p-5 rounded-r-2xl mb-6">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 block mb-1">
                Our Supreme Mission Statement
              </span>
              <p className="font-serif text-lg text-[#0F2A4A] font-semibold italic">
                "To spread the Advent message to all Mulungushi University students and to be the light of the campus and the community at large."
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Unified with the worldwide Seventh-day Adventist church body, our blueprint is anchored on scriptural integrity, Christian lifestyle, character growth, and deep fellowship on campus.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2E6DE7] to-[#7C3AED] rounded-2xl blur-lg opacity-20" />
            <div className="relative bg-gradient-to-br from-[#0F2A4A] to-[#1E3E6B] text-white rounded-2xl p-8 sm:p-10 shadow-xl overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-[#2E6DE7]/15 rounded-full blur-2xl" />
              <span className="text-[10px] text-white/50 tracking-widest font-bold uppercase block mb-2">Our Foundation</span>
              <h3 className="font-serif text-2xl font-bold mb-4">The Constitutional Supremacy Accord</h3>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex gap-3">
                  <CheckCircle2Icon className="w-5 h-5 text-[#2E6DE7] shrink-0" />
                  <span><strong>Article 1(1):</strong> Binding force over all SDA student ministries and actions on campus.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2Icon className="w-5 h-5 text-[#2E6DE7] shrink-0" />
                  <span><strong>Article 1(3):</strong> Harmoniously aligned with the mother Seventh-day Adventist Church Manual.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2Icon className="w-5 h-5 text-[#2E6DE7] shrink-0" />
                  <span><strong>Article 2:</strong> Defending the code against administrative and spiritual drifts under divine leadership.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Objectives Explorer (Article 5) ──────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-[#F5F7FF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs bg-[#7C3AED]/10 text-[#7C3AED] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full">
              Constitutional Pillars
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] mt-3">
              Core Strategic Objectives
            </h2>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Hover or interact with each core constitutional objective to explore how we materialize them practically in campus lifecycles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                num: '01',
                title: 'Revival & Character',
                desc: 'Avenues for deep knowledge of God’s power to nurture character, mental capacities, and physical wellbeing.',
                highlight: 'Weekly Prayer bands, physical exercise challenges, and mental health workshops.'
              },
              {
                num: '02',
                title: 'World Mission Uniqueness',
                desc: 'Fostering deep study of the unique end-time Adventist mission and personal duties therein.',
                highlight: 'Adventist youth ministry lessons, SASM events, and prophetic study books.'
              },
              {
                num: '03',
                title: 'Free Dialogue & Ideas',
                desc: 'Safeguarding a healthy environment to examine, discuss, and answer critical challenges facing youth today.',
                highlight: 'Friday interactive seminars and family life forums under Patron guidance.'
              },
              {
                num: '04',
                title: 'Salvation of Unreached',
                desc: 'Directing dynamic evangelical outreach and witnessing starting across our campus hostels.',
                highlight: 'Annual evangelism campaigns, health expos, and personal Bible study groups.'
              },
              {
                num: '05',
                title: 'Leadership Sync',
                desc: 'Ensuring consistent channel of contact between Conference ministries, mother local churches, and members.',
                highlight: 'Joint leadership meetings, elder visitation, and student letters of recommendation.'
              }
            ].map((obj, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredObjective(idx)}
                onMouseLeave={() => setHoveredObjective(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredObjective === idx
                    ? 'bg-white border-[#2E6DE7] shadow-xl translate-y-[-4px]'
                    : 'bg-white/80 border-[#E2E8F7] shadow-sm'
                }`}
              >
                <div className="font-serif text-3xl font-extrabold text-[#2E6DE7]/30 mb-4">{obj.num}</div>
                <h3 className="font-bold text-[#0F2A4A] text-base mb-2">{obj.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{obj.desc}</p>
                <div className={`text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 transition-opacity duration-300 ${
                  hoveredObjective === idx ? 'opacity-100' : 'opacity-60'
                }`}>
                  <span className="font-semibold block text-[#2E6DE7]">Practiced Via:</span>
                  {obj.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Membership Category Assessment (Article 7) ───────── */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto bg-[#F5F7FF] rounded-3xl border border-[#E2E8F7] p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E6DE7]/5 rounded-bl-full" />
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs bg-[#2E6DE7]/10 text-[#2E6DE7] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Interactive Assessment
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0F2A4A] mt-3">
              Verify Your Membership Profile
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Based on Article 7 of the MU SDA PCM Constitution, your campus status designates specific leadership eligibility and voting weight.
            </p>
          </div>

          {!showResult ? (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F7]">
                <label className="block text-sm font-bold text-[#0F2A4A] mb-3">
                  1. Are you baptized and practicing member of the Seventh-day Adventist faith?
                </label>
                <div className="flex gap-4">
                  <button onClick={() => setIsAdventist(true)} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${isAdventist === true ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                    Yes, I am Adventist
                  </button>
                  <button onClick={() => { setIsAdventist(false); setIsEnrolled(null); setIsEmployee(null); }} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${isAdventist === false ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                    No, other faith structure
                  </button>
                </div>
              </div>

              {isAdventist === true && (
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F7] animate-fade-in">
                  <label className="block text-sm font-bold text-[#0F2A4A] mb-3">
                    2. Are you currently enrolled as a student or active employee at Mulungushi University?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => { setIsEnrolled(true); setIsEmployee(false); }} className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all ${isEnrolled === true ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      Enrolled Student
                    </button>
                    <button onClick={() => { setIsEmployee(true); setIsEnrolled(false); }} className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all ${isEmployee === true ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      University Employee
                    </button>
                    <button onClick={() => { setIsEnrolled(false); setIsEmployee(false); }} className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all ${isEnrolled === false && isEmployee === false ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      Neither
                    </button>
                  </div>
                </div>
              )}

              {isAdventist === true && isEnrolled === false && isEmployee === false && (
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F7] animate-fade-in">
                  <label className="block text-sm font-bold text-[#0F2A4A] mb-3">
                    3. What is your age demographic?
                  </label>
                  <div className="flex gap-4">
                    <button onClick={() => setAgeRange('below35')} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${ageRange === 'below35' ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      Under 35 Years
                    </button>
                    <button onClick={() => setAgeRange('above35')} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${ageRange === 'above35' ? 'bg-[#2E6DE7] text-white border-[#2E6DE7]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      35 Years & Above
                    </button>
                  </div>
                </div>
              )}

              <button disabled={isAdventist === null} onClick={() => setShowResult(true)} className={`w-full py-4 rounded-xl font-bold transition-all text-sm shadow-md mt-4 cursor-pointer ${isAdventist === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#2E6DE7] text-white hover:bg-[#2E6DE7]/95'}`}>
                Determine My Category & Rights
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-100 text-center animate-fade-in">
              <AwardIcon className="w-12 h-12 text-[#2E6DE7] mx-auto mb-4" />
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Calculated Affiliation</p>
              <h3 className="text-2xl font-extrabold text-[#0F2A4A] mt-1 mb-4">{calculatedCategory}</h3>
              <div className={`p-4 rounded-xl border text-sm text-left mb-6 font-medium ${categoryBadgeColor}`}>
                {rightsDescription}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleResetFinder} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  Test Another Profile
                </button>
                <Link href="/register" className="flex-1 py-3 px-4 rounded-xl bg-[#2E6DE7] hover:bg-[#2E6DE7]/90 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center">
                  Create Member Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Departmental Committees & Bands (Article 9) ──────────────── */}
      <section className="py-24 px-6 bg-[#F5F7FF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs bg-[#059669]/10 text-[#059669] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full">
              Ministry Operations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] mt-3">
              Departmental Committees & Bands (Article 9)
            </h2>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              The ministries operate through beautifully structured committees and bands. Access guides and standards set within the constitution below.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-10">
            {[
              { id: 'witness', label: 'Witnessing Band', color: '#059669' },
              { id: 'prayer', label: 'Prayer Band', color: '#2E6DE7' },
              { id: 'health', label: 'Health, Diet & Catering', color: '#7C3AED' },
              { id: 'education', label: 'Education & Library Council', color: '#ea580c' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveBandTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${activeBandTab === tab.id ? 'bg-[#0F2A4A] text-white border-[#0F2A4A] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F7] shadow-sm min-h-[300px] flex flex-col justify-between">
            {activeBandTab === 'witness' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <CompassIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2A4A] text-lg">Preaching & Witnessing Band</h4>
                    <p className="text-xs text-gray-500">Established to share scripture and nurture disciples across the campus body</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed mb-6">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Core Witnessing Tasks:</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Hold structured, regular Bible study groups across hostels.</li>
                      <li>Distribute deep scriptural literature to student populace.</li>
                      <li>Empower members with standard methods of friendly witnessing.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Discipleship Care:</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Specialized care and training for newly baptized members.</li>
                      <li>Partnering with the Midlands East Zambia conference in public crusades.</li>
                      <li>Nourishing people through systematic study of the Spirit of Prophecy.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeBandTab === 'prayer' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <FeatherIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2A4A] text-lg">Prayer Band & Support System</h4>
                    <p className="text-xs text-gray-500">Interceding continuously for the physical and spiritual journey of all students</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed overflow-hidden">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Unceasing Prayer Chains:</p>
                    <p className="mb-4 text-xs">
                      Article 9(2)(a) mandates the Prayer Band Leader to organize prayer blocks, supporting physical and academic tests.
                    </p>
                    <span className="inline-flex items-center gap-1 bg-[#2E6DE7]/10 text-[#2E6DE7] px-2.5 py-1 rounded text-xs font-semibold">
                      Exam Intercessory Services Enabled
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Fastings and Semesters:</p>
                    <p className="text-xs">
                      At major transitions — namely at the immediate beginning of semesters and preceding final examination weeks — the Prayer Band organizes dedicated fasting prayer days to align collective focuses.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeBandTab === 'health' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <UtensilsIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2A4A] text-lg">Health Band, Catering & Diet Reforms</h4>
                    <p className="text-xs text-gray-500">Living and presenting the rich biblical health reform teachings to campus and state</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Diet & Menu Reforms (Caterers):</p>
                    <p className="text-xs mb-3">
                      Catering is strictly consistent with the **Health Reform Message according to Counsels on Diets and Foods**. We prepare plant-based nutrition during camp meetings, crusades and welcome weeks.
                    </p>
                    <span className="text-[#059669] font-bold text-xs inline-flex items-center gap-1">
                      🌱 Fully Vegetarian & Balanced Menu Standards
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Health Expos & Exercise:</p>
                    <p className="text-xs">
                      The Health Band conducts public recreation times, physical runs, and teaches pure, simple sanitary methods as outlined by the Spirit of Prophecy context.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeBandTab === 'education' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                    <BookOpenIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2A4A] text-lg">Education & Library Committee</h4>
                    <p className="text-xs text-gray-500">Supporting academic excellence and youth training resources</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Academic Wellness & Tutoring:</p>
                    <p className="text-xs leading-relaxed">
                      Article 9(7) empowers the Library leader to select competent student tutors for both Bible study lessons and core University academic courses. We monitor and advocate for members facing study difficulties.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Social Welfare Advocacy:</p>
                    <p className="text-xs leading-relaxed">
                      Our education wing coordinates closely with Mother Church welfare leaders to find financial resources or helper networks for students challenged with academic fees.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <MusicIcon className="w-4 h-4 text-[#2E6DE7]" />
                <strong>Note to Singing Groups:</strong> Music strictly conforms to decent dressing standards (1 Tim 2:9) and standard SDA songbooks.
              </span>
              <Link href="/dashboard" className="text-[#2E6DE7] hover:underline font-bold">
                Enter Member Portal to Join ➜
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meeting Times & Timelines ────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-extrabold text-[#0F2A4A]">
              Ministry Timetable & Gatherings
            </h2>
            <p className="text-gray-500 text-xs mt-2">
              Stay in fellowship. Here is our official constitutionally mandated calendar for weekly services and executive council forums.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                day: 'Wednesdays',
                title: 'Wednesday Vespers Meetings',
                desc: 'A sacred weekly mid-week service dedicated to prayer, song, and intermediate devotional messages.',
                time: '18:00 HRS - 19:15 HRS',
                type: 'Weekly Spiritual'
              },
              {
                day: 'Fridays',
                title: 'Friday Bible Studies & Seminars',
                desc: 'In-depth teachings, prophetic scrolls examination, and youth family-life seminars guided by elders.',
                time: '18:30 HRS - 19:45 HRS',
                type: 'Weekly In-Depth'
              },
              {
                day: 'Saturdays (Sabbaths)',
                title: 'Main Sabbath Worship Assembly',
                desc: 'From Sabbath School study guides, congregational singing to divine worship and afternoon outdoor missionary walks.',
                time: '08:00 HRS - 17:00 HRS',
                type: 'Weekly Full Sabbath'
              },
              {
                day: 'Weeks 3 & 10',
                title: 'Mandatory Council Assembly Sessions',
                desc: 'Article 12(2) assigns two legislative council sessions per semester to evaluate finance books, hear reports, and vote updates.',
                time: 'To Be Announced (During Vespers)',
                type: 'Semester Administrative'
              }
            ].map((ev, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row hover:bg-gray-50 border border-gray-100 p-6 rounded-2xl transition-all"
              >
                <div className="md:w-1/4 mb-2 md:mb-0">
                  <span className="text-xs bg-[#2E6DE7]/10 text-[#2E6DE7] font-semibold uppercase px-2.5 py-1 rounded">
                    {ev.day}
                  </span>
                </div>
                <div className="md:w-2/4">
                  <h4 className="font-serif text-lg font-bold text-[#0F2A4A]">{ev.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{ev.desc}</p>
                </div>
                <div className="md:w-1/4 text-left md:text-right mt-2 md:mt-0 flex flex-col justify-center">
                  <span className="text-sm font-bold text-gray-800 font-mono">{ev.time}</span>
                  <span className="text-[10px] text-gray-400 block">{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0F2A4A] to-[#1E3E6B] py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,#2e6de7_0%,transparent_60%)] opacity-35" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Ready to Deepen Your Spiritual Leadership?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg mb-12 leading-relaxed">
            Register your student record today to access the full member dashboard, submit prayer requests, propose constitutional amendments, and join localized study cohorts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="w-full sm:w-auto bg-[#2E6DE7] hover:bg-[#2E6DE7]/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer">
              Get Started (Sign Up)
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-xl border border-white/20 transition-all cursor-pointer font-serif">
              Continue As Guest
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
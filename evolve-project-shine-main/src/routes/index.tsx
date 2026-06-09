import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  GraduationCap, Users, Shield, ArrowRight, ArrowUpRight, CheckCircle2, BookOpen,
  Mail, Phone, MapPin, Send, Loader2, Menu, X, FileText, ClipboardList,
  Library, BarChart3, Lock, Calendar, Sparkles, Zap, Globe2, Activity, ShieldCheck, ChevronUp,
  BrainCircuit, Bot, Database, Smartphone, Wifi, Cloud, Download, Upload,
  Timer, Clock, Award, Medal, Star, Trophy, TrendingUp, Target, Eye,
  Search, Filter, LayoutDashboard, Share2, Github,
  School, BookMarked, MessageSquare, LifeBuoy,
  DollarSign, BadgeCheck, Verified, Monitor,
  Laptop, Rocket, Flag, Compass, PenTool,
  ArrowLeft, Play, ChevronRight, ChevronDown, Plus, Tablet, Headphones, Bell,
  Lightbulb, Cable, Workflow, GripVertical, Puzzle, ScrollText, Heart, KeyRound, Video,
  Infinity,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { submitContact } from "@/lib/contact.functions";
import { NexaPayCheckout } from "@/components/NexaPayCheckout";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "EduNex — Państwowa platforma egzaminacyjna" },
      { name: "description", content: "Oficjalna platforma egzaminacyjna dla polskich szkół. Egzaminy, sprawdziany i certyfikowane testy zgodne z podstawą programową MEN." },
      { property: "og:title", content: "EduNex — Państwowa platforma egzaminacyjna" },
      { property: "og:description", content: "Certyfikowana platforma egzaminacyjna dla szkół. Bezpieczeństwo, RODO, zgodność z MEN." },
    ],
  }),
});

function Landing() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("dark") }, []);
  useScrollReveal();
  return (
    <div className="landing-root min-h-screen selection:bg-cyan-400/30 selection:text-white overflow-x-clip antialiased">
      <Toaster theme="dark" />
      <CursorGlow />
      <SocialProof />
      <CookieBanner />
      <BackgroundFX />
      <NavBar />
      <Hero />
      <Stats />
      <Marquee />
      <FeaturesBento />
      <ForWhom />
      <Process />
      <Comparison />
      <Integrations />
      <Compliance />
      <Testimony />
      <Achievements />
      <Pricing />
      <FAQ />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
}

/* ──── Scroll reveal hook ──── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    requestAnimationFrame(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight + 300) {
          el.classList.add("revealed");
        }
      });
    });
    // also reveal everything after a short delay as fallback
    setTimeout(() => { els.forEach((el) => el.classList.add("revealed")) }, 800);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed") });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ──── Cursor glow ──── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("mousemove", f);
    return () => window.removeEventListener("mousemove", f);
  }, []);
  return <div ref={ref} className="cursor-glow hidden lg:block" />;
}

/* ──── Social proof toast ──── */
const SOCIAL_EVENTS = [
  { n: "Zofia Wiśniewska", a: "zakończyła egzamin", s: "92%", g: "emerald" },
  { n: "III LO w Gdyni", a: "dodała 15 pytań", s: "+bank", g: "cyan" },
  { n: "Jakub Kamiński", a: "otrzymał certyfikat", s: "matematyka", g: "amber" },
  { n: "V LO Kraków", a: "rozpoczęła sprawdzian", s: "28 uczniów", g: "violet" },
  { n: "Hanna Lewandowska", a: "poprawiła wynik", s: "+14 pkt", g: "emerald" },
  { n: "XIV LO Warszawa", a: "wygenerowała raport", s: "miesięczny", g: "blue" },
  { n: "ZSE Poznań", a: "zaimportowała uczniów", s: "200 z CSV", g: "cyan" },
  { n: "Maja Szymańska", a: "rozwiązała quiz", s: "100%", g: "emerald" },
  { n: "SP nr 5", a: "dodała klasę", s: "3B", g: "violet" },
];
function SocialProof() {
  const [items, setItems] = useState<{ n: string; a: string; s: string; g: string; id: number }[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const show = () => {
      const ev = SOCIAL_EVENTS[Math.floor(Math.random() * SOCIAL_EVENTS.length)];
      const id = ++idRef.current;
      setItems((prev) => [...prev.slice(-2), { ...ev, id }]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4000 + Math.random() * 2000);
    };
    show();
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => { timeout = setTimeout(() => { show(); schedule(); }, 4000 + Math.random() * 6000); };
    schedule();
    return () => clearTimeout(timeout);
  }, []);
  const colorMap: Record<string, string> = { emerald: "bg-emerald-400", cyan: "bg-cyan-400", amber: "bg-amber-400", violet: "bg-violet-400", blue: "bg-blue-400" };
  return (
    <div className="fixed bottom-24 left-6 z-50 flex flex-col gap-2 hidden lg:block">
      {items.map((ev, i) => (
        <div key={ev.id}
          className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl px-4 py-3 shadow-xl max-w-xs transition-all duration-500 animate-fadeIn"
          style={{ animation: 'slideInUp 0.4s ease-out' }}>
          <div className="flex items-center gap-3 text-xs">
            <span className={`w-2 h-2 rounded-full ${colorMap[ev.g] ?? "bg-white/40"} shrink-0`} style={{ boxShadow: `0 0 6px ${ev.g === 'emerald' ? '#34d399' : ev.g === 'cyan' ? '#22d3ee' : ev.g === 'amber' ? '#fbbf24' : ev.g === 'violet' ? '#a78bfa' : '#60a5fa'}` }}/>
            <div><span className="font-medium text-white">{ev.n}</span><span className="text-white/60"> {ev.a}</span> <span className="text-cyan-200 font-mono">{ev.s}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──── Cookie consent ──── */
function CookieBanner() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("cookies-ok")) setVisible(false);
  }, []);
  if (!visible) return null;
  const accept = () => { localStorage.setItem("cookies-ok", "1"); setVisible(false) };
  return (
    <div className="cookie-banner fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/60">Używamy plików cookie, aby zapewnić najlepsze doświadczenia na platformie. Korzystając ze strony, zgadzasz się na ich użycie.</p>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={accept} className="px-4 py-2 rounded-lg text-xs font-medium bg-gradient-to-br from-cyan-300 to-violet-300 text-black hover:shadow-[0_4px_16px_-4px_rgba(34,211,238,0.4)] transition">Akceptuję</button>
        </div>
      </div>
    </div>
  );
}

/* ──── Background FX ──── */
function BackgroundFX() {
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const shapes = el.querySelectorAll('.float-shape-bg');
    const f = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      shapes.forEach((s) => {
        const el = s as HTMLElement;
        const speed = parseFloat(el.dataset.speed || '1');
        el.style.transform = `translate(${x * 20 * speed}px, ${y * 20 * speed}px)`;
      });
    };
    window.addEventListener('mousemove', f);

    // Parallax on scroll
    const scrollF = () => {
      const sy = window.scrollY;
      const layers = el.querySelectorAll('.parallax-layer') as NodeListOf<HTMLElement>;
      layers.forEach((l) => {
        const sp = parseFloat(l.dataset.speed || '0.3');
        l.style.transform = `translateY(${sy * sp}px)`;
      });
    };
    window.addEventListener('scroll', scrollF, { passive: true });

    return () => {
      window.removeEventListener('mousemove', f);
      window.removeEventListener('scroll', scrollF);
    };
  }, []);

  // Speed lines
  const [speedLines] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      left: `${5 + Math.random() * 90}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
      height: `${40 + Math.random() * 80}px`,
      opacity: 0.15 + Math.random() * 0.2,
    }))
  );

  return (
    <div ref={bgRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-90" />
      <div className="absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      {/* Speed lines */}
      {speedLines.map((sl, i) => (
        <div key={i} className="speed-line" style={{
          left: sl.left,
          animation: `speedLine ${sl.animationDuration} linear ${sl.animationDelay} infinite`,
          height: sl.height,
          opacity: sl.opacity,
        }} />
      ))}
      {/* Parallax glow layers */}
      <div data-speed="0.15" className="parallax-layer float-shape-bg absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-violet-500/20 blur-[160px] float-shape" />
      <div data-speed="0.1" className="parallax-layer float-shape-bg absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-400/15 blur-[160px] float-shape" style={{ animationDelay: "1.5s" }} />
      <div data-speed="0.07" className="parallax-layer float-shape-bg absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-rose-500/15 blur-[160px] float-shape" style={{ animationDelay: "3s" }} />
      <div data-speed="0.04" className="parallax-layer float-shape-bg absolute top-1/2 right-1/4 w-[320px] h-[320px] rounded-full bg-amber-400/10 blur-[140px] float-shape" style={{ animationDelay: "0.7s" }} />
      <div data-speed="0.12" className="parallax-layer float-shape-bg absolute -bottom-20 left-[10%] w-[300px] h-[300px] rounded-full bg-emerald-400/8 blur-[120px] float-shape" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none select-none float-shape" style={{ animationDuration: '12s' }}>
        <svg viewBox="0 0 400 500" fill="white" className="w-full h-full">
          <path d="M200 20C180 20 160 35 155 55L150 70C145 80 140 85 130 90L120 95C110 100 105 110 105 120L105 135C105 145 110 150 120 150L125 150C130 150 135 145 140 140L145 135C150 130 155 130 160 135L165 140C170 145 175 145 180 140L185 135C190 130 195 130 200 135C205 130 210 130 215 135L220 140C225 145 230 145 235 140L240 135C245 130 250 130 255 135L260 140C265 145 270 150 275 150L280 150C290 150 295 145 295 135L295 120C295 110 290 100 280 95L270 90C260 85 255 80 250 70L245 55C240 35 220 20 200 20Z" />
          <path d="M170 160L175 155C180 150 185 150 190 155L195 160C200 165 200 175 195 180L190 185C185 190 180 190 175 185L170 180C165 175 165 165 170 160Z" />
          <path d="M210 160L215 155C220 150 225 150 230 155L235 160C240 165 240 175 235 180L230 185C225 190 220 190 215 185L210 180C205 175 205 165 210 160Z" />
          <path d="M185 200L190 195C195 190 205 190 210 195L215 200C220 205 220 215 215 220L210 225C205 230 195 230 190 225L185 220C180 215 180 205 185 200Z" />
          <path d="M160 230L165 225C170 220 180 220 185 225L190 230C195 235 195 245 190 250L185 255C180 260 170 260 165 255L160 250C155 245 155 235 160 230Z" />
          <path d="M220 230L225 225C230 220 240 220 245 225L250 230C255 235 255 245 250 250L245 255C240 260 230 260 225 255L220 250C215 245 215 235 220 230Z" />
          <path d="M175 265L180 260C185 255 195 255 200 260L205 265C210 270 210 280 205 285L200 290C195 295 185 295 180 290L175 285C170 280 170 270 175 265Z" />
          <path d="M195 295L200 290C205 290 210 295 210 300L210 310C210 315 205 320 200 320C195 320 190 315 190 310L190 300C190 295 195 295 195 295Z" />
          <path d="M120 310C120 310 130 330 150 340C160 345 170 345 180 340L185 335C190 330 195 330 200 335C205 330 210 330 215 335L220 340C230 345 240 345 250 340C270 330 280 310 280 310L275 315C270 325 260 335 250 340C240 345 230 348 220 348L215 350C210 352 205 352 200 350L185 350C180 352 175 352 170 350L160 348C145 345 135 340 125 330C120 320 120 310 120 310Z" />
          <path d="M140 350C140 350 155 365 175 375C185 380 195 382 200 380C205 382 215 380 225 375C245 365 260 350 260 350L255 355C245 368 230 378 215 385C210 388 205 388 200 385C195 388 190 388 185 385C170 378 155 368 145 355L140 350Z" />
          <path d="M175 40L165 50L170 55L180 45Z" />
          <path d="M200 35L195 45L200 50L205 45Z" />
          <path d="M225 40L220 50L230 55L235 45Z" />
          <rect x="160" y="30" width="80" height="8" rx="2" />
        </svg>
      </div>
    </div>
  );
}

/* ──── NAV ──── */
const NAV_ITEMS = [
  ["#funkcje","Funkcje"], ["#dla-kogo","Dla kogo"], ["#proces","Jak działa"],
  ["#cennik","Cennik"], ["#faq","FAQ"], ["#kontakt","Kontakt"],
];
function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const f = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement;
      setProgress(Math.min((window.scrollY / (h.scrollHeight - h.clientHeight)) * 100, 100));
    };
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    NAV_ITEMS.forEach(([id]) => { const el = document.getElementById(id.slice(1)); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/5">
        <div className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 rounded-2xl border border-white/10 px-3 sm:px-4 py-2.5 transition-all ${scrolled ? "bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]" : "bg-white/[0.03] backdrop-blur-md"}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <Mark />
            <div className="leading-tight">
              <div className="font-display text-[17px] font-semibold tracking-tight">EduNex</div>
              <div className="text-[9px] tracking-[0.22em] text-white/40 uppercase font-mono flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500/70" />
                OFICJALNA PLATFORMA
                <span className="inline-block w-2 h-2 rounded-full bg-red-500/70" />
              </div>
            </div>
          </Link>
          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm flex-wrap">
            {NAV_ITEMS.map(([h,l]) => {
              const isActive = activeSection === h.slice(1);
              return (
                <a key={h} href={h} className={`px-3 py-1.5 rounded-lg transition ${isActive ? "text-white bg-white/[0.06] nav-dot-active" : "text-white/70 hover:text-white hover:bg-white/5"}`}>{l}</a>
              );
            })}
          </nav>
          {/* Auth buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link to="/auth/student" className="px-3 py-2 text-sm rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition inline-flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4"/>Uczeń
            </Link>
            <Link to="/auth/teacher" className="group relative px-4 py-2 text-sm rounded-lg font-medium inline-flex items-center gap-1.5 text-black bg-gradient-to-br from-cyan-300 via-white to-violet-200 hover:shadow-[0_8px_32px_-8px_rgba(34,211,238,0.6)] transition-all">
              Zaloguj <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition"/>
            </Link>
            <Link to="/auth/admin" className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition" title="Administrator">
              <Shield className="w-4 h-4"/>
            </Link>
          </div>
          <button onClick={() => setOpen(!open)} className="sm:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Menu">
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
        {open && (
          <div className="lg:hidden mt-2 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-3 flex flex-col gap-1 text-sm mobile-nav-enter">
            {["funkcje","dla-kogo","proces","cennik","faq","kontakt"].map((id, i) => (
              <a key={id} onClick={()=>setOpen(false)} href={`#${id}`} className={`px-3 py-2.5 rounded-lg transition ${activeSection === id ? "bg-white/[0.06] text-white" : "hover:bg-white/5"}`}>{["Funkcje","Dla kogo","Jak działa","Cennik","FAQ","Kontakt"][i]}</a>
            ))}
            <div className="h-px bg-white/10 my-1"/>
            <Link onClick={()=>setOpen(false)} to="/auth/student" className="px-3 py-2.5 rounded-lg hover:bg-white/5">Uczeń</Link>
            <Link onClick={()=>setOpen(false)} to="/auth/teacher" className="px-3 py-2.5 rounded-lg hover:bg-white/5">Nauczyciel</Link>
            <Link onClick={()=>setOpen(false)} to="/auth/admin" className="px-3 py-2.5 rounded-lg hover:bg-white/5">Administrator</Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Mark() {
  return (
    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 p-[1.5px] shadow-[0_4px_16px_-4px_rgba(139,92,246,0.5)]">
      <div className="w-full h-full rounded-[10px] bg-[#07080d] grid place-items-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7l8-4 8 4-8 4-8-4z"/>
          <path d="M4 12l8 4 8-4"/>
          <path d="M4 17l8 4 8-4"/>
        </svg>
      </div>
    </div>
  );
}

/* ──── HERO ──── */
function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typing, setTyping] = useState(true);
  const headlines = [
    "Wyniki w czasie rzeczywistym.",
    "Bezpieczny monitoring AI.",
    "Pełna zgodność z MEN.",
    "Zero instalacji — działa w każdym Chrome.",
  ];
  useEffect(() => {
    const iv = setInterval(() => {
      setTyping(false);
      setTimeout(() => { setCurrentSlide((s) => (s + 1) % headlines.length); setTyping(true) }, 300);
    }, 4500);
    return () => clearInterval(iv);
  }, []);
  return (
    <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 page-enter">
      <div className="particle-grid"><div className="particle-grid-inner"/></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur text-xs cursor-default animate-fadeIn">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold tracking-wide text-[10px]">OFICJALNA</span>
            <span className="text-white/70">Platforma zatwierdzona · MEN · certyfikat RODO</span>
            <ShieldCheck className="w-3.5 h-3.5 text-red-400"/>
          </div>
          {/* Headline */}
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-tight text-white animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            Egzaminy bez tarcia.{" "}
            <span className="block text-white/90">
              <span className={`inline-block transition-all duration-300 ${typing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                {headlines[currentSlide]}
              </span>
              <span className="inline-block w-[3px] h-[1em] bg-white ml-1 animate-pulse align-middle" />
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/65 max-w-xl leading-relaxed animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            Certyfikowana platforma egzaminacyjna zgodna z podstawą programową MEN. Twórz sprawdziany, zarządzaj klasami i monitoruj wyniki na żywo — w jednym, bezpiecznym środowisku.
          </p>
          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-3 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            <Link to="/auth/teacher" className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-black bg-gradient-to-br from-cyan-300 via-white to-violet-200 hover:shadow-[0_16px_48px_-12px_rgba(34,211,238,0.7)] transition-all glow-ring">
              Zaloguj jako nauczyciel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition"/>
            </Link>
            <Link to="/auth/student" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur transition">
              <GraduationCap className="w-4 h-4"/>Wejdź PIN-em
            </Link>
          </div>
          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/50 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            {[
              ["Zgodność z MEN", ShieldCheck],
              ["Serwery w UE", Globe2],
              ["RODO certyfikat", Lock],
              ["99,98% uptime", Activity],
              ["Wsparcie 24/7", Zap],
              ["2 847+ egzaminów", FileText],
              ["Certyfikaty online", Award],
            ].map(([t, I]) => (
              <span key={t as string} className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors">
                <I className="w-3.5 h-3.5 text-red-400"/>{t}
              </span>
            ))}
          </div>
        </div>
        {/* Hero Card */}
        <div className="lg:col-span-5 relative animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  const [students, setStudents] = useState([
    { n: "Zofia Wiśniewska", p: 92, s: "ok" },
    { n: "Jakub Kamiński", p: 84, s: "ok" },
    { n: "Hanna Lewandowska", p: 71, s: "ok" },
    { n: "Antoni Dąbrowski", p: 58, s: "warn" },
    { n: "Maja Szymańska", p: 40, s: "ok" },
    { n: "Stanisław Woźniak", p: 23, s: "alert" },
  ]);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const iv = setInterval(() => {
      setStudents((prev) => prev.map((s) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newP = Math.max(0, Math.min(100, s.p + delta));
        const newS = newP >= 70 ? "ok" : newP >= 40 ? "warn" : "alert";
        return { ...s, p: newP, s: newS };
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const f = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-x", `${-y * 8}deg`);
      el.style.setProperty("--tilt-y", `${x * 8}deg`);
    };
    const reset = () => { el.style.setProperty("--tilt-x", "0deg"); el.style.setProperty("--tilt-y", "0deg"); };
    el.addEventListener("mousemove", f);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", f); el.removeEventListener("mouseleave", reset); };
  }, []);
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-cyan-500/30 via-violet-500/30 to-fuchsia-500/30 rounded-3xl blur-3xl"/>
      <div ref={cardRef} className="tilt-3d relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-1 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)]">
        <div className="rounded-[20px] bg-[#0a0d18]/80 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <span className="w-2 h-3 rounded-sm bg-white" />
                <span className="w-2 h-3 rounded-sm bg-red-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70"/>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70"/>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70"/>
              </div>
            </div>
            <div className="text-[10px] font-mono text-white/40">edunex.app/teacher · live</div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300 font-mono animate-pulse">REC</span>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">Klasa 3A · Matematyka</div>
                    <div className="font-display text-xl mt-0.5">Funkcje kwadratowe — kartkówka</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-white/40">Pozostało</div>
                <div className="font-mono text-cyan-300 text-lg tabular-nums">08:42</div>
              </div>
            </div>
            <div className="space-y-2.5">
              {students.map((u) => (
                <div key={u.n} className="flex items-center gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-white/5 grid place-items-center text-[10px] text-white/60 font-medium">{u.n[0]}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/80">{u.n}</span>
                      <span className="font-mono text-white/50">{u.p}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${u.s === "alert" ? "bg-rose-400" : u.s === "warn" ? "bg-amber-300" : "bg-gradient-to-r from-cyan-400 to-violet-400"}`} style={{ width: `${u.p}%` }}/>
                    </div>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full ${u.s === "alert" ? "bg-rose-400 animate-pulse" : u.s === "warn" ? "bg-amber-300" : "bg-emerald-400"}`}/>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-white/5">
              {[
                { l: "Średnia", v: "76%" },
                { l: "Aktywni", v: "28/30" },
                { l: "Alerty", v: 0 },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 transition-all hover:bg-white/[0.06] hover:border-cyan-400/20">
                  <div className="text-[9px] uppercase tracking-widest text-white/40">{s.l}</div>
                  <div className="font-display text-lg mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block absolute -bottom-4 -left-6 rounded-xl border border-white/10 bg-black/80 backdrop-blur px-3 py-2 text-xs shadow-xl float-badge">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
          <span className="font-mono">+12 odpowiedzi / sek</span>
        </div>
      </div>
      <div className="hidden sm:block absolute -top-4 -right-4 rounded-xl border border-white/10 bg-black/80 backdrop-blur px-3 py-2 text-xs shadow-xl float-badge" style={{ animationDelay: "1s" }}>
        <div className="flex items-center gap-2 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5"/>
          <span>Auto-ocena AI</span>
        </div>
      </div>
    </div>
  );
}

/* ──── STATS COUNTER ──── */
const STATS_TARGETS = { exams: 3752, teachers: 829, students: 36140, certificates: 18920, uptime: 99.98 };
function Stats() {
  const [counts, setCounts] = useState({ exams: 0, teachers: 0, students: 0, certificates: 0, uptime: 99.98 });
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => {
      setCounts((c) => {
        const next = {
          exams: Math.min(STATS_TARGETS.exams, c.exams + Math.ceil((STATS_TARGETS.exams - c.exams) / 12 + 1)),
          teachers: Math.min(STATS_TARGETS.teachers, c.teachers + Math.ceil((STATS_TARGETS.teachers - c.teachers) / 12 + 1)),
          students: Math.min(STATS_TARGETS.students, c.students + Math.ceil((STATS_TARGETS.students - c.students) / 15 + 1)),
          certificates: Math.min(STATS_TARGETS.certificates, c.certificates + Math.ceil((STATS_TARGETS.certificates - c.certificates) / 12 + 1)),
          uptime: 99.98,
        };
        if (next.exams >= STATS_TARGETS.exams && next.teachers >= STATS_TARGETS.teachers && next.students >= STATS_TARGETS.students && next.certificates >= STATS_TARGETS.certificates) {
          setTimeout(() => setDone(true), 500);
        }
        return next;
      });
    }, 20);
    return () => clearInterval(iv);
  }, [started]);
  return (
    <section ref={ref} className="reveal border-y border-white/5 py-12 sm:py-16 relative">
      {/* Live indicator */}
      <div className="absolute top-4 right-4 sm:right-8 flex items-center gap-2 text-[10px] text-white/30 font-mono">
        <span className="pulse-ring relative flex w-2 h-2"><span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75"/><span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400"/></span>
        {done ? "na żywo" : "aktualizuję..."}
      </div>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
        {[
          ["Przeprowadzonych egzaminów", counts.exams, "from-cyan-400 to-blue-400", STATS_TARGETS.exams],
          ["Aktywnych nauczycieli", counts.teachers, "from-violet-400 to-fuchsia-400", STATS_TARGETS.teachers],
          ["Uczniów w systemie", counts.students, "from-emerald-400 to-teal-400", STATS_TARGETS.students],
          ["Dostępność", `${counts.uptime}%`, "from-amber-400 to-orange-400", 99.98],
          ["Wystawionych certyfikatów", counts.certificates, "from-emerald-400 to-cyan-400", STATS_TARGETS.certificates],
        ].map(([l, v, g, t], i) => (
          <div key={l as string} className="text-center group" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r ${g} bg-clip-text text-transparent tabular-nums`}>
              {typeof v === "number" ? `${v.toLocaleString()}${v < (t as number) ? "+" : ""}` : v}
            </div>
            <div className="text-xs text-white/50 mt-1.5">{l}</div>
            <div className="mt-2 mx-auto w-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent group-hover:w-16 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──── MARQUEE ──── */
function Marquee() {
  const items = [
    "XIV LO im. Staszica · Warszawa · dyr. Agnieszka Potocka",
    "III LO im. Marynarki Wojennej RP · Gdynia · dyr. Wiesław Kosakowski",
    "V LO im. Augusta Witkowskiego · Kraków · dyr. Stanisław Pietras",
    "XIII LO · Szczecin · dyr. Bożena Pyra",
    "II LO im. Stefana Batorego · Warszawa · dyr. Małgorzata Lewandowska",
    "I LO im. Mikołaja Kopernika · Łódź · dyr. Aldona Danielewicz-Malec",
    "ZSE im. M. Skłodowskiej-Curie · Poznań · dyr. Tomasz Wróblewski",
    "VI LO im. Jana Kochanowskiego · Wrocław · dyr. Anna Jabłońska",
  ];
  return (
    <section className="reveal border-y border-white/5 py-6 overflow-hidden">
      <div className="text-center text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">Zaufały nam placówki w całej Polsce</div>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex shrink-0 gap-12 animate-[marquee_50s_linear_infinite] pr-12">
          {[...items, ...items].map((s, i) => (
            <span key={i} className="text-sm text-white/40 whitespace-nowrap font-display">{s}</span>
          ))}
        </div>
        <div className="flex shrink-0 gap-12 animate-[marquee_50s_linear_infinite] pr-12" aria-hidden>
          {[...items, ...items].map((s, i) => (
            <span key={i} className="text-sm text-white/40 whitespace-nowrap font-display">{s}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-100%); } }`}</style>
    </section>
  );
}

/* ──── FEATURES BENTO (24 cards, 6 categories, setki funkcji) ──── */
const FEATURE_CATEGORIES = [
  {
    id: "egzaminy",
    label: "Egzaminy & pytania",
    icon: FileText,
    gradient: "from-cyan-400 to-blue-500",
    items: [
      { title: "Tworzenie egzaminów", bullets: ["Pytania zamknięte, otwarte, kod, numeryczne, dopasowania, esej", "Szablony z banku pytań — 200+ gotowych zestawów", "Własne kategorie i tagi przedmiotowe", "Ustawienie czasu trwania i progu zaliczenia", "Losowanie kolejności pytań i odpowiedzi"] },
      { title: "Sprawdziany błyskawiczne", bullets: ["Kartkówki z 3-5 pytaniami w 2 minuty", "Wyniki widoczne natychmiast po zakończeniu", "Oznaczanie pytań do przeglądu", "Wiele typów w jednym sprawdzianie", "Punkty cząstkowe i suma na żywo"] },
      { title: "Bank pytań", bullets: ["200+ pytań gotowych do użycia", "Dodawanie własnych pytań z Worda / PDF / Excel", "Współdzielenie z innymi nauczycielami w szkole", "Filtry po przedmiocie, poziomie, typie", "Wersjonowanie i historia zmian"] },
      { title: "Generator AI", bullets: ["Generuj pytania z 3 słów — AI robi resztę", "Wczytaj zdjęcie z kartki — AI odczytuje i tworzy test", "Automatyczne dopasowanie poziomu trudności", "Tłumaczenie pytań na angielski / niemiecki", "Generowanie wariantów dla całej klasy"] },
      { title: "Certyfikacja", bullets: ["Certyfikat PDF po zaliczonym egzaminie", "Unikalny numer seryjny każdego certyfikatu", "Kod QR — zeskanuj i zweryfikuj online", "Strona weryfikacji — sprawdź autentyczność", "Pobierz i wydrukuj certyfikat z wynikami"] },
    ],
  },
  {
    id: "ai",
    label: "AI & automatyzacja",
    icon: BrainCircuit,
    gradient: "from-violet-400 to-fuchsia-500",
    items: [
      { title: "Auto-ocena odpowiedzi", bullets: ["Pytania zamknięte — ocena w 0,3 sekundy", "AI ocenia otwarte — rozumie kontekst odpowiedzi", "Korekta pisowni nie wpływa na ocenę merytoryki", "Propozycje punktów dla nauczyciela do zatwierdzenia", "Statystyki trudności pytań"] },
      { title: "Asystent AI nauczyciela", bullets: ["Rozmowa głosowa z asystentem przez mikrofon", "Podpowiedzi przy układaniu pytań", "Generowanie przykładów i zadań domowych", "Analiza błędów klasy — AI znajduje słabe punkty", "Personalizowane rekomendacje dla uczniów"] },
      { title: "Wykrywanie ściągania", bullets: ["AI analizuje ruchy myszy i klawiaturę", "Wykrywanie opuszczania okna egzaminu", "Analiza podobieństwa odpowiedzi między uczniami", "Alerty o podejrzanych zachowaniach w czasie rzeczywistym", "Raport końcowy z podejrzanymi zdarzeniami"] },
      { title: "Automatyczne raporty", bullets: ["Raport PDF po każdym egzaminie — gotowy do druku", "Rozkład wyników klasy na tle szkoły", "Eksport do dziennika jednym kliknięciem", "Historia postępów ucznia w czasie", "Powiadomienia e-mail dla rodziców"] },
      { title: "Inteligentne rekomendacje", bullets: ["AI sugeruje pytania na podstawie słabych punktów klasy", "Personalizowane zestawy powtórkowe dla uczniów", "Automatyczne dobieranie poziomu trudności", "Prognoza wyników przed egzaminem", "Rekomendacje materiałów z biblioteki Cyfrowy Zeszyt"] },
    ],
  },
  {
    id: "analityka",
    label: "Analityka & raporty",
    icon: BarChart3,
    gradient: "from-emerald-400 to-teal-500",
    items: [
      { title: "Panel nauczyciela", bullets: ["KPI na start: liczba egzaminów, średnia, alerty, aktywni", "Wykresy wyników klasy rozłożone w czasie", "Ranking uczniów z możliwością eksportu", "Filtry dat, przedmiotów i klas", "Tryb ciemny / jasny — w tym samym widoku"] },
      { title: "Monitoring na żywo", bullets: ["Postęp każdego ucznia w czasie rzeczywistym", "Aktywni / średnie ryzyko / wysokie ryzyko —统计", "Zdarzenia: blokady, wyjścia z fullscreena", "Możliwość zatrzymania egzaminu zdalnie", "Podgląd ekranu ucznia w FrameViewer"] },
      { title: "Raporty dla dyrekcji", bullets: ["Zbiorcze zestawienie wszystkich klas", "Wskaźniki zdawalności przedmiotów", "Porównanie nauczycieli i klas", "Eksport do PDF / Excel / CSV", "Dziennik audytu — kto, co, kiedy"] },
      { title: "Analiza pytań", bullets: ["Które pytania sprawiają najwięcej trudności", "Procent poprawnych odpowiedzi na pytanie", "Czas spędzony na każdym pytaniu", "Dystraktory — które odpowiedzi mylą uczniów", "Sugestie AI: zmień treść, próg, wagę"] },
      { title: "Prognozy i trend", bullets: ["Wykresy predykcyjne — który uczeń potrzebuje pomocy", "Porównanie semestrów i lat", "Mapa cieplna wyników dla całej szkoły", "Automatyczne alerty przy spadku wyników", "Raport dyrektorski z rekomendacjami AI"] },
    ],
  },
  {
    id: "zarzadzanie",
    label: "Zarządzanie klasą",
    icon: Users,
    gradient: "from-amber-400 to-orange-500",
    items: [
      { title: "Klasy i grupy", bullets: ["Tworzenie klas z nazwą i przedmiotem", "Import uczniów z CSV / dziennika elektronicznego", "Dodawanie uczniów pojedynczo lub zbiorczo", "Podział na grupy zaawansowania", "Archiwizacja klas po zakończeniu roku"] },
      { title: "Dziennik i oceny", bullets: ["Wystawianie ocen z egzaminów i sprawdzianów", "Średnia ważona z wagami ustawialnymi", "Średnia klasy — porównanie wizualne", "Eksport do Vulcan / Librus / Mobidziennik", "Wystawianie ocen opisowych"] },
      { title: "Plan lekcji", bullets: ["Tygodniowy harmonogram z drag & drop", "Zaznaczanie terminów egzaminów", "Powiadomienia dla uczniów o nadchodzących testach", "Synchronizacja z kalendarzem Google / Outlook", "Widok dla ucznia i nauczyciela"] },
      { title: "Komunikacja", bullets: ["Wiadomości wewnętrzne do uczniów i rodziców", "Wysyłka wyników na e-mail", "Ogłoszenia dla całej klasy / szkoły", "Szablon wiadomości dla powtarzalnych通知", "Historia korespondencji w profilu ucznia"] },
      { title: "Zastępstwa i dyżury", bullets: ["Planowanie zastępstw na Kalendarzu", "Automatyczne powiadomienie o zmianie", "Dostępność sal i pracowni", "Dyżury na przerwach z podglądem grafiku", "Eksport zastępstw do dziennika"] },
    ],
  },
  {
    id: "bezpieczenstwo",
    label: "Bezpieczeństwo & RODO",
    icon: Shield,
    gradient: "from-red-400 to-rose-500",
    items: [
      { title: "Ochrona danych", bullets: ["Szyfrowanie TLS 1.3 w tranzycie", "Szyfrowanie AES-256 w spoczynku", "Serwery tylko w Unii Europejskiej", "Regularne audyty bezpieczeństwa", "Backupy co 6 godzin"] },
      { title: "Zgodność z RODO", bullets: ["Umowa powierzenia danych dla każdej szkoły", "Pełen dziennik audytu wszystkich operacji", "Eksport danych ucznia na żądanie", "Usunięcie konta i danych w 48h", "Anonimizacja danych po zakończeniu roku"] },
      { title: "Tryb egzaminacyjny", bullets: ["Wymagany pełny ekran — brak dostępu do innych kart", "Blokada skrótów klawiszowych (Ctrl+C, Alt+Tab)", "Zapis co 5 sekund — brak utraty odpowiedzi", "Brak możliwości cofnięcia po zakończeniu", "Monitoring aktywności na żywo"] },
      { title: "Kontrola dostępu", bullets: ["3 role: administrator, nauczyciel, uczeń", "Dostęp nauczyciela tylko do własnych klas", "Logowanie dwuetapowe dla administratora", "Sesja wygasa po 15 min bezczynności", "Blokada po 5 nieudanych próbach logowania"] },
      { title: "Szyfrowane archiwum", bullets: ["Archiwum egzaminów z 5-letnią retencją", "Kopia zapasowa w 3 lokalizacjach", "Przywracanie danych jednym kliknięciem", "Szyfrowanie end-to-end dla wyników", "Eksport pełnego archiwum na żądanie dyrekcji"] },
    ],
  },
  {
    id: "integracje",
    label: "Integracje & mobilność",
    icon: Puzzle,
    gradient: "from-sky-400 to-indigo-500",
    items: [
      { title: "Integracja z dziennikami", bullets: ["Vulcan — bezpośrednia synchronizacja ocen", "Librus — import klas i eksport ocen", "Mobidziennik — dwukierunkowa wymiana danych", "Automatyczne mapowanie kont uczniów", "Wsparcie dla wszystkich wersji API"] },
      { title: "Działanie mobilne", bullets: ["Działa w każdym Chrome / Edge / Firefox", "Nie wymaga instalacji — otwórz i pracuj", "Działa na telefonie, tablecie i komputerze", "Tryb offline dla pytań — synchronizacja po włączeniu", "Responsywny interfejs — dostosowany do ekranu"] },
      { title: "Eksport i import", bullets: ["Import pytań z Word, PDF, Excel, TXT", "Export wyników do PDF, Excel, CSV", "Import uczniów z CSV z mapowaniem kolumn", "Export danych do archiwum ZIP", "API REST dla zaawansowanych integracji"] },
      { title: "Narzędzia dodatkowe", bullets: ["Voice Input — dyktowanie pytań głosem", "Kalkulator wbudowany w egzamin", "Notatnik dla odpowiedzi otwartych", "Czytnik ekranu WCAG 2.1 AA", "Skróty klawiszowe dla zaawansowanych"] },
    ],
  },
];

function FeaturesBento() {
  const [activeCategory, setActiveCategory] = useState(FEATURE_CATEGORIES[0].id);
  const [slideKey, setSlideKey] = useState(0);
  const active = FEATURE_CATEGORIES.find((c) => c.id === activeCategory) ?? FEATURE_CATEGORIES[0];
  const totalFeatures = FEATURE_CATEGORIES.reduce((acc, cat) => acc + cat.items.reduce((a, i) => a + i.bullets.length, 0), 0);
  useEffect(() => { setSlideKey((k) => k + 1) }, [activeCategory]);
  return (
    <section id="funkcje" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[10px] uppercase tracking-[0.22em] text-white/60 font-mono">00 · Funkcje</div>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">
            Ponad <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-200 bg-clip-text text-transparent">{totalFeatures}+</span> możliwości
          </h2>
          <p className="mt-4 text-white/60 text-base leading-relaxed">Wszystkie narzędzia, których potrzebuje nowoczesna szkoła — w jednym, zintegrowanym systemie.</p>
        </div>
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FEATURE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? `bg-gradient-to-r ${cat.gradient} text-black shadow-lg scale-105` : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]"}`}>
                <cat.icon className="w-4 h-4"/>{cat.label}
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />}
              </button>
            );
          })}
        </div>
        {/* Floating decorative shapes */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full border border-cyan-400/20 float-shape" />
          <div className="absolute -bottom-5 -right-5 w-14 h-14 rounded-full border border-violet-400/20 float-shape" style={{ animationDelay: '2s' }} />
        </div>
         {/* Bento grid */}
        <div key={slideKey} className="grid sm:grid-cols-2 gap-3 tab-slide-in">
          {active.items.map((item, i) => (
            <div key={item.title}>
              <FeatureCard item={item} gradient={active.gradient} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ item, gradient }: { item: typeof FEATURE_CATEGORIES[number]['items'][number]; gradient: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const f = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-x", `${-y * 4}deg`);
      el.style.setProperty("--tilt-y", `${x * 4}deg`);
    };
    const reset = () => { el.style.setProperty("--tilt-x", "0deg"); el.style.setProperty("--tilt-y", "0deg"); };
    el.addEventListener("mousemove", f);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", f); el.removeEventListener("mouseleave", reset); };
  }, []);
  const [shining, setShining] = useState(false);
  const shineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = shineRef.current;
    if (!el) return;
    const f = () => { setShining(true); setTimeout(() => setShining(false), 600); };
    el.addEventListener('mouseenter', f);
    return () => el.removeEventListener('mouseenter', f);
  }, []);
  return (
    <div ref={ref} className="tilt-3d group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/20 hover:shadow-[0_20px_60px_-20px_rgba(34,211,238,0.2)] relative overflow-hidden">
      {/* Shine effect */}
      <div ref={shineRef} className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${shining ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)' }} />
      <h3 className="font-display text-base font-semibold flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}/>
        {item.title}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {item.bullets.map((b) => (
          <li key={b} className="text-sm text-white/60 flex gap-2 feature-tooltip transition-all duration-300 group-hover:text-white/80" data-tip={b.length > 50 ? b.slice(0, 50) + "…" : b}>
            <span className="text-cyan-400/70 shrink-0 mt-0.5 group-hover:text-cyan-300 transition-colors">›</span>{b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──── FOR WHOM ──── */
function ForWhom() {
  const cards = [
    { icon: GraduationCap, accent: "from-cyan-400 to-blue-500", to: "/auth/student", title: "Uczeń", lines: ["Wejście PIN-em lub konto", "Czysty interfejs egzaminu", "Wynik widoczny od razu", "Certyfikat PDF + weryfikacja QR", "Tryb recenzji — oznaczaj do przeglądu"] },
    { icon: Users, accent: "from-violet-400 to-fuchsia-500", to: "/auth/teacher", title: "Nauczyciel", lines: ["Pytania ręcznie lub z AI w 3s", "Klasy, oceny, dziennik", "Monitoring na żywo 30 uczniów", "Eksport PDF, Excel i CSV", "Generator AI pytań ze zdjęć"] },
    { icon: Shield, accent: "from-amber-300 to-rose-400", to: "/auth/admin", title: "Dyrekcja", lines: ["Zatwierdzanie nauczycieli", "Raporty zbiorcze szkoły", "Audyt aktywności i logowań", "Zarządzanie kontami i licencjami", "Statystyki zdawalności przedmiotów"] },
    { icon: Heart, accent: "from-emerald-400 to-teal-500", to: "/auth/parent", title: "Rodzic", lines: ["Wgląd w wyniki dziecka", "Powiadomienia o sprawdzianach", "Raport postępów na e-mail", "Kontakt z nauczycielem", "Rejestracja + kod dostępu"] },
  ];
  return (
    <Section id="dla-kogo" eyebrow="02 · Role" title="Cztery perspektywy, jedna platforma">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <Link key={c.title} to={c.to} className={`reveal-scale reveal group relative rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_-20px_rgba(34,211,238,0.25)]`} style={{ animationDelay: `${i * 0.1}s`, transitionDelay: `${i * 0.1}s` }}>
              <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-3xl group-hover:opacity-40 transition-all duration-700 group-hover:scale-150`}/>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.accent} grid place-items-center mb-5 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:shadow-xl`}>
                <c.icon className="w-6 h-6 text-black transition-transform duration-500 group-hover:scale-110"/>
              </div>
              <h3 className="font-display text-2xl font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 group-hover:bg-clip-text transition-all duration-500">{c.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/65">
                {c.lines.map((l) => (
                  <li key={l} className="flex gap-2 group/li"><CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5 transition-all duration-200 group-hover/li:scale-125 group-hover/li:text-emerald-300"/>{l}</li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 group-hover:text-cyan-300 transition-all duration-300">
                Przejdź <ArrowUpRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"/>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 group-hover:ring-cyan-400/25 transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
    </Section>
  );
}

/* ──── PROCESS ──── */
function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { n: "01", icon: Users, t: "Załóż klasę", d: "Wpisz nazwę przedmiotu i listę uczniów. Import z CSV lub z dziennika Vulcan/Librus — 2 minuty." },
    { n: "02", icon: FileText, t: "Przygotuj pytania", d: "Wpisz ręcznie, wybierz z banku 300+ pytań, zaimportuj z Worda/PDF albo wygeneruj AI z 3 słów." },
    { n: "03", icon: KeyRound, t: "Wygeneruj PIN", d: "6-cyfrowy kod dla klasy. Uczeń wpisuje na dowolnym urządzeniu — bez logowania, bez konta, bez instalacji." },
    { n: "04", icon: Monitor, t: "Monitoruj na żywo", d: "Postęp każdego ucznia w czasie rzeczywistym. AI wykrywa podejrzane zachowania. Możesz zatrzymać egzamin zdalnie." },
    { n: "05", icon: Award, t: "Oceń i raportuj", d: "Zamknięte — auto-ocena w 0,3s. Otwarte — asysta AI. Eksport PDF/Excel/CSV do dziennika jednym kliknięciem." },
  ];
  useEffect(() => {
    const iv = setInterval(() => setActiveStep((s) => (s + 1) % steps.length), 4000);
    return () => clearInterval(iv);
  }, []);
  return (
    <Section id="proces" eyebrow="03 · Jak działa" title="Pięć kroków do gotowego egzaminu" sub="Od założenia klasy do gotowego raportu — w mniej niż 10 minut.">
      <div className="relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-violet-400 to-transparent hidden md:block" />
        <div className="space-y-6">
          {steps.map((s, i) => (
            <div key={s.n} className={`reveal ${i > 0 ? `reveal-delay-${i}` : ""} relative flex items-start gap-6 group`}>
              <div className={`shrink-0 w-12 h-12 rounded-xl grid place-items-center text-black font-display font-bold text-sm shadow-lg z-10 transition-all duration-500 ${activeStep === i ? "bg-gradient-to-br from-cyan-300 to-violet-400 shadow-cyan-400/40 scale-110" : "bg-gradient-to-br from-cyan-400 to-violet-500 shadow-cyan-500/20"} group-hover:scale-110`}>
                <s.icon className={`w-5 h-5 transition-all duration-500 ${activeStep === i ? "scale-110" : ""}`} />
              </div>
              <div className={`flex-1 rounded-2xl border backdrop-blur p-5 transition-all duration-500 ${activeStep === i ? "border-cyan-400/30 bg-cyan-400/[0.06] shadow-[0_8px_32px_-12px_rgba(34,211,238,0.15)]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-400/20"} hover:-translate-y-0.5`}>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-cyan-400/60">{s.n}</span>
                  <h3 className={`font-display text-lg font-semibold transition-colors ${activeStep === i ? "text-cyan-200" : "text-white"}`}>{s.t}</h3>
                  {activeStep === i && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 font-mono animate-pulse ml-auto">teraz</span>}
                </div>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">{s.d}</p>
                {i < steps.length - 1 && (
                  <div className={`hidden md:block absolute -bottom-6 left-[23px] w-[2px] transition-all duration-700 ${activeStep === i ? "h-8 bg-gradient-to-b from-cyan-300 to-violet-400" : "h-6 bg-gradient-to-b from-cyan-400/40 to-transparent"}`} />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setActiveStep(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === i ? "w-6 bg-cyan-400" : "bg-white/20"}`} />
          ))}
        </div>
        {/* Summary CTA */}
        <div className="reveal reveal-delay-5 mt-10 text-center">
          <Link to="/auth/teacher" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-black bg-gradient-to-br from-cyan-300 via-white to-violet-200 hover:shadow-[0_16px_48px_-12px_rgba(34,211,238,0.7)] transition-all group glow-ring">
            Wypróbuj teraz — 2 minuty <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <p className="mt-3 text-xs text-white/40">Plan Klasa jest za darmo. Karta kredytowa nie wymagana.</p>
        </div>
      </div>
    </Section>
  );
}

/* ──── COMPARISON ──── */
const COMPARISON_ROWS = [
  { label: "Czas przygotowania egzaminu", edunex: "2–5 minut", trad: "45–120 minut", score: 95 },
  { label: "Auto-ocena", edunex: "Natychmiast (AI)", trad: "Ręcznie, 2–5 dni", score: 98 },
  { label: "Monitoring uczniów", edunex: "Na żywo, AI", trad: "Brak", score: 100 },
  { label: "Wyniki dla uczniów", edunex: "Od razu po zakończeniu", trad: "Po tygodniu", score: 100 },
  { label: "Wykrywanie ściągania", edunex: "Automatyczne, AI", trad: "Ludzkie oko", score: 92 },
  { label: "Eksport do dziennika", edunex: "1 kliknięcie", trad: "Ręczne wpisywanie", score: 100 },
  { label: "Dostępność urządzeń", edunex: "Telefon / tablet / PC", trad: "Wydruk + długopis", score: 90 },
  { label: "Koszty", edunex: "Od 0 zł / klasa", trad: "Papier + druk + czas", score: 85 },
  { label: "Bezpieczeństwo danych", edunex: "Szyfrowanie + RODO", trad: "Szafa z kluczykiem", score: 95 },
  { label: "Wsparcie techniczne", edunex: "24/7 chat + telefon", trad: "Brak", score: 100 },
];
function Comparison() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Section eyebrow="04 · Porównanie" title={<>EduNex vs <span className="text-white/40">tradycyjne metody</span></>}>
      <div ref={ref} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-4 py-4 font-medium text-white/40 w-[30%]">Cecha</th>
                <th className="text-left px-4 py-4 font-semibold text-white w-[35%]"><span className="inline-flex items-center gap-1.5"><Mark />EduNex</span></th>
                <th className="text-left px-4 py-4 font-medium text-white/40 w-[35%]">Tradycyjnie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON_ROWS.map((row, i) => {
                const edunexScore = row.score;
                const tradScore = 100 - row.score;
                return (
                  <tr key={row.label} className={`group transition-colors ${i % 2 === 0 ? "hover:bg-white/[0.03]" : "bg-white/[0.01] hover:bg-white/[0.04]"}`}>
                    <td className="px-4 py-3.5 text-white/70 font-medium text-[13px]">{row.label}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-emerald-300 text-sm"><CheckCircle2 className="w-4 h-4 shrink-0"/>{row.edunex}</span>
                      {visible && (
                        <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden max-w-[120px]">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-1000 ease-out" style={{ width: `${edunexScore}%`, transitionDelay: `${i * 50}ms` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-white/40 text-sm">{row.trad}</span>
                      {visible && (
                        <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden max-w-[120px]">
                          <div className="h-full rounded-full bg-white/10 transition-all duration-1000 ease-out" style={{ width: `${tradScore}%`, transitionDelay: `${i * 50}ms` }} />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
        <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Średnio 85% oszczędności czasu</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="inline-flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 3× lepsze wyniki uczniów</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-violet-400" /> 100% zgodność z RODO</span>
      </div>
    </Section>
  );
}

/* ──── INTEGRATIONS ──── */
const INTEGRATION_TYPES: Record<string, string> = {
  Dziennik: "from-cyan-400 to-blue-500",
  LMS: "from-violet-400 to-fuchsia-500",
  Wideokonferencje: "from-emerald-400 to-teal-500",
  AI: "from-amber-400 to-orange-500",
  Realtime: "from-rose-400 to-pink-500",
  API: "from-sky-400 to-indigo-500",
  Import: "from-emerald-300 to-cyan-400",
  Eksport: "from-purple-400 to-pink-500",
};
const INTEGRATIONS = [
  { name: "Vulcan", type: "Dziennik", icon: Library },
  { name: "Librus", type: "Dziennik", icon: BookOpen },
  { name: "Mobidziennik", type: "Dziennik", icon: Smartphone },
  { name: "Google Classroom", type: "LMS", icon: GraduationCap },
  { name: "Microsoft Teams", type: "LMS", icon: Users },
  { name: "Zoom", type: "Wideokonferencje", icon: Video },
  { name: "OpenAI", type: "AI", icon: BrainCircuit },
  { name: "Gemini", type: "AI", icon: Sparkles },
  { name: "WebSocket", type: "Realtime", icon: Wifi },
  { name: "REST API", type: "API", icon: Cable },
  { name: "CSV / Excel", type: "Import", icon: Download },
  { name: "PDF", type: "Eksport", icon: Upload },
];
function Integrations() {
  const [filter, setFilter] = useState("");
  const types = Object.keys(INTEGRATION_TYPES);
  const filtered = INTEGRATIONS.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <Section eyebrow="05 · Integracje" title="Łączy się z tym, czego już używasz" sub="Native integracje z najpopularniejszymi systemami w polskiej edukacji.">
      {/* Search */}
      <div className="relative max-w-xs mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Szukaj integracji..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition" />
        {filter && <button onClick={() => setFilter("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition">✕</button>}
      </div>
      {/* Type filter chips */}
      {!filter && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {types.map((t) => (
            <span key={t} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-gradient-to-r ${INTEGRATION_TYPES[t]} bg-clip-text text-transparent bg-white/[0.04] border border-white/10`}>
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {filtered.map((i) => {
          const grad = INTEGRATION_TYPES[i.type] ?? "from-white/20 to-white/5";
          const Icon = i.icon;
          return (
            <div key={i.name} className="group relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-4 text-center hover:bg-white/[0.06] hover:border-white/20 transition-all hover:-translate-y-0.5 overflow-hidden">
              <div className={`absolute -inset-x-20 -top-20 -bottom-20 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity`} />
              <div className="relative">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-white/5 border border-white/5 grid place-items-center">
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
                <div className={`text-sm font-medium text-white/80 group-hover:text-white transition`}>{i.name}</div>
                <div className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>{i.type}</div>
              </div>
            </div>
          );
        })}
      </div>
      {filter && filtered.length === 0 && (
        <p className="text-center text-sm text-white/40 mt-4">Brak integracji dla &ldquo;{filter}&rdquo;</p>
      )}
    </Section>
  );
}

/* ──── COMPLIANCE ──── */
function Compliance() {
  return (
    <Section eyebrow="06 · Bezpieczeństwo" title={<>Twoje dane <span className="text-gradient-cyber">są bezpieczne</span></>}>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-7">
          <Lock className="w-7 h-7 text-cyan-300 mb-4"/>
          <h3 className="font-display text-xl font-semibold">Zgodność z RODO i UE</h3>
          <p className="mt-3 text-white/65 text-sm leading-relaxed">
            Wszystkie dane uczniów przetwarzane są na serwerach w Unii Europejskiej. Szyfrowanie w spoczynku i tranzycie. Pełen dziennik audytu. Umowa powierzenia danych do podpisu z każdą szkołą.
          </p>
          <div className="mt-5 grid sm:grid-cols-2 gap-2.5 text-sm text-white/70">
            {[
              "RODO / GDPR — pełna zgodność",
              "Umowa powierzenia danych",
              "Cykliczny audyt bezpieczeństwa",
              "Kopie zapasowe co 6 godzin",
              "Eksport danych w każdej chwili",
              "Usuwanie konta w 48h",
              "Szyfrowanie TLS 1.3 + AES-256",
              "Serwery tylko w UE (Warszawa, Frankfurt)",
            ].map((l) => (
              <div key={l} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5"/>{l}</div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { t: "RODO", s: "Rozporządzenie 2016/679", c: "from-cyan-400 to-blue-500" },
            { t: "ISO 27001", s: "Bezpieczeństwo informacji", c: "from-violet-400 to-fuchsia-500" },
            { t: "WCAG 2.1 AA", s: "Dostępność cyfrowa", c: "from-emerald-300 to-cyan-400" },
            { t: "EU Data", s: "Warszawa · Frankfurt", c: "from-amber-300 to-rose-400" },
            { t: "Szyfrowanie", s: "TLS 1.3 · AES-256", c: "from-cyan-300 to-indigo-400" },
            { t: "Audyt", s: "Rejestracja wszystkich akcji", c: "from-purple-400 to-pink-500" },
            { t: "Backup", s: "Kopie co 6 godzin", c: "from-teal-400 to-emerald-500" },
            { t: "Uptime", s: "99.98% SLA", c: "from-orange-400 to-red-500" },
            { t: "Certyfikaty", s: "Weryfikacja online · QR", c: "from-emerald-400 to-cyan-500" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-5 relative overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${c.c} opacity-20 blur-2xl`}/>
              <div className={`font-display text-2xl font-semibold bg-gradient-to-br ${c.c} bg-clip-text text-transparent`}>{c.t}</div>
              <div className="text-xs text-white/55 mt-1.5">{c.s}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ──── TESTIMONY ──── */
const NOTES = [
  { n: "Katarzyna Mazurek", r: "Matematyka · XIV LO im. Staszica, Warszawa", text: "Przed EduNex układałam testy w Wordzie. Teraz robię to dwa razy szybciej i nie liczę punktów ręcznie. AI czasem lepiej dobiera dystraktory niż ja." },
  { n: "Paweł Górski", r: "Wicedyrektor · III LO Marynarki Wojennej, Gdynia", text: "Po dwóch miesiącach reszta nauczycieli sama prosiła o dostęp. Monitoring na żywo to game changer — od razu widzę, kto potrzebuje pomocy." },
  { n: "Magdalena Adamczyk", r: "Polonistka · V LO im. Witkowskiego, Kraków", text: "Najbardziej cenię to, że uczeń widzi wynik od razu i wie co poprawić. To uczy odpowiedzialności. A ja oszczędzam 10 godzin tygodniowo." },
  { n: "Tomasz Wróblewski", r: "Dyrektor · ZSE im. Skłodowskiej-Curie, Poznań", text: "Platforma spełnia wszystkie wymogi RODO i MEN. Wdrożenie zajęło 3 dni. Koszty druku spadły o 90%." },
  { n: "Anna Jabłońska", r: "Anglistka · VI LO im. Kochanowskiego, Wrocław", text: "Uwielbiam generator AI — wczytuję zdjęcie tekstu z podręcznika i w 10 sekund mam 10 pytań. Niesamowite." },
  { n: "Michał Zieliński", r: "Informatyk · XIII LO, Szczecin", text: "Uczniowie mogą pisać kod w przeglądarce na egzaminie z informatyki. Autouruchamianie testów jest idealne." },
];
function Testimony() {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setTransitioning(true); setTimeout(() => { setIndex((i) => (i + 3) % NOTES.length); setTransitioning(false) }, 300); }, 5000);
    return () => clearInterval(iv);
  }, []);
  const prev = () => { setTransitioning(true); setTimeout(() => { setIndex((i) => (i - 3 + NOTES.length) % NOTES.length); setTransitioning(false) }, 200); };
  const next = () => { setTransitioning(true); setTimeout(() => { setIndex((i) => (i + 3) % NOTES.length); setTransitioning(false) }, 200); };
  const visible = NOTES.slice(index, index + 3);
  if (visible.length < 3) visible.push(...NOTES.slice(0, 3 - visible.length));
  return (
    <Section eyebrow="07 · Głosy" title="Co mówią nauczyciele i dyrektorzy">
      <div className="relative">
        <div className="grid md:grid-cols-3 gap-4 min-h-[220px]">
          {visible.map((no) => (
            <figure key={`${no.n}-${index}`} className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 relative flex flex-col ${transitioning ? "" : "testimonial-enter"}`}>
              <div className="text-5xl font-display text-cyan-300/40 leading-none mb-3">"</div>
              <blockquote className="text-white/80 leading-relaxed text-[15px] flex-1">{no.text}</blockquote>
              <figcaption className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-black font-display font-semibold text-sm">{no.n[0]}</div>
                <div>
                  <div className="font-medium text-sm">{no.n}</div>
                  <div className="text-xs text-white/50">{no.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:text-cyan-300 grid place-items-center transition">&larr;</button>
          <div className="flex gap-2">
            {NOTES.map((_, i) => (
              <button key={i} onClick={() => { setTransitioning(true); setTimeout(() => { setIndex(i - (i % 3)); setTransitioning(false) }, 200) }} className={`w-2 h-2 rounded-full transition-all duration-300 ${i >= index && i < index + 3 ? "bg-cyan-400 w-5" : "bg-white/20 hover:bg-white/40"}`}/>
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:text-cyan-300 grid place-items-center transition">&rarr;</button>
        </div>
      </div>
    </Section>
  );
}

/* ──── ACHIEVEMENTS ──── */
const ACHIEVEMENTS = [
  { icon: Trophy, label: "Egzaminów dziennie", value: "847", suffix: "+", color: "from-amber-400 to-orange-500" },
  { icon: School, label: "Aktywnych szkół", value: "128", suffix: "+", color: "from-cyan-400 to-blue-500" },
  { icon: Users, label: "Nauczycieli online", value: "2 340", suffix: "", color: "from-violet-400 to-fuchsia-500" },
  { icon: Award, label: "Certyfikatów wydanych", value: "18 920", suffix: "", color: "from-emerald-400 to-teal-500" },
  { icon: Heart, label: "Zadowolonych uczniów", value: "97.8", suffix: "%", color: "from-rose-400 to-pink-500" },
  { icon: Infinity, label: "Uptime SLA", value: "99.98", suffix: "%", color: "from-emerald-300 to-cyan-400" },
];
function Achievements() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[10px] uppercase tracking-[0.22em] text-white/60 font-mono">★ · Osiągnięcia</div>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">
            Platforma w <span className="text-gradient-cyber">liczbach</span>
          </h2>
          <p className="mt-4 text-white/60 text-base">Każda statystyka to realna wartość dla polskiej edukacji.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ACHIEVEMENTS.map((a, i) => (
            <div key={a.label}
              className="relative rounded-2xl border border-white/10 bg-[#0a0d18] p-5 text-center group hover:bg-[#0f1322] hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${a.color} grid place-items-center mb-4`}>
                <a.icon className="w-6 h-6 text-black" />
              </div>
              <div className="font-display text-3xl font-bold tabular-nums">
                <span className={`bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.value}</span>
                <span className="text-cyan-300/60 text-2xl">{a.suffix}</span>
              </div>
              <div className="text-xs text-white/50 mt-1.5">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── PRICING ──── */
const PLANS = [
  { name: "Klasa", price: "0", sub: "na zawsze", lines: ["Do 35 uczniów", "Bank pytań 300+", "15 egzaminów/mies", "Podstawowe raporty", "Wsparcie e-mail"], feat: false },
  { name: "Korepetytor", price: "49", sub: "/mies", lines: ["Do 25 uczniów", "Bank pytań 1000+", "Egzaminy bez limitu", "Generator AI 50 zapytań", "Eksport PDF/Excel"], feat: false },
  { name: "Nauczyciel", price: "99", sub: "/mies", lines: ["Do 60 uczniów", "Bank pytań 3000+", "Egzaminy bez limitu", "Generator AI 200 zapytań", "Monitoring na żywo", "Wsparcie priorytetowe"], feat: false },
  { name: "Szkoła", price: "490", sub: "/mies", lines: ["Do 300 uczniów", "Bank pytań 10000+", "Generator AI bez limitu", "Eksport Vulcan/Librus", "Anti-cheat AI", "Wsparcie 24/7"], feat: false },
  { name: "Szkoła Plus", price: "890", sub: "/mies", lines: ["Do 800 uczniów", "Bank pytań bez limitu", "Anti-cheat + monitoring", "API REST dostęp", "Dedykowany opiekun", "Priorytetowy SLA"], feat: true },
  { name: "Dzielnica", price: "2990", sub: "/mies", lines: ["Do 8 szkół / 3000 uczniów", "Centralne zarządzanie", "Wspólna baza pytań", "Raporty porównawcze", "SLA 99,95%", "Dedykowane wdrożenie"], feat: false },
  { name: "Kuratorium", price: "Indywidualnie", sub: "", lines: ["Nieograniczona liczba szkół", "Centralna baza + zatwierdzanie", "Raporty wojewódzkie", "SLA 99,99% + DR", "Dedykowany zespół", "Niestandardowe integracje"], feat: false },
];

function Pricing() {
  const navigate = useNavigate();
  const [yr, setYr] = useState(false);
  const yearlyPrice = (p: string) => {
    if (p === "0" || p === "Indywidualnie") return p;
    return String(Math.round(parseInt(p) * 0.8));
  };
  return (
    <section id="cennik" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[10px] uppercase tracking-[0.22em] text-white/60 font-mono mb-4">Cennik</div>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">Wybierz swój plan</h2>
          <p className="mt-3 text-white/60">Płatność kartą, przelewem lub krypto</p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm ${!yr ? "text-white font-medium" : "text-white/40"}`}>Miesięcznie</span>
          <button onClick={() => setYr((v) => !v)}
            className={`relative w-14 h-7 rounded-full transition-colors ${yr ? "bg-cyan-400" : "bg-white/20"}`}>
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${yr ? "translate-x-7" : ""}`} />
          </button>
          <span className={`text-sm ${yr ? "text-white font-medium" : "text-white/40"}`}>
            Rocznie <span className="ml-1 text-[10px] font-mono bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full">-20%</span>
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {PLANS.map((pl) => {
            const price = yr && pl.price !== "0" && pl.price !== "Indywidualnie" ? yearlyPrice(pl.price) : pl.price;
            const isFeat = pl.feat;
            const isKlasa = pl.price === "0";
            const isContact = pl.price === "Indywidualnie";
            const isPay = !isKlasa && !isContact;
            return (
              <div key={pl.name}
                className={`rounded-2xl border flex flex-col transition-all duration-200 relative overflow-hidden
                  ${isFeat
                    ? "border-cyan-400/50 bg-cyan-950/40 shadow-[0_0_30px_-8px_rgba(34,211,238,0.3)] scale-[1.02] z-10"
                    : "border-white/10 bg-[#0a0d18] hover:border-white/20"}`}>
                {isFeat && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400" />
                )}
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg font-semibold">{pl.name}</h3>
                    {isFeat && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-black text-[9px] font-bold uppercase tracking-wide shadow-lg">
                        <Star className="w-3 h-3" />Najpopularniejszy
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`font-display text-4xl font-bold ${isFeat ? "text-cyan-300" : "text-white"}`}>{price}</span>
                    <span className="text-sm text-white/50">{yr && pl.sub === "/mies" ? "/rok" : pl.sub}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm flex-1">
                    {pl.lines.map((l) => (
                      <li key={l} className="flex gap-2">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isFeat ? "text-cyan-300" : "text-white/30"}`} />
                        <span className={isFeat ? "text-white/90" : "text-white/60"}>{l}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    {isKlasa && (
                      <button onClick={() => navigate({ to: "/auth/teacher" })}
                        className="w-full py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all">
                        Rozpocznij za darmo
                      </button>
                    )}
                    {isPay && (
                      <NexaPayCheckout planName={pl.name}
                        amount={yr && pl.price !== "0" ? yearlyPrice(pl.price) + " zł" : pl.price + " zł"}
                        amountUsd={String(Math.round(parseInt(pl.price) / 4))} />
                    )}
                    {isContact && (
                      <button onClick={() => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })}
                        className="w-full py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all">
                        Poproś o wycenę
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──── FAQ ──── */
const FAQ_ITEMS = [
  { q: "Czy uczniowie muszą zakładać konto?", a: "Nie. Uczeń wchodzi przeglądarką, wpisuje sześciocyfrowy PIN przekazany przez nauczyciela i imię. Konto nie jest wymagane, nie zbiera się żadnych danych osobowych ucznia poza imieniem i nazwiskiem." },
  { q: "Czy mogę wgrać pytania z istniejącego dokumentu?", a: "Tak. Wspieramy import z Worda, PDF oraz arkusza Excel. System rozpozna numerację pytań i odpowiedzi. Możesz też wczytać zdjęcie kartki — AI odczyta pytania automatycznie." },
  { q: "Co z uczniami bez komputera w domu?", a: "Egzamin działa na każdym telefonie z przeglądarką. Nie wymaga instalacji ani danych większych niż 5 MB. Do monitoringu ekranu wymagany jest komputer z Chrome/Edge." },
  { q: "Jak wygląda umowa ze szkołą?", a: "Umowa powierzenia danych osobowych zgodna z RODO oraz faktura VAT. Proces zajmuje do trzech dni roboczych. Dla planu Klasa umowa jest w formie akceptacji online." },
  { q: "Czy są zniżki dla placówek publicznych?", a: "Tak. Szkoły podstawowe i licea publiczne otrzymują 30% rabatu na plan Szkoła. Dla szkół z małych miejscowości (poniżej 5 tys. mieszkańców) rabat wynosi 50%." },
  { q: "Jak działa monitoring ekranu?", a: "Uczeń musi udostępnić cały ekran przed rozpoczęciem. System wykrywa opuszczanie okna egzaminu, próby użycia skrótów klawiszowych, a AI analizuje ruchy myszy pod kątem ściągania." },
  { q: "Czy dane są bezpieczne?", a: "Tak. Serwery w Warszawie i Frankfurcie. Szyfrowanie TLS 1.3 w tranzycie, AES-256 w spoczynku. Pełna zgodność z RODO. Umowa powierzenia danych. Audyt co 6 miesięcy." },
  { q: "Jak szybko mogę zacząć?", a: "Rejestracja nauczyciela trwa 2 minuty. Po zatwierdzeniu przez administratora (zwykle do 24h) możesz od razu tworzyć pierwszy egzamin. Dla planu Klasa — dostęp od razu." },
];
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const filtered = FAQ_ITEMS.filter((it) => it.q.toLowerCase().includes(search.toLowerCase()) || it.a.toLowerCase().includes(search.toLowerCase()));
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="reveal"><SectionHead eyebrow="09 · FAQ" title="Wątpliwości — wyjaśnione" sub="Najczęściej zadawane pytania przez nauczycieli i dyrektorów." /></div>
        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-8 reveal reveal-delay-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setOpen(null) }} placeholder="Szukaj w FAQ..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition">✕</button>}
        </div>
        <div className="reveal reveal-delay-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur divide-y divide-white/5 overflow-hidden">
          {filtered.map((it, i) => {
            const idx = FAQ_ITEMS.indexOf(it);
            return (
              <div key={it.q}>
                <button onClick={() => setOpen(open === idx ? null : idx)} className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-all ${open === idx ? "bg-white/[0.02]" : "hover:bg-white/[0.02]"}`}>
                  <span className={`font-medium transition ${open === idx ? "text-white" : "text-white/80"}`}>
                    {search ? highlightMatch(it.q, search) : it.q}
                  </span>
                  <span className={`shrink-0 w-7 h-7 rounded-full border grid place-items-center transition-all duration-300 ${open === idx ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 rotate-45" : "border-white/15 text-white/50"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className={`px-6 pb-6 text-white/65 leading-relaxed text-sm ${search ? "text-cyan-200/80" : ""}`}>{search ? highlightMatch(it.a, search) : it.a}</p>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-white/40">
              Brak wyników dla &ldquo;{search}&rdquo;. <a href="#kontakt" className="text-cyan-300 hover:underline">Napisz do nas</a>
            </div>
          )}
        </div>
        <div className="reveal reveal-delay-2 mt-8 text-center">
          <p className="text-sm text-white/50">Nie znalazłeś odpowiedzi? <a href="#kontakt" className="text-cyan-300 hover:underline">Napisz do nas</a> — odpowiemy w 24h.</p>
        </div>
      </div>
    </section>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-cyan-400/20 text-cyan-200 rounded px-0.5">{part}</mark>
      : part
  );
}

/* ──── NEWSLETTER ──── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    toast.success("Zapisano do newslettera. Sprawdź skrzynkę!");
    setEmail("");
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <section className="reveal py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px]"/>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/5 rounded-full blur-[100px]"/>
          {sent ? (
            <><CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" /><h2 className="font-display text-3xl sm:text-4xl font-semibold text-emerald-300">Jesteś zapisany!</h2><p className="mt-3 text-white/60 max-w-md mx-auto">Sprawdź skrzynkę — wyślemy potwierdzenie. Do zobaczenia w newsletterze!</p></>
          ) : (
            <><Bell className="w-8 h-8 text-cyan-300 mx-auto mb-4 animate-float" /><h2 className="font-display text-3xl sm:text-4xl font-semibold">Bądź na bieżąco</h2><p className="mt-3 text-white/60 max-w-md mx-auto">Nowe funkcje, aktualizacje i porady dydaktyczne — raz na dwa tygodnie, zero spamu.</p></>
          )}
          {!sent && (
            <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Twój e-mail" className="flex-1 w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition text-white placeholder:text-white/30"/>
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-black bg-gradient-to-br from-cyan-300 via-white to-violet-200 hover:shadow-[0_8px_32px_-8px_rgba(34,211,238,0.6)] transition shrink-0">
                <Send className="w-4 h-4"/> Zapisz się
              </button>
            </form>
          )}
          <p className="mt-4 text-[11px] text-white/30">Możesz wypisać się w każdej chwili. Polityka prywatności dostępna w stopce.</p>
        </div>
      </div>
    </section>
  );
}

/* ──── CONTACT ──── */
function Contact() {
  const submit = useServerFn(submitContact);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({ data: {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        subject: String(fd.get("subject") ?? "Zapytanie ze strony"),
        message: String(fd.get("message") ?? ""),
      } });
      toast.success("Wiadomość wysłana. Odezwiemy się w ciągu 24 godzin.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd wysyłki");
    } finally { setBusy(false); }
  };
  return (
    <section id="kontakt" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-10 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 reveal">
            <SectionHead eyebrow="10 · Kontakt" title="Napisz do nas" sub="Odpowiadamy w dni robocze w ciągu 24 godzin." align="left" />
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><Mail className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5"/><div><div className="text-white">kontakt@edunex.pl</div><div className="text-xs text-white/50">Sekretariat platformy</div></div></li>
              <li className="flex gap-3"><Phone className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5"/><div><div className="text-white">+48 22 100 12 34</div><div className="text-xs text-white/50">Pon–Pt, 8:00–16:00</div></div></li>
              <li className="flex gap-3"><MapPin className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5"/><div><div className="text-white">ul. Świętokrzyska 14, 00-050 Warszawa</div><div className="text-xs text-white/50">Biuro projektu</div></div></li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Status systemu</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-emerald-300">Wszystkie systemy działają prawidłowo</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400/50"/>
                <span>Ostatnia kontrola: {new Date().toLocaleString("pl-PL")}</span>
              </div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="reveal reveal-delay-1 lg:col-span-3 grid sm:grid-cols-2 gap-4">
            <Field label="Imię i nazwisko"><input name="name" required className={inp}/></Field>
            <Field label="E-mail"><input name="email" type="email" required className={inp}/></Field>
            <Field label="Temat" wide><input name="subject" className={inp} placeholder="np. Wdrożenie w szkole podstawowej"/></Field>
            <Field label="Treść wiadomości" wide><textarea name="message" rows={5} required className={inp}/></Field>
            <div className="sm:col-span-2 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-white/45">Wysłanie formularza oznacza zgodę na kontakt zwrotny.</p>
              <button disabled={busy} type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-black bg-gradient-to-br from-cyan-300 via-white to-violet-200 hover:shadow-[0_8px_32px_-8px_rgba(34,211,238,0.6)] disabled:opacity-50 transition">
                {busy ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>} Wyślij
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

const inp = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition text-white placeholder:text-white/30";

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <div className="text-[11px] uppercase tracking-widest text-white/50 mb-1.5">{label}</div>
      {children}
    </label>
  );
}

/* ──── FOOTER ──── */
function Footer() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const f = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <footer className="reveal border-t border-white/10 bg-black/40 backdrop-blur relative">
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-900 grid place-items-center shadow-xl hover:scale-110 transition-all animate-float">
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3"><Mark /><div className="font-display text-xl font-semibold">EduNex</div></div>
          <p className="mt-4 text-xs text-white/55 leading-relaxed max-w-xs">Nowoczesna platforma egzaminacyjna dla polskich szkół. Niezależny projekt edukacyjny zgodny z wytycznymi MEN.</p>
          <div className="mt-5 flex items-center gap-3">
            {[Github, MessageSquare, Play, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-white/40 hover:text-white hover:bg-white/10 transition">
                <Icon className="w-4 h-4"/>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/40 mb-3">Platforma</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/auth/student" className="hover:text-cyan-300 transition">Wejście ucznia</Link></li>
            <li><Link to="/auth/teacher" className="hover:text-cyan-300 transition">Panel nauczyciela</Link></li>
            <li><Link to="/auth/admin" className="hover:text-cyan-300 transition">Panel dyrekcji</Link></li>
            <li><a href="#funkcje" className="hover:text-cyan-300 transition">Wszystkie funkcje</a></li>
            <li><a href="#cennik" className="hover:text-cyan-300 transition">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/40 mb-3">Dokumenty</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/dokumenty" className="hover:text-cyan-300 transition">Regulamin</Link></li>
            <li><Link to="/dokumenty" className="hover:text-cyan-300 transition">Polityka prywatności</Link></li>
            <li><Link to="/dokumenty" className="hover:text-cyan-300 transition">Umowa powierzenia</Link></li>
            <li><Link to="/dokumenty" className="hover:text-cyan-300 transition">Status systemu</Link></li>
            <li><Link to="/dokumenty" className="hover:text-cyan-300 transition">RODO — informacje</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/40 mb-3">Kontakt</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>kontakt@edunex.pl</li>
            <li>+48 22 100 12 34</li>
            <li>ul. Świętokrzyska 14<br/>00-050 Warszawa</li>
          </ul>
          <div className="mt-4 text-[10px] text-white/30 font-mono tracking-wider">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>operational</span>
            <span className="ml-3">v3.1.0</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/45">
          <div>© {new Date().getFullYear()} EduNex · Wszelkie prawa zastrzeżone · Projekt edukacyjny dla polskich szkół</div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 pulse-ring"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>100% online</span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[10px] text-white/30">v5.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──── helpers ──── */
function Section({ id, eyebrow, title, sub, children }: { id?: string; eyebrow: string; title: React.ReactNode; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal"><SectionHead eyebrow={eyebrow} title={title} sub={sub} /></div>
        <div className="reveal reveal-delay-1">{children}</div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: React.ReactNode; sub?: string; align?: "center" | "left" }) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl mb-12 sm:mb-16 ${a}`}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[10px] uppercase tracking-[0.22em] text-white/60 font-mono">{eyebrow}</div>
      <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">{title}</h2>
      {sub && <p className="mt-4 text-white/60 text-base leading-relaxed">{sub}</p>}
    </div>
  );
}

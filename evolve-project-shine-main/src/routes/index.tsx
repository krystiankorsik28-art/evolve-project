import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/lib/theme";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  GraduationCap, Users, Shield, ArrowRight, ArrowUpRight, CheckCircle2, BookOpen,
  Mail, Phone, MapPin, Send, Loader2, Menu, X, FileText, ClipboardList,
  Library, BarChart3, Lock, Calendar, Sparkles, Zap, Globe2, Activity,   ShieldCheck, ChevronUp, Code2, Presentation,
  BrainCircuit, Bot, Database, Smartphone, Wifi, Cloud, Download, Upload,
  Timer, Clock, Award, Medal, Star, Trophy, TrendingUp, Target, Eye,
  Search, Filter, LayoutDashboard, Share2, Github,
  School, BookMarked, MessageSquare, LifeBuoy,
  DollarSign, BadgeCheck, Verified, Monitor,
  Laptop, Rocket, Flag, Compass, PenTool,
  ArrowLeft, Play, ChevronRight, ChevronDown, Plus, Tablet, Headphones, Bell,
  Lightbulb, Cable, Workflow, GripVertical, Puzzle, ScrollText, Heart, KeyRound, Video,
  Infinity, Computer, Newspaper, Radio, GitBranch,
  ScanFace, Building2, Scale, Fingerprint, Tv, Globe, Paintbrush,
  Sigma, Orbit, Handshake, Coins, Notebook, ListChecks,
  SmartphoneNfc, Sun, Moon, Palette,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { submitContact } from "@/lib/contact.functions";
import { NexaPayCheckout } from "@/components/NexaPayCheckout";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "EduNex — Globalna platforma edukacyjna nowej generacji z AI" },
      { name: "description", content: "EduNex — globalna platforma edukacyjna nowej generacji. Egzaminy online, AI Tutor, kursy, certyfikacja i zarządzanie szkołami. Dla uczniów, nauczycieli, szkół i firm na całym świecie." },
    ],
  }),
});

/* ──── Confetti ──── */
function burstConfetti(e: React.MouseEvent) {
  const colors = ["#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#f97316"];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    const color = colors[Math.floor(Math.random() * colors.length)];
    el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${4 + Math.random() * 4}px;height:${4 + Math.random() * 4}px;background:${color};animation-delay:${Math.random() * 0.2}s;animation-duration:${1.2 + Math.random() * 0.8}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}

/* ──── Ripple ──── */
function addRipple(e: React.MouseEvent) {
  const t = e.currentTarget as HTMLElement;
  const r = document.createElement("span");
  r.className = "ripple-effect";
  const rect = t.getBoundingClientRect();
  r.style.left = `${e.clientX - rect.left}px`;
  r.style.top = `${e.clientY - rect.top}px`;
  t.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

/* ──── Text Reveal ──── */
function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRevealed(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} style={{ display: "inline" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block" style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0) rotate(0deg)" : "translateY(40px) rotate(4deg)",
          transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`
        }}>
          {w}{i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/* ──── Parallax Orb Wrapper ──── */
function ParallaxOrbs() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.querySelectorAll<HTMLElement>(".parallax-layer").forEach((l) => {
        const d = parseFloat(l.dataset.depth ?? "5");
        l.style.translate = `${x * d}px ${y * d}px`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return <div ref={ref} className="hidden" />;
}

/* ──── Particle Background ──── */
function ParticleBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (c?.width ?? window.innerWidth),
      y: Math.random() * (c?.height ?? window.innerHeight),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.5,
      o: 0.2 + Math.random() * 0.4,
    }));
    const draw = () => {
      if (!c || !ctx) return;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.75 0.18 200 / ${p.o})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `oklch(0.75 0.18 200 / ${0.06 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} id="particle-canvas" className="fixed inset-0 pointer-events-none" />;
}

function Landing() {
  const { setTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTheme("dark") }, []);

  /* ──── IntersectionObserver with stagger ──── */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          const children = e.target.querySelectorAll(".stagger-item");
          children.forEach((c, i) => {
            const delay = Math.min(i, 12);
            (c as HTMLElement).style.transitionDelay = `${delay * 0.06}s`;
          });
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    setTimeout(() => {
      document.querySelectorAll(".reveal, .reveal-scale, .reveal-left, .reveal-right").forEach((el) => obs.observe(el));
      if (document.documentElement.getBoundingClientRect().top > -200) {
        document.querySelectorAll(".reveal, .reveal-scale, .reveal-left, .reveal-right").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight + 200) el.classList.add("revealed");
        });
      }
    }, 100);
    return () => obs.disconnect();
  }, []);

  /* ──── Scroll Progress ──── */
  const progRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => {
      if (!progRef.current) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progRef.current.style.transform = `scaleX(${Math.min(window.scrollY / h, 1)})`;
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  /* ──── Cursor Glow ──── */
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const f = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", f, { passive: true });
    return () => window.removeEventListener("mousemove", f);
  }, []);

  /* ──── Magnetic Buttons ──── */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const btns = document.querySelectorAll<HTMLElement>(".magnetic-btn");
    const f = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.15;
      const y = (e.clientY - r.top - r.height / 2) * 0.15;
      btn.style.translate = `${x}px ${y}px`;
    };
    const reset = (e: MouseEvent) => { (e.currentTarget as HTMLElement).style.translate = "0px 0px"; };
    btns.forEach(b => { b.addEventListener("mousemove", f); b.addEventListener("mouseleave", reset); });
    return () => { btns.forEach(b => { b.removeEventListener("mousemove", f); b.removeEventListener("mouseleave", reset); }); };
  }, [loaded]);

  /* ──── Sparkle Trail ──── */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let timeout: ReturnType<typeof setTimeout>;
    const f = (e: MouseEvent) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const s = document.createElement("div");
        s.className = "sparkle";
        s.style.left = `${e.clientX}px`; s.style.top = `${e.clientY}px`;
        s.style.background = `oklch(0.75 0.18 ${200 + Math.random() * 130})`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 700);
      }, 60);
    };
    window.addEventListener("mousemove", f, { passive: true });
    return () => { window.removeEventListener("mousemove", f); clearTimeout(timeout); };
  }, []);

  return (
    <>
      <SplashScreen onDone={() => setLoaded(true)} />
      <div className={`min-h-screen bg-canvas selection:bg-accent/30 selection:text-white overflow-x-hidden ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
        <div ref={progRef} className="scroll-progress" />
        <div ref={glowRef} className="spotlight max-lg:hidden" />
        <ParallaxOrbs />
        <ParticleBg />
        <Toaster theme="dark" />
        <SocialProof />
        <CookieBanner />
        <NavBar />
        <main className="relative z-10">
          <Hero />
          <StatsMarquee />
          <HowItWorks />
          <FeaturesFlow />
          <DemoShowcase />
          <ForWhomFlow />
          <ComparisonShowcase />
          <AchievementsFlow />
          <AIPlatformFlow />
          <AiDemoShowcase />
          <SecurityFlow />
          <TestimonialsFlow />
          <PricingFlow />
          <FAQFlow />
          <GlobalEnterpriseFlow />
          <InvestorFlow />
          <BlogFlow />
          <MobileCtaFlow />
          <NewsletterFlow />
          <ContactFlow />
        </main>
        <StickyCta />
        <FooterFlow />
      </div>
    </>
  );
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 1000);
    const t2 = setTimeout(() => onDone(), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className={`fixed inset-0 z-[9999] grid place-items-center bg-[oklch(0.06_0.03_270)] transition-all duration-700 ${exit ? "opacity-0 pointer-events-none" : ""}`}>
      <div className="text-center">
        <div className="mx-auto w-20 h-20 rounded-[28px] bg-gradient-to-br from-accent to-fuchsia-500 p-[2px] shadow-[0_0_80px_-16px_rgba(34,211,238,0.3)]" style={{ animation: "splashPulse 1s ease-in-out infinite" }}>
          <div className="w-full h-full rounded-[26px] bg-[oklch(0.06_0.03_270)] grid place-items-center">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/>
            </svg>
          </div>
        </div>
        <div className="mt-5 text-xl font-semibold text-white/90 tracking-tight" style={{ animation: "splashFade 0.5s 0.2s ease-out forwards" }}>EduNex</div>
        <div className="mx-auto mt-5 w-32 h-[2px] rounded-full bg-white/[0.06] overflow-hidden" style={{ animation: "splashFade 0.5s 0.3s ease-out forwards" }}>
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-fuchsia-400" style={{ animation: "splashLoad 1s 0.4s cubic-bezier(0.16,1,0.3,1) forwards", transformOrigin: "left", transform: "scaleX(0)" }} />
        </div>
      </div>
      <style>{`@keyframes splashPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } } @keyframes splashFade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } } @keyframes splashLoad { to { transform:scaleX(1); } }`}</style>
    </div>
  );
}

const SOCIAL_EVENTS = [
  { n: "Zofia Wiśniewska", a: "zakończyła egzamin", s: "92%", g: "emerald" },
  { n: "III LO w Gdyni", a: "dodała 40 pytań z biologii do banku", s: "gotowe", g: "cyan" },
  { n: "Jakub K.", a: "otrzymał certyfikat z", s: "matematyki", g: "amber" },
  { n: "V LO Kraków", a: "rozpoczęła sprawdzian —", s: "28 uczniów", g: "violet" },
  { n: "Hanna Lewandowska", a: "poprawiła wynik o", s: "+14 pkt", g: "emerald" },
  { n: "ZSE Poznań", a: "przeniósł 3 klasy z Librusa", s: "200 uczniów", g: "cyan" },
  { n: "Maja S.", a: "zdobyła certyfikat —", s: "100%", g: "emerald" },
  { n: "SP Nr 5", a: "dodała klasę", s: "3B", g: "violet" },
  { n: "II LO Warszawa", a: "włączyła monitoring AI —", s: "działa", g: "cyan" },
  { n: "Paweł Górski", a: "właśnie ułożył sprawdzian z", s: "chemii", g: "amber" },
  { n: "XIV LO", a: "przeprowadził egzamin próbny —", s: "32 osoby", g: "emerald" },
  { n: "Ewa Kwiatkowska", a: "otrzymała certyfikat z", s: "polskiego", g: "violet" },
  { n: "SP Nr 32", a: "dodała 80 uczniów —", s: "załatwione", g: "cyan" },
  { n: "III LO Gdynia", a: "przeprowadziło 6 egzaminów dziś", s: "aktywni", g: "emerald" },
];
function SocialProof() {
  const [items, setItems] = useState<{ n: string; a: string; s: string; g: string; id: number }[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const show = () => {
      const ev = SOCIAL_EVENTS[Math.floor(Math.random() * SOCIAL_EVENTS.length)];
      const id = ++idRef.current;
      setItems((prev) => [...prev.slice(-2), { ...ev, id }]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 6000 + Math.random() * 6000);
    };
    const t1 = setTimeout(show, 2000 + Math.random() * 4000);
    let timeout: ReturnType<typeof setTimeout>;
    const sched = () => { timeout = setTimeout(() => { show(); sched(); }, 3000 + Math.random() * 11000); };
    sched();
    return () => { clearTimeout(t1); clearTimeout(timeout); };
  }, []);
  const cm: Record<string, string> = { emerald: "#34d399", cyan: "#22d3ee", amber: "#fbbf24", violet: "#a78bfa" };
  return (
    <div className="fixed bottom-28 left-6 z-50 flex flex-col gap-2 max-lg:hidden pointer-events-none">
      {items.map((ev) => (
        <div key={ev.id} className="rounded-2xl bg-black/60 backdrop-blur-2xl px-4 py-3 shadow-2xl max-w-[280px] border border-white/[0.06]"
          style={{ animation: "notifIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cm[ev.g] ?? "#888", boxShadow: `0 0 8px ${cm[ev.g] ?? "#888"}` }} />
            <div><span className="font-medium text-white/90">{ev.n}</span><span className="text-white/40"> {ev.a}</span> <span className="text-white/60 font-mono"> {ev.s}</span></div>
          </div>
        </div>
      ))}
      <style>{`@keyframes notifIn { from { opacity:0; transform:translateY(16px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}

function CookieBanner() {
  const [v, setV] = useState(true);
  useEffect(() => { if (typeof window !== "undefined" && localStorage.getItem("cookies-ok")) setV(false); }, []);
  if (!v) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-black/70 backdrop-blur-2xl border-t border-white/[0.06] cookie-banner">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/50">Używamy plików cookie, aby zapewnić najlepsze doświadczenia.</p>
        <button onClick={() => { localStorage.setItem("cookies-ok", "1"); setV(false) }} className="btn-primary text-xs">Akceptuję</button>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  ["#funkcje", "Funkcje"], ["#ai-demo", "AI Demo"], ["#cennik", "Cennik"], ["#opinie", "Opinie"], ["#kontakt", "Kontakt"],
];
function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const f = () => {
      setScrolled(window.scrollY > 20);
    };
    f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
    setIsLight(!isLight);
  };
  return (
    <header className={`nav-premium ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="nav-inner flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-white/10 to-white/5 p-[1.5px] shadow-lg transition-all duration-500 group-hover:scale-105" style={{ animation: "logoPulse 3s ease-in-out infinite" }}>
              <div className="w-full h-full rounded-[10px] bg-[oklch(0.06_0.04_260)] grid place-items-center">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <span className="font-semibold text-base tracking-tight">EduNex</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(([h, l]) => (
              <a key={h} href={h} className="nav-link">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleTheme} className="btn-ghost p-2 hidden sm:inline-flex" aria-label="Przełącz motyw">
              {isLight ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
            </button>
            <Link to="/auth/student" className="btn-ghost hidden sm:inline-flex">
              <GraduationCap className="w-4 h-4"/>Uczeń
            </Link>
            <Link to="/auth/teacher" onClick={(e) => burstConfetti(e)} className="btn-primary py-2 px-4 text-xs magnetic-btn">
              Zaloguj <ArrowRight className="w-3.5 h-3.5"/>
            </Link>
            <button onClick={() => setOpen(!open)} className="lg:hidden btn-ghost p-2" aria-label="Menu">
              {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          </div>
        )}
        {open && (
          <div className="lg:hidden pb-4 flex flex-col gap-1 text-sm relative z-50"
            style={{ animation: "notifIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            {["Funkcje", "AI Demo", "Cennik", "Opinie", "Kontakt"].map((l, i) => (
              <a key={l} onClick={() => setOpen(false)} href={`#${["funkcje","ai-demo","cennik","opinie","kontakt"][i]}`} className="px-4 py-3 rounded-xl hover:bg-white/[0.04] text-white/70">{l}</a>
            ))}
            <div className="h-px bg-white/[0.06] my-1"/>
            <Link onClick={() => setOpen(false)} to="/auth/student" className="px-4 py-3 rounded-xl hover:bg-white/[0.04] text-white/70">Uczeń</Link>
            <Link onClick={() => setOpen(false)} to="/auth/teacher" className="px-4 py-3 rounded-xl hover:bg-white/[0.04] text-white/70">Nauczyciel</Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  const headlines = ["w jednym miejscu.", "z AI.", "dla każdego.", "na całym świecie.", "bez instalacji."];
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  useEffect(() => {
    if (char < headlines[idx].length) {
      const t = setTimeout(() => { setText(headlines[idx].slice(0, char + 1)); setChar((c) => c + 1); }, 50);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setIdx((i) => (i + 1) % headlines.length); setChar(0); setText(""); }, 2800);
    return () => clearTimeout(t);
  }, [char, idx]);
  return (
    <section className="relative min-h-screen pt-20 pb-24 sm:pb-32 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 20%, oklch(0.65 0.15 240 / 0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, oklch(0.65 0.15 240 / 0.02) 0%, transparent 50%)'
      }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 mb-10 backdrop-blur-sm">
          <span className="pulse-dot"><span className="w-1.5 h-1.5 rounded-full bg-accent block" /></span>
          Globalna platforma edukacyjna nowej generacji
        </div>
        <h1 className="hero-premium text-white mb-6 leading-[0.95]">
          <span>Edukacja</span><br />
          <span className="text-accent">wzmacniana AI.</span>
        </h1>
        <p className="body-premium max-w-2xl mx-auto min-h-[1.8em]">
          Platforma edukacyjna nowej generacji. AI Tutor, egzaminy online, kursy, certyfikacja i zarządzanie — <span className="text-white/70">{text}<span className="type-cursor" /></span>
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/auth/teacher" onClick={(e) => { burstConfetti(e); addRipple(e); }}
            className="btn-primary magnetic-btn relative overflow-hidden">
            Rozpocznij za darmo <ArrowRight className="w-4 h-4"/>
          </Link>
          <Link to="/auth/student" className="btn-secondary magnetic-btn">
            <GraduationCap className="w-4 h-4"/>Wejdź PIN-em
          </Link>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-white/40">
          {[
            ["AI Tutor & AI Teacher", BrainCircuit], ["Multi-językowość", Globe2], ["Enterprise Security", Lock], ["99.98% uptime", Activity], ["Global CDN", Zap],
          ].map(([t, I]) => (
            <span key={t as string} className="inline-flex items-center gap-1.5"><I className="w-3.5 h-3.5 text-primary/50"/>{t as string}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS_DATA = [
  { v: 3752, l: "Przeprowadzonych egzaminów", s: "+" },
  { v: 829, l: "Aktywnych nauczycieli", s: "+" },
  { v: 36140, l: "Uczniów w systemie", s: "+" },
  { v: 99.98, l: "Dostępność", s: "%" },
  { v: 18920, l: "Certyfikatów wydanych", s: "+" },
];
function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let frame: number;
    const t0 = performance.now();
    const step = (now: number) => {
      const pct = Math.min((now - t0) / 2000, 1);
      const e = 1 - Math.pow(1 - pct, 3);
      setVal(target > 1000 ? Math.round(e * target) : parseFloat((e * target).toFixed(1)));
      if (pct < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);
  return <div ref={ref} className="tabular-nums font-bold">{val.toLocaleString()}{suffix}</div>;
}
function StatsMarquee() {
  return (
    <section className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {STATS_DATA.map((s, i) => (
            <div key={s.l} className="text-center reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                <CountUp target={s.v} suffix={s.s} />
              </div>
              <div className="text-xs text-white/40 mt-1.5 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "1", t: "Zarejestruj się", d: "2 minuty i gotowe — bez karty, bez zobowiązań. Plan Klasa jest za darmo.", icon: GraduationCap },
  { n: "2", t: "Dodaj klasę i uczniów", d: "Import z CSV, Vulcan lub Librus. Albo dodaj ręcznie — 3 kliknięcia.", icon: Users },
  { n: "3", t: "Stwórz egzamin z AI", d: "Wpisz temat, AI generuje pytania. Albo wczytaj zdjęcie — gotowe w 10 sekund.", icon: Sparkles },
  { n: "4", t: "Monitoruj i analizuj", d: "Wyniki na żywo, alerty o ściąganiu, certyfikaty PDF i raporty automatycznie.", icon: Activity },
];
function HowItWorks() {
  return (
    <section className="section-premium py-28 sm:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-16">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Jak to działa</span>
          <h2 className="display-lg mt-6">
            <TextReveal text="Zaczynasz w 2 minuty" />
          </h2>
          <p className="body-sm mt-4 max-w-lg mx-auto">Cztery proste kroki dzielą Cię od nowoczesnych egzaminów w Twojej szkole.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="reveal" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="card-premium rounded-2xl p-6 text-center hover:-translate-y-1">
                <div className="step-number mx-auto mb-4">{s.n}</div>
                <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 grid place-items-center mb-3">
                  <s.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm text-white/90">{s.t}</h3>
                <p className="mt-2 text-xs text-white/50 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── FEATURES ──── */
const FEATURE_CATEGORIES = [
  {
    id: "egzaminy", label: "Egzaminy", icon: FileText, gradient: "from-accent to-blue-500",
    items: [
      { title: "Tworzenie egzaminów", bullets: ["Pytania zamknięte, otwarte, kod, dopasowania", "Szablony z banku — 200+ gotowych zestawów", "Własne kategorie i tagi przedmiotowe", "Ustawienie czasu i progu zaliczenia", "Losowanie kolejności pytań"] },
      { title: "Sprawdziany błyskawiczne", bullets: ["Kartkówki z 3-5 pytaniami w 2 minuty", "Wyniki widoczne natychmiast po zakończeniu", "Wiele typów w jednym sprawdzianie", "Punkty cząstkowe i suma na żywo"] },
      { title: "Bank pytań", bullets: ["200+ pytań gotowych do użycia", "Import z Worda / PDF / Excel", "Współdzielenie z nauczycielami", "Filtry po przedmiocie i poziomie"] },
      { title: "Generator AI", bullets: ["Generuj pytania z 3 słów — AI robi resztę", "Wczytaj zdjęcie — AI odczytuje i tworzy test", "Dopasowanie poziomu trudności", "Generowanie wariantów dla klasy"] },
      { title: "Certyfikacja", bullets: ["Certyfikat PDF po egzaminie", "Unikalny numer seryjny", "Kod QR — weryfikacja online", "Pobierz i wydrukuj"] },
    ],
  },
  {
    id: "ai", label: "AI", icon: BrainCircuit, gradient: "from-violet-400 to-fuchsia-500",
    items: [
      { title: "Auto-ocena odpowiedzi", bullets: ["Pytania zamknięte — ocena w 0,3s", "AI ocenia otwarte — rozumie kontekst", "Korekta pisowni nie wpływa na ocenę", "Statystyki trudności pytań"] },
      { title: "Asystent AI nauczyciela", bullets: ["Rozmowa głosowa z asystentem", "Podpowiedzi przy układaniu pytań", "Analiza błędów klasy", "Personalizowane rekomendacje"] },
      { title: "Wykrywanie ściągania", bullets: ["AI analizuje ruchy myszy", "Wykrywanie opuszczania okna", "Analiza podobieństwa odpowiedzi", "Alerty w czasie rzeczywistym"] },
      { title: "Inteligentne rekomendacje", bullets: ["AI sugeruje pytania na podstawie wyników", "Personalizowane zestawy powtórkowe", "Automatyczny dobór trudności", "Rekomendacje materiałów"] },
    ],
  },
  {
    id: "analityka", label: "Analityka", icon: BarChart3, gradient: "from-emerald-400 to-teal-500",
    items: [
      { title: "Panel nauczyciela", bullets: ["KPI: egzaminy, średnia, alerty", "Wykresy wyników w czasie", "Ranking uczniów", "Filtry dat i przedmiotów"] },
      { title: "Monitoring na żywo", bullets: ["Postęp ucznia w czasie rzeczywistym", "Aktywni / ryzyko podział", "Zdarzenia i alerty", "Zatrzymanie egzaminu zdalnie"] },
      { title: "Raporty dla dyrekcji", bullets: ["Zbiorcze zestawienie klas", "Wskaźniki zdawalności", "Eksport PDF / Excel / CSV", "Dziennik audytu"] },
      { title: "Prognozy i trend", bullets: ["Wykresy predykcyjne", "Mapa cieplna wyników", "Alerty przy spadku wyników", "Raport z rekomendacjami AI"] },
    ],
  },
  {
    id: "zarzadzanie", label: "Zarządzanie", icon: Users, gradient: "from-amber-400 to-orange-500",
    items: [
      { title: "Klasy i grupy", bullets: ["Tworzenie klas z przedmiotem", "Import uczniów z CSV", "Podział na grupy", "Archiwizacja po roku"] },
      { title: "Dziennik i oceny", bullets: ["Oceny z egzaminów", "Średnia ważona", "Porównanie wizualne", "Eksport do Vulcan/Librus"] },
      { title: "Komunikacja", bullets: ["Wiadomości do uczniów/rodziców", "Wysyłka wyników e-mailem", "Ogłoszenia dla klasy/szkoły"] },
    ],
  },
  {
    id: "bezpieczenstwo", label: "Bezpieczeństwo", icon: Shield, gradient: "from-red-400 to-rose-500",
    items: [
      { title: "Ochrona danych", bullets: ["Szyfrowanie TLS 1.3", "AES-256 w spoczynku", "Serwery w UE", "Backupy co 6h"] },
      { title: "Zgodność z RODO", bullets: ["Umowa powierzenia danych", "Dziennik audytu", "Eksport danych na żądanie", "Usunięcie w 48h"] },
      { title: "Tryb egzaminacyjny", bullets: ["Pełny ekran — blokada kart", "Blokada skrótów (Ctrl+C, Alt+Tab)", "Zapis co 5s", "Monitoring aktywności"] },
      { title: "Kontrola dostępu", bullets: ["Role: admin, nauczyciel, uczeń", "Dostęp tylko do własnych klas", "2FA dla administratora", "Sesja wygasa po 15 min"] },
    ],
  },
  {
    id: "integracje", label: "Integracje", icon: Puzzle, gradient: "from-sky-400 to-indigo-500",
    items: [
      { title: "Dzienniki", bullets: ["Vulcan — synchronizacja ocen", "Librus — import i eksport", "Mobidziennik — wymiana danych"] },
      { title: "Działanie mobilne", bullets: ["Chrome / Edge / Firefox", "Bez instalacji", "Telefon, tablet, komputer", "Responsywny interfejs"] },
      { title: "Eksport i import", bullets: ["Import z Word, PDF, Excel", "Export do PDF, Excel, CSV", "API REST dla integracji"] },
    ],
  },
  {
    id: "szkola", label: "Dla szkoły", icon: School, gradient: "from-teal-400 to-emerald-500",
    items: [
      { title: "Organizacja roku", bullets: ["Kalendarz roku szkolnego", "Planowanie ferii i przerw", "Zarządzanie zastępstwami", "Dyżury nauczycielskie"] },
      { title: "Dokumentacja", bullets: ["Dzienniki lekcyjne online", "Arkusze ocen i świadectwa", "Druki MEN gotowe do wydruku", "Archiwum elektroniczne"] },
      { title: "Statystyki szkoły", bullets: ["Wskaźniki zdawalności", "Frekwencja klas", "Porównanie oddziałów", "Raporty dla organu prowadzącego"] },
      { title: "Komunikacja z rodzicami", bullets: ["Masowe powiadomienia e-mail", "Kontakt przez dziennik", "Wywieszki i ogłoszenia", "Konsultacje online"] },
    ],
  },
  {
    id: "wsparcie", label: "Wsparcie", icon: LifeBuoy, gradient: "from-accent to-sky-500",
    items: [
      { title: "Pomoc techniczna", bullets: ["Chat na żywo — odpowiedź w 2 min", "Baza wiedzy z video poradnikami", "Ticket system dla szkół", "Zdalna pomoc przez TeamViewer"] },
      { title: "Szkolenia", bullets: ["Webinary na żywo co tydzień", "Materiały video krok po kroku", "Certyfikat ukończenia szkolenia", "Szkolenia stacjonarne dla rady"] },
      { title: "Wdrożenie", bullets: ["Asysta przy pierwszym logowaniu", "Import danych z poprzedniego systemu", "Konfiguracja API i SSO", "Testy akceptacyjne z raportem"] },
    ],
  },
];

function FeaturesFlow() {
  const [active, setActive] = useState(FEATURE_CATEGORIES[0].id);
  const [key, setKey] = useState(0);
  const cat = FEATURE_CATEGORIES.find((c) => c.id === active) ?? FEATURE_CATEGORIES[0];
  const total = FEATURE_CATEGORIES.reduce((a, c) => a + c.items.reduce((b, i) => b + i.bullets.length, 0), 0);
  useEffect(() => setKey((k) => k + 1), [active]);
  return (
    <section id="funkcje" className="section-dark py-28 sm:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center max-w-2xl mx-auto mb-16">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Funkcje</span>
          <h2 className="display-lg mt-6">
            Ponad <span className="text-accent">{total}+</span> możliwości
          </h2>
          <p className="body-sm mt-4 max-w-lg mx-auto">Wszystko, czego potrzebuje nowoczesna szkoła — w jednej, spójnej platformie.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FEATURE_CATEGORIES.map((c) => {
            const a = active === c.id;
            return (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${a ? "bg-white text-black shadow-sm" : "text-white/40 hover:text-white hover:bg-white/[0.04]"}`}>
                <c.icon className="w-4 h-4"/>{c.label}
              </button>
            );
          })}
        </div>
        <div key={key} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ animation: "fadeUp 0.35s ease-out" }}>
          {cat.items.map((item, i) => (
            <div key={item.title} className="card-premium rounded-2xl p-6 hover:-translate-y-1 hover-glow stagger-item" style={{ transitionDelay: `${i * 0.04}s` }}>
              <h3 className="font-semibold text-sm text-white/90 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-violet-400"/>
                {item.title}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {item.bullets.map((b) => (
                  <li key={b} className="text-xs text-white/50 flex gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent/30 shrink-0 mt-0.5"/>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </section>
  );
}

/* ──── DEMO ──── */
const QUIZ_DATA = [
  { q: "Ile wynosi pole kwadratu o boku 5 cm?", opts: [["25 cm²", true], ["20 cm²", false], ["10 cm²", false], ["30 cm²", false]], explain: "Pole = 5 × 5 = 25 cm²" },
  { q: "Która liczba jest podzielna przez 3?", opts: [["124", false], ["327", true], ["401", false], ["550", false]], explain: "3+2+7=12, a 12 dzieli się przez 3" },
  { q: "Jaki jest pierwiastek kwadratowy z 144?", opts: [["10", false], ["14", false], ["12", true], ["16", false]], explain: "12 × 12 = 144" },
];
function DemoShowcase() {
  const [step, setStep] = useState<"start" | "q1" | "q2" | "q3" | "done">("start");
  const [answers, setAnswers] = useState<boolean[]>([false, false, false]);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const startTime = useRef(0);
  const qi = step === "q1" ? 0 : step === "q2" ? 1 : step === "q3" ? 2 : 0;
  const qData = step.startsWith("q") ? QUIZ_DATA[qi] : null;
  const score = answers.filter(Boolean).length;
  const pick = (isCorrect: boolean) => {
    const now = Date.now();
    if (startTime.current) setTotalTime((t) => t + (now - startTime.current));
    setCorrect(isCorrect);
    setShowExplain(true);
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[qi] = isCorrect;
      setAnswers(newAnswers);
      setCorrect(null);
      setShowExplain(false);
      if (step === "q1") setStep("q2");
      else if (step === "q2") setStep("q3");
      else if (step === "q3") { setStep("done"); burstConfetti({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as React.MouseEvent); }
      startTime.current = Date.now();
    }, 900);
  };
  const restart = () => { setStep("start"); setAnswers([false, false, false]); setCorrect(null); setShowExplain(false); setTotalTime(0); };
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="absolute top-1/2 -translate-y-1/2 -right-60 parallax-layer opacity-30" data-depth="7" style={{ animationDuration: "18s" }}>
        <div className="w-[500px] h-[500px] rounded-full glass-orb floating-1" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Demo na żywo</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Rozwiąż mini egzamin" /></h2>
          <p className="mt-3 text-white/40 text-sm">Zobacz jak działa platforma — 3 pytania z matematyki pod presją czasu.</p>
        </div>
        <div className="reveal-scale max-w-xl mx-auto">
          <div className="card-premium rounded-2xl p-8 sm:p-10 relative overflow-hidden">
            {step === "start" && (
              <div className="text-center" style={{ animation: "quizFade 0.4s ease-out" }}>
                <div className="w-20 h-20 mx-auto rounded-[24px] bg-gradient-to-br from-accent to-violet-500 grid place-items-center mb-6 shadow-lg floating-3"><Notebook className="w-8 h-8 text-black"/></div>
                <h3 className="text-2xl font-bold">Matematyka — Klasa 6</h3>
                <div className="mt-3 flex justify-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5"/>~30s na pytanie</span>
                  <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5"/>3 pytania</span>
                </div>
                <button onClick={() => { startTime.current = Date.now(); setStep("q1"); }} className="mt-8 btn-shine inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm bg-white text-black hover:bg-white/90 transition-all shadow-sm magnetic-btn">Rozpocznij quiz <Play className="w-4 h-4"/></button>
              </div>
            )}
            {qData && (step === "q1" || step === "q2" || step === "q3") && (
              <div key={step} style={{ animation: "quizFade 0.35s ease-out" }}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="w-2 h-2 rounded-full bg-accent"/>
                    Pytanie {qi + 1}/3
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/30 font-mono">
                    <Timer className="w-3 h-3"/> {totalTime > 0 ? `${Math.round(totalTime / 1000)}s` : "00s"}
                  </div>
                </div>
                <div className="flex gap-1 mb-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${i < qi ? "bg-accent" : i === qi && correct === true ? "bg-emerald-400" : i === qi && correct === false ? "bg-rose-400" : i === qi ? "bg-white/20" : ""}`}
                        style={{ width: i === qi ? "100%" : i < qi ? "100%" : "0%" }} />
                    </div>
                  ))}
                </div>
                <p className="text-lg sm:text-xl font-medium text-white/90 leading-relaxed">{qData.q}</p>
                <div className="mt-5 grid gap-2.5">
                  {qData.opts.map(([t, isC]) => {
                    const selected = correct !== null;
                    const isThis = selected && isC;
                    const isWrong = selected && correct === false && isC === false;
                    return (
                      <button key={t as string} disabled={selected}
                        onClick={() => pick(isC as boolean)}
                        className={`text-left px-5 py-3.5 rounded-xl border text-sm transition-all duration-300 ${selected ? (isThis ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200" : "border-white/[0.04] bg-white/[0.01] text-white/30") : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-accent/30 hover:bg-accent/[0.04] hover:text-white hover:scale-[1.01]"}`}>
                        <span className="flex items-center gap-3">
                          {selected && isThis && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {selected && !isThis && !isC && <X className="w-4 h-4 text-rose-400/50 shrink-0" />}
                          {t as string}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {showExplain && <div className="mt-4 text-xs text-accent/60 animate-pulse">{qData.explain}</div>}
              </div>
            )}
            {step === "done" && (
              <div className="text-center" style={{ animation: "quizFade 0.5s ease-out" }}>
                <div className={`w-24 h-24 mx-auto rounded-[28px] grid place-items-center mb-6 shadow-lg ${score === 3 ? "bg-gradient-to-br from-emerald-400 to-teal-500" : score >= 2 ? "bg-gradient-to-br from-accent to-blue-500" : "bg-gradient-to-br from-amber-400 to-orange-500"}`}
                  style={{ animation: "splashPulse 1.5s ease-in-out infinite" }}>
                  {score === 3 ? <Award className="w-10 h-10 text-black"/> : score >= 2 ? <Star className="w-10 h-10 text-black"/> : <Target className="w-10 h-10 text-black"/>}
                </div>
                <h3 className="text-2xl font-bold">{score === 3 ? "Perfect! 🎉" : score >= 2 ? "Dobra robota! 👏" : "Spróbuj jeszcze raz 💪"}</h3>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm">
                  <span className="text-white/40">Wynik:</span>
                  <span className={`font-bold font-mono ${score === 3 ? "text-emerald-300" : score >= 2 ? "text-accent" : "text-amber-300"}`}>{score}/3</span>
                </div>
                {totalTime > 0 && <p className="mt-2 text-xs text-white/30 font-mono">Czas: {Math.round(totalTime / 1000)}s</p>}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button onClick={restart} className="px-6 py-2.5 rounded-full text-sm font-medium border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all">Rozwiąż ponownie</button>
                  <Link to="/auth/teacher" className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-all shadow-sm">Załóż konto <ArrowRight className="w-4 h-4"/></Link>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 text-center text-xs text-white/30">W rzeczywistym egzaminie AI sprawdza odpowiedzi otwarte i wykrywa ściąganie.</div>
        </div>
        <style>{`@keyframes quizFade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div className="mt-16 reveal">
          <div className="card-premium rounded-2xl p-6 sm:p-8">
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2"><Radio className="w-5 h-5 text-accent"/> Monitoring na żywo</h3>
                <p className="mt-2 text-sm text-white/40">Widzisz postęp każdego ucznia w czasie rzeczywistym. AI wykrywa nieprawidłowości.</p>
                <ul className="mt-4 space-y-2 text-sm text-white/50">
                  {[["Postęp na żywo", "Widzisz kto skończył, a kto utknął"], ["Wykrywanie ściągania", "AI analizuje ruchy myszy i ostrzega"], ["Kontrola zdalna", "Możesz zatrzymać lub przedłużyć egzamin"]].map(([t, d]) => (
                    <li key={t} className="flex gap-2"><span className="grad-dot"/><div><span className="text-white/80">{t}</span> — {d}</div></li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-accent/5 to-fuchsia-400/5 rounded-3xl blur-xl" />
                <div className="relative rounded-2xl bg-[oklch(0.06_0.03_270)] border border-white/[0.06] overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"/><span className="w-2.5 h-2.5 rounded-full bg-amber-500/60"/><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"/>
                    <span className="ml-2 text-[9px] text-white/30 font-mono">Panel · monitoring</span>
                  </div>
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2"><span className="pulse-dot"><span className="w-1.5 h-1.5 rounded-full bg-accent block"/></span><span className="text-xs text-white/50">Na żywo: <span className="text-white font-medium">24 uczniów</span></span></div>
                      <span className="text-xs text-white/40">Średnia: <span className="text-accent font-mono">73%</span></span>
                    </div>
                    {[
                      { n: "Kowalski J.", p: 88, c: "#34d399" }, { n: "Nowak A.", p: 72, c: "#22d3ee" },
                      { n: "Wiśniewska Z.", p: 95, c: "#34d399" }, { n: "Kamiński P.", p: 45, c: "#fb7185" },
                      { n: "Lewandowska M.", p: 68, c: "#fbbf24" },
                    ].map((s) => (
                      <div key={s.n} className="flex items-center gap-3">
                        <span className="text-xs text-white/50 w-20 truncate">{s.n}</span>
                        <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full prog-fill" style={{ width: `${s.p}%`, background: s.c, opacity: 0.7 }} />
                        </div>
                        <span className="text-xs font-mono w-8 text-right text-white/50">{s.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── FOR WHOM ──── */
function ForWhomFlow() {
  const cards = [
    { icon: GraduationCap, accent: "from-accent to-blue-500", to: "/auth/student", title: "Uczeń", lines: ["Wejście PIN-em bez konta", "Czysty interfejs egzaminu", "Wynik widoczny od razu", "Certyfikat PDF + QR"] },
    { icon: Users, accent: "from-violet-400 to-fuchsia-500", to: "/auth/teacher", title: "Nauczyciel", lines: ["Pytania z AI w 3 sekundy", "Klasy, oceny, dziennik", "Monitoring na żywo", "Eksport PDF/Excel"] },
    { icon: ShieldCheck, accent: "from-amber-300 to-rose-400", to: "/auth/admin", title: "Dyrekcja", lines: ["Zatwierdzanie nauczycieli", "Raporty zbiorcze", "Audyt i statystyki", "Wgląd w wyniki szkoły"] },
    { icon: Heart, accent: "from-emerald-400 to-teal-500", to: "/auth/parent", title: "Rodzic", lines: ["Wgląd w wyniki dziecka", "Powiadomienia e-mail", "Raport postępów", "Konsultacje online"] },
  ];
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="absolute -left-40 top-1/3 parallax-layer" data-depth="6" style={{ animationDuration: "16s" }}>
        <div className="w-[400px] h-[400px] rounded-full glass-orb floating-2" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Dla kogo</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Cztery perspektywy, jedna platforma" /></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <Link key={c.title} to={c.to} className="reveal group card-premium rounded-2xl p-6 hover:-translate-y-1 stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.accent} grid place-items-center mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                <c.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold">{c.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/50">
                {c.lines.map((l) => (
                  <li key={l} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent/40 shrink-0 mt-0.5"/>{l}</li>
                ))}
              </ul>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/30 group-hover:text-accent transition-colors">
                Przejdź <ArrowUpRight className="w-3 h-3"/>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── COMPARISON ──── */
function ComparisonShowcase() {
  const rows = [
    { l: "Czas przygotowania egzaminu", t: "2–4 godziny", e: "3 minuty", icon: Timer },
    { l: "Sprawdzanie prac", t: "5–15 godzin", e: "0.3s (automat)", icon: FileText },
    { l: "Koszty druku / mies.", t: "200–500 zł", e: "0 zł", icon: DollarSign },
    { l: "Ryzyko ściągania", t: "Wysokie", e: "AI wykrywa", icon: ShieldCheck },
    { l: "Dostęp do wyników", t: "1–2 tygodnie", e: "Natychmiast", icon: Zap },
    { l: "Archiwizacja", t: "Segregator", e: "Chmura · RODO", icon: Database },
    { l: "Certyfikaty", t: "Ręcznie", e: "PDF + QR auto", icon: ScrollText },
    { l: "Analiza statystyk", t: "Excel ręcznie", e: "Automatyczne wykresy", icon: BarChart3 },
    { l: "Kontrola postępów", t: "Brak", e: "Na żywo · dashboard", icon: Activity },
    { l: "Migracja danych", t: "Godziny", e: "Import 1 klik", icon: Upload },
  ];
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Porównanie</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Tradycyjnie vs EduNex" /></h2>
        </div>
        <div className="reveal space-y-3">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2 text-xs text-white/40 font-medium">
            <span className="w-8 shrink-0" />
            <span className="flex-1">Obszar</span>
            <span className="w-28 sm:w-36 text-right text-rose-300/50">Tradycyjnie</span>
            <span className="w-28 sm:w-40 text-right text-accent/70">EduNex</span>
          </div>
          {rows.map((r, i) => (
              <div key={r.l} className="card-premium rounded-2xl px-4 sm:px-6 py-3 hover:-translate-y-[1px] transition-all cursor-default hover-glow stagger-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/10 to-violet-400/10 grid place-items-center shrink-0">
                  <r.icon className="w-3.5 h-3.5 text-accent/60" />
                </div>
                <span className="flex-1 text-white/70 text-xs sm:text-sm font-medium">{r.l}</span>
                <span className="w-28 sm:w-36 text-right text-rose-300/40 text-xs sm:text-sm flex items-center justify-end gap-1">
                  <X className="w-3 h-3 opacity-50 shrink-0"/>{r.t}
                </span>
                <span className="w-28 sm:w-40 text-right text-cyan-200/80 text-xs sm:text-sm flex items-center justify-end gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70 shrink-0"/>{r.e}
                </span>
              </div>
            </div>
          ))}
          <div className="text-center pt-2">
            <Link to="/auth/teacher" className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium text-accent/70 hover:text-cyan-200 transition-colors">
              Zobacz pełne porównanie <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── ACHIEVEMENTS ──── */
const ACHIEVEMENTS = [
  { icon: Trophy, value: "847+", label: "Egzaminów dziennie", color: "from-amber-400 to-orange-500" },
  { icon: School, value: "128+", label: "Aktywnych szkół", color: "from-accent to-blue-500" },
  { icon: Users, value: "2 340", label: "Nauczycieli online", color: "from-violet-400 to-fuchsia-500" },
  { icon: Award, value: "18 920", label: "Certyfikatów", color: "from-emerald-400 to-teal-500" },
  { icon: Heart, value: "97.8%", label: "Zadowolonych uczniów", color: "from-rose-400 to-pink-500" },
  { icon: Infinity, value: "99.98%", label: "Uptime SLA", color: "from-emerald-300 to-cyan-400" },
  { icon: Sparkles, value: "670+", label: "Funkcji i integracji", color: "from-sky-400 to-indigo-500" },
  { icon: Globe2, value: "16", label: "Województw", color: "from-teal-400 to-emerald-500" },
];
function AchievementsFlow() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 parallax-layer opacity-20" data-depth="4" style={{ animationDuration: "20s" }}>
        <div className="w-[700px] h-[700px] rounded-full glass-orb floating-3" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Osiągnięcia</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Platforma w liczbach" /></h2>
          <p className="mt-3 text-white/40 text-sm">Ponad 36 000 użytkowników i ciągle rośniemy.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((a, i) => (
              <div key={a.label} className={`reveal card-premium rounded-2xl p-6 text-center hover:-translate-y-1 hover-glow stagger-item ${i === 0 || i === 5 ? "sm:col-span-1" : ""}`} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${a.color} grid place-items-center mb-4`}>
                <a.icon className="w-6 h-6 text-black" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold">
                <span className={`bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.value}</span>
              </div>
              <div className="text-xs text-white/40 mt-1.5 font-medium">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── AI PLATFORM SHOWCASE ──── */
function AIPlatformFlow() {
  const capabilities = [
    { icon: BrainCircuit, title: "AI Tutor", desc: "24/7 asystent do nauki matematyki, języków, programowania", active: true },
    { icon: FileText, title: "AI Generator", desc: "Generuj pytania egzaminacyjne z tematu, zdjęcia lub ilustracji", active: true },
    { icon: Sparkles, title: "AI Ocenianie", desc: "Automatyczna ocena wypracowań i odpowiedzi otwartych", active: true },
    { icon: Code2, title: "Code Mentor", desc: "Nauka programowania z interaktywnym asystentem kodu", active: true },
    { icon: BarChart3, title: "Progress Analyzer", desc: "Analiza postępów z predykcją wyników AI", active: true },
    { icon: ShieldCheck, title: "Plagiarism Detector", desc: "Wykrywanie plagiatów i AI-generated content", active: false },
    { icon: BookOpen, title: "Course Generator", desc: "Automatyczne tworzenie kursów z dowolnego tematu", active: false },
    { icon: Presentation, title: "Presentation Maker", desc: "Generowanie prezentacji z AI w kilka sekund", active: false },
  ];

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center max-w-3xl mx-auto mb-16">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Platforma AI</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
            <TextReveal text="Potęga sztucznej inteligencji w edukacji" />
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-2xl mx-auto">
            EduNex wykorzystuje najnowsze modele AI do automatyzacji nauczania, oceniania i personalizacji ścieżek edukacyjnych.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((c, i) => (
            <div key={c.title} className={`reveal card-premium rounded-2xl p-5 hover:-translate-y-1 stagger-item transition-all ${!c.active ? 'opacity-50' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`w-10 h-10 rounded-xl grid place-items-center mb-4 ${c.active ? 'bg-gradient-to-br from-accent to-violet-500' : 'bg-white/[0.04]'}`}>
                <c.icon className={`w-5 h-5 ${c.active ? 'text-black' : 'text-white/30'}`} />
              </div>
              <h3 className="text-sm font-semibold text-white">{c.title}</h3>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{c.desc}</p>
              <div className="mt-3 flex items-center gap-1.5">
                {c.active ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-emerald-300/70 font-medium">Dostępne</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                    <span className="text-[10px] text-amber-300/50 font-medium">Wkrótce</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal-scale mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[Bot, BrainCircuit, Zap].map((Icon, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full border-2 border-[oklch(0.06_0.03_270)] grid place-items-center ${i === 0 ? 'bg-accent/20 text-accent' : i === 1 ? 'bg-violet-500/20 text-violet-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-medium text-white/80">Modele AI: Gemini 3.5 Flash · GPT-4o · Claude 3.5</div>
                <div className="text-xs text-white/30 mt-0.5">Własny gateway AI z automatycznym routingiem i fallbackiem</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>99.9% uptime</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>&lt;200ms latency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── INTERACTIVE AI DEMO ──── */
function AiDemoShowcase() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "ai", content: "Cześć! Jestem AI Tutor EduNex. Mogę pomóc w nauce matematyki, języków, programowania i nie tylko. O co chcesz zapytać?" }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const DEMO_RESPONSES: Record<string, string> = {
    matematyka: "Funkcja kwadratowa to f(x) = ax² + bx + c, gdzie a ≠ 0. Jej wykresem jest parabola. Wierzchołek ma współrzędne W(p, q), gdzie p = -b/(2a), q = -Δ/(4a). Δ = b² - 4ac nazywamy wyróżnikiem. Chcesz przećwiczyć na przykładzie?",
    angielski: "Sure! 'Present Perfect' używamy gdy mówimy o przeszłych wydarzeniach mających wpływ na teraźniejszość. Struktura: have/has + past participle. Przykład: 'I have visited Paris.' W przeciwieństwie do Past Simple, tu ważny jest efekt, nie czas wykonania.",
    programowanie: "W Pythonie list comprehension to elegancki sposób tworzenia list: [x**2 for x in range(10) if x % 2 == 0] zwróci kwadraty parzystych liczb od 0 do 9. To szybsze i czytelniejsze niż tradycyjna pętla for.",
    domyślne: "Świetne pytanie! Na platformie EduNex możesz korzystać z AI do generowania kursów, testów, analizy postępów i personalizowanych planów nauki. AI Code Mentor pomoże Ci w programowaniu, a AI Teacher w przygotowaniu materiałów.",
  };

  const handleSend = () => {
    const q = input.trim().toLowerCase();
    if (!q || busy) return;
    setMessages(prev => [...prev, { role: "user", content: input.trim() }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      const answer = Object.entries(DEMO_RESPONSES).find(([key]) => q.includes(key))?.[1] || DEMO_RESPONSES.domyślne;
      setMessages(prev => [...prev, { role: "ai", content: answer }]);
      setBusy(false);
    }, 1200);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <section id="ai-demo" className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">AI Demo</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Porozmawiaj z AI Tuturem" /></h2>
          <p className="mt-3 text-white/40 text-sm">Zadaj pytanie o matematykę, języki, programowanie — AI odpowiada w czasie rzeczywistym.</p>
        </div>
        <div className="reveal-scale max-w-2xl mx-auto">
          <div className="card-premium rounded-2xl overflow-hidden border border-white/[0.08]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-violet-500 grid place-items-center">
                  <BrainCircuit className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white/90">AI Tutor</div>
                  <div className="flex items-center gap-1.5">
                    <span className="status-dot online" />
                    <span className="text-[10px] text-white/30">Online · EduNex AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/30">
                <Sparkles className="w-3 h-3 text-accent" />Powered by Gemini
              </div>
            </div>
            <div ref={chatRef} className="h-72 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`} style={{ animation: "chatFade 0.3s ease-out" }}>
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-violet-500 grid place-items-center shrink-0 mt-0.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent/15 text-white/90 rounded-tr-md"
                      : "bg-white/[0.04] border border-white/[0.06] text-white/70 rounded-tl-md"
                  }`}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-white/[0.06] grid place-items-center shrink-0 mt-0.5">
                      <span className="text-[10px] text-white/50 font-medium">U</span>
                    </div>
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-violet-500 grid place-items-center shrink-0">
                    <BrainCircuit className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 p-3 border-t border-white/[0.06] bg-white/[0.01]">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Zapytaj AI o matematykę, angielski, programowanie..." className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/30 transition-all" />
              <button onClick={handleSend} disabled={busy || !input.trim()} className="p-2.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-30 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-white/30">
            <span>Zapytaj o: <button onClick={() => setInput("matematyka")} className="text-accent/70 hover:text-accent underline underline-offset-2">matematykę</button></span>
            <span><button onClick={() => setInput("angielski")} className="text-accent/70 hover:text-accent underline underline-offset-2">angielski</button></span>
            <span><button onClick={() => setInput("programowanie")} className="text-accent/70 hover:text-accent underline underline-offset-2">programowanie</button></span>
          </div>
        </div>
      </div>
      <style>{`@keyframes chatFade { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </section>
  );
}

/* ──── GLOBAL & ENTERPRISE ──── */
function GlobalEnterpriseFlow() {
  const regions = [
    { flag: "🇪🇺", name: "Europa", desc: "Serwery w UE, pełna zgodność z RODO i GDPR", count: "12 krajów" },
    { flag: "🇺🇸", name: "Ameryka Pn.", desc: "CDN w USA i Kanadzie, wsparcie EST timezone", count: "3 kraje" },
    { flag: "🇬🇧", name: "Wielka Brytania", desc: "Zgodność z UK GDPR, dedykowany serwer w Londynie", count: "UK" },
    { flag: "🌍", name: "Global", desc: "Global CDN, 30+ języków, multi-walutowość", count: "40+ krajów" },
  ];
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Globalna platforma</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Edukacja bez granic" /></h2>
          <p className="mt-3 text-white/40 text-sm">Działamy na całym świecie — z lokalną zgodnością i globalnym zasięgiem.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {regions.map((r) => (
            <div key={r.name} className="reveal card-premium rounded-2xl p-6 text-center hover:-translate-y-1 stagger-item">
              <div className="text-4xl mb-3">{r.flag}</div>
              <h3 className="font-semibold text-sm text-white/90">{r.name}</h3>
              <p className="mt-1 text-xs text-white/50">{r.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-medium">{r.count}</div>
            </div>
          ))}
        </div>
        <div className="reveal-scale">
          <div className="relative rounded-3xl bg-gradient-to-br from-accent/5 via-violet-950/20 to-fuchsia-950/20 border border-white/[0.06] p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full glass-orb floating-2 opacity-30" />
            <div className="relative">
              <Building2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Dla firm i <span className="shimmer">organizacji</span></h2>
              <p className="mt-3 text-white/40 text-sm max-w-2xl mx-auto">Enterprise-grade platforma dla korporacji, uczelni, jednostek rządowych i organizacji międzynarodowych. SSO, SLA 99.99%, dedykowany support, prywatne instancje.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50"><ShieldCheck className="w-4 h-4 text-accent"/>SSO & SAML</div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50"><Database className="w-4 h-4 text-accent"/>Private Cloud</div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50"><Users className="w-4 h-4 text-accent"/>Do 100k użytkowników</div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50"><Globe className="w-4 h-4 text-accent"/>Multi-region</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── INVESTOR SECTION ──── */
function InvestorFlow() {
  const metrics = [
    { label: "Active Users", value: "36k+", change: "+180% YoY" },
    { label: "Schools Onboarded", value: "128+", change: "+94% YoY" },
    { label: "Monthly Exams", value: "25k+", change: "+210% YoY" },
    { label: "Revenue Growth", value: "3.2x", change: "ARR 2025" },
  ];
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="absolute -right-40 top-1/3 parallax-layer opacity-20" data-depth="8">
        <div className="w-[500px] h-[500px] rounded-full glass-orb floating-1" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300/80 backdrop-blur-sm">Dla inwestorów</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Inwestuj w przyszłość edukacji" /></h2>
          <p className="mt-3 text-white/40 text-sm max-w-lg mx-auto">EduNex to jeden z najszybciej rozwijających się edTechów w Europie Środkowo-Wschodniej.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map((m) => (
            <div key={m.label} className="reveal card-premium rounded-2xl p-6 text-center hover:-translate-y-1 stagger-item">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">{m.value}</div>
              <div className="text-xs text-white/40 mt-1">{m.label}</div>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-emerald-300/80 font-mono">
                <TrendingUp className="w-3 h-3" />{m.change}
              </div>
            </div>
          ))}
        </div>
        <div className="reveal-scale max-w-2xl mx-auto">
          <div className="card-premium rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center shrink-0">
                <Handshake className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white/90">Dołącz do naszej misji</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">Budujemy globalną platformę edukacyjną AI nowej generacji. Szukamy partnerów strategicznych i inwestorów, którzy podzielają naszą wizję demokratyzacji edukacji na świecie.</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2 text-white/40"><Scale className="w-3.5 h-3.5 text-accent"/>Series A — Q4 2026</div>
                  <div className="flex items-center gap-2 text-white/40"><Users className="w-3.5 h-3.5 text-accent"/>Zespół: 24 osoby</div>
                  <div className="flex items-center gap-2 text-white/40"><Globe className="w-3.5 h-3.5 text-accent"/>TAM: $15B+</div>
                </div>
                <a href="#kontakt" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-amber-400/10 border border-amber-400/20 text-amber-300/80 hover:bg-amber-400/20 transition-all">
                  Skontaktuj się z nami <ArrowUpRight className="w-3.5 h-3.5"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── SECURITY ──── */
const SECURITY_ITEMS = [
  { icon: Lock, title: "Szyfrowanie TLS 1.3", desc: "Dane przesyłane z szyfrowaniem klasy bankowej. Certyfikat SSL automatycznie odnawiany.", color: "from-accent to-blue-500" },
  { icon: Shield, title: "Ochrona przed atakami", desc: "WAF, DDoS protection, rate limiting. Monitoring 24/7 przez zespół bezpieczeństwa.", color: "from-violet-400 to-fuchsia-500" },
  { icon: Fingerprint, title: "RODO — pełna zgodność", desc: "Umowa powierzenia danych, dziennik audytu, prawo do bycia zapomnianym.", color: "from-emerald-400 to-teal-500" },
  { icon: Database, title: "Backupy co 6h", desc: "Automatyczne kopie na 3 niezależnych serwerach w różnych lokalizacjach w UE.", color: "from-amber-400 to-orange-500" },
  { icon: ScanFace, title: "Tryb egzaminacyjny", desc: "Blokada skrótów, pełny ekran, monitoring aktywności, losowanie pytań.", color: "from-rose-400 to-pink-500" },
  { icon: Building2, title: "Serwery w Polsce", desc: "Dane przechowywane w Warszawie i Krakowie. Poza jurysdykcją CLOUD Act.", color: "from-sky-400 to-indigo-500" },
  { icon: Users, title: "Kontrola dostępu RBAC", desc: "Role: admin, dyrektor, nauczyciel. 2FA dla administratora, dostęp tylko do własnych zasobów.", color: "from-teal-400 to-emerald-500" },
  { icon: Radio, title: "Monitoring 24/7", desc: "Automatyczne skanowanie podatności, testy penetracyjne co kwartał, SOC.", color: "from-purple-400 to-violet-500" },
];
function SecurityFlow() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="absolute top-0 left-0 parallax-layer" data-depth="5" style={{ animationDuration: "14s" }}>
        <div className="w-[500px] h-[500px] rounded-full glass-orb floating-1" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Bezpieczeństwo</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Dane bezpieczne jak w banku" /></h2>
          <p className="mt-3 text-white/40 text-sm">Certyfikaty, szyfrowanie i procedury — wszystko, czego wymaga nowoczesna szkoła.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_ITEMS.map((it) => (
              <div key={it.title} className="reveal card-premium rounded-2xl p-6 hover:-translate-y-1 hover-glow">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${it.color} grid place-items-center mb-4`}><it.icon className="w-5 h-5 text-black"/></div>
              <h3 className="font-semibold text-sm text-white/90">{it.title}</h3>
              <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto">
          {[["Zgodność z MEN", Scale], ["RODO", Shield], ["ISO 27001", ShieldCheck], ["TLS 1.3", Lock], ["Serwery UE", Globe], ["99.98% SLA", Activity]].map(([n, I]) => (
            <div key={n as string} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all">
              <I className="w-5 h-5 text-accent/60"/><span className="text-[10px] text-white/50 text-center font-medium">{n as string}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── TESTIMONIALS ──── */
const TESTIMONIALS = [
  { n: "Katarzyna Mazurek", r: "Matematyka · XIV LO Warszawa", t: "Przed EduNex układałam testy w Wordzie. Teraz robię to dwa razy szybciej. Generator AI to game changer." },
  { n: "Paweł Górski", r: "Wicedyrektor · III LO Gdynia", t: "Monitoring na żywo to przełom — od razu widzę, kto potrzebuje pomocy, a kto ściąga." },
  { n: "Magdalena Adamczyk", r: "Polonistka · V LO Kraków", t: "Uczeń widzi wynik od razu i wie co poprawić. Oszczędzam 10 godzin tygodniowo na sprawdzaniu." },
  { n: "Tomasz Wróblewski", r: "Dyrektor · ZSE Poznań", t: "Spełnia wszystkie wymogi RODO. Koszty druku spadły o 90%, a wyniki są od razu w systemie." },
  { n: "Anna Jabłońska", r: "Anglistka · VI LO Wrocław", t: "Wczytuję zdjęcie kartkówki i w 10s mam 10 pytań. Uczniowie też to uwielbiają." },
  { n: "Robert Nowicki", r: "Informatyk · XIII LO Szczecin", t: "Integracja z Librusem działa bezbłędnie. Wdrożenie zajęło 2 dni, a nie 2 miesiące." },
];
function TestimonialsFlow() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const iv = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(iv); }, []);
  return (
    <section id="opinie" className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="reveal mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Opinie</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Co mówią nauczyciele" /></h2>
        </div>
        <div key={idx} style={{ animation: "testimonialFade 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
            <div className="text-5xl text-accent/30 font-serif leading-none mb-4 italic">"</div>
            <blockquote className="text-white/80 text-base sm:text-lg leading-relaxed">{TESTIMONIALS[idx].t}</blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-violet-500 grid place-items-center text-black font-semibold text-sm">{TESTIMONIALS[idx].n[0]}</div>
              <div className="text-left">
                <div className="font-medium text-sm text-white/90">{TESTIMONIALS[idx].n}</div>
                <div className="text-xs text-white/40">{TESTIMONIALS[idx].r}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "bg-white/60 w-6" : "bg-white/20 w-2 hover:bg-white/40"}`} />
          ))}
        </div>
      </div>
      <style>{`@keyframes testimonialFade { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </section>
  );
}

/* ──── PRICING ──── */
const PLANS = [
  { name: "Klasa", price: "0", sub: "na zawsze", lines: ["Do 35 uczniów", "Bank pytań 300+", "15 egzaminów/mies", "Podstawowe raporty", "Wsparcie e-mail"], feat: false },
  { name: "Korepetytor", price: "49", sub: "/mies", lines: ["Do 15 uczniów", "Bank pytań 500+", "30 egzaminów/mies", "Generator AI 50 zapytań", "Podstawowe raporty"], feat: false },
  { name: "Nauczyciel", price: "99", sub: "/mies", lines: ["Do 60 uczniów", "Bank pytań 3000+", "Egzaminy bez limitu", "Generator AI 200 zapytań", "Monitoring na żywo", "Wsparcie priorytetowe"], feat: false },
  { name: "Szkoła", price: "490", sub: "/mies", lines: ["Do 300 uczniów", "Bank pytań bez limitu", "Anti-cheat + monitoring", "API REST + integracje", "Panel dyrekcji", "Wsparcie 24/7"], feat: false },
  { name: "Szkoła Plus", price: "890", sub: "/mies", lines: ["Do 800 uczniów", "Bank pytań bez limitu", "Generaor AI bez limitu", "Anti-cheat + monitoring", "API REST + integracje", "Dedykowany opiekun", "Priorytetowy SLA"], feat: true },
  { name: "Dzielnica", price: "2990", sub: "/mies", lines: ["Do 5000 uczniów", "Wiele szkół w jednym panelu", "Raporty zbiorcze", "SLA 99,99%", "Dedykowany serwer", "Szkolenia stacjonarne"], feat: false },
  { name: "Kuratorium", price: "Indywidualnie", sub: "", lines: ["Nieograniczona liczba szkół", "Centralna baza danych", "Raporty wojewódzkie", "SLA 99,99%", "Dedykowany zespół wdrożeniowy"], feat: false },
];
function PricingFlow() {
  const navigate = useNavigate();
  const [yr, setYr] = useState(false);
  const yp = (p: string) => p === "0" || p === "Indywidualnie" ? p : String(Math.round(parseInt(p) * 0.8));
  const isContact = (p: string) => p === "Indywidualnie";
  const isFree = (p: string) => p === "0";
  return (
    <section id="cennik" className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Cennik</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Wybierz swój plan" /></h2>
          <p className="mt-3 text-white/40 text-sm">Płatność kartą, przelewem lub krypto · bez ukrytych kosztów</p>
        </div>
        <div className="reveal flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!yr ? "text-white" : "text-white/40"}`}>Miesięcznie</span>
          <button onClick={() => setYr((v) => !v)} className={`relative w-14 h-7 rounded-full transition-all ${yr ? "bg-accent shadow-[0_0_16px_oklch(0.65_0.15_240_/_0.4)]" : "bg-white/15 hover:bg-white/25"}`} role="switch" aria-checked={yr}>
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${yr ? "translate-x-7" : ""}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${yr ? "text-white" : "text-white/40"}`}>
            Rocznie <span className="ml-1.5 text-[10px] font-semibold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full">-20%</span>
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
          {PLANS.slice(0, 3).map((pl) => {
            const price = yr && !isFree(pl.price) && !isContact(pl.price) ? yp(pl.price) : pl.price;
            const isFeatured = pl.feat;
            return (
              <div key={pl.name} className={`relative rounded-2xl p-7 sm:p-8 flex flex-col h-full transition-all duration-300 ${isFeatured ? "bg-gradient-to-b from-white/[0.1] to-white/[0.03] border border-accent/40 shadow-[0_0_60px_-16px_oklch(0.65_0.15_240_/_0.3)] hover:-translate-y-1.5" : "bg-white/[0.06] border border-white/[0.1] hover:border-white/25 hover:bg-white/[0.09] hover:-translate-y-1"}`}>
                {isFeatured && (
                  <>
                    <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, oklch(0.65 0.15 240 / 0.3), transparent 40%, transparent 60%, oklch(0.65 0.15 240 / 0.3))", zIndex: -1 }} />
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-accent to-fuchsia-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-accent/30"><Star className="w-2.5 h-2.5 fill-white" />Popularny</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white/70">{pl.name}</h3>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-5xl sm:text-6xl font-bold tracking-tight ${isFeatured ? "text-accent" : "text-white"}`}>{price}</span>
                  <span className="text-sm text-white/40 font-medium">{yr && pl.sub === "/mies" ? "/rok" : pl.sub}</span>
                </div>
                {yr && !isFree(pl.price) && !isContact(pl.price) && (
                  <div className="mt-1 text-xs text-emerald-400/80 font-medium">{pl.price} zł/mies przy płatności rocznej</div>
                )}
                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <ul className="space-y-3.5 text-sm flex-1">
                    {pl.lines.map((l) => (
                      <li key={l} className="flex gap-3 items-start"><CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isFeatured ? "text-accent" : "text-white/30"}`} /><span className={isFeatured ? "text-white/85" : "text-white/60"}>{l}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  {isFree(pl.price) && <button onClick={() => navigate({ to: "/auth/teacher" })} className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-lg shadow-white/10 magnetic-btn">Rozpocznij za darmo</button>}
                  {!isFree(pl.price) && !isContact(pl.price) && <NexaPayCheckout planName={pl.name} amount={yr ? yp(pl.price) + " zł" : pl.price + " zł"} amountUsd={String(Math.round(parseInt(pl.price) / 4))} />}
                  {isContact(pl.price) && <button onClick={() => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })} className="w-full py-3 rounded-xl text-sm font-semibold border border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all magnetic-btn">Poproś o wycenę</button>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="reveal mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {PLANS.slice(3).map((pl) => {
            const price = yr && !isFree(pl.price) && !isContact(pl.price) ? yp(pl.price) : pl.price;
            return (
              <div key={pl.name} className="rounded-xl p-5 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 flex flex-col">
                <h3 className="text-sm font-semibold text-white/70">{pl.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{price}</span>
                  <span className="text-xs text-white/40">{yr && pl.sub === "/mies" ? "/rok" : pl.sub}</span>
                </div>
                <ul className="mt-3 space-y-2 text-xs flex-1">
                  {pl.lines.map((l) => (
                    <li key={l} className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/25" /><span className="text-white/55">{l}</span></li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  {!isContact(pl.price) && <NexaPayCheckout planName={pl.name} amount={yr ? yp(pl.price) + " zł" : pl.price + " zł"} amountUsd={String(Math.round(parseInt(pl.price) / 4))} />}
                  {isContact(pl.price) && <button onClick={() => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })} className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all magnetic-btn">Poproś o wycenę</button>}
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
const FAQ = [
  { q: "Czy uczniowie muszą zakładać konto?", a: "Nie. Uczeń wchodzi przeglądarką, wpisuje PIN i imię. Konto nie jest wymagane — zero rejestracji." },
  { q: "Czy mogę wgrać pytania z dokumentu?", a: "Tak. Wspieramy import z Worda, PDF oraz Excel. Możesz też wczytać zdjęcie — AI odczyta pytania automatycznie." },
  { q: "Jak wygląda umowa ze szkołą?", a: "Umowa powierzenia danych zgodna z RODO oraz faktura VAT. Proces do trzech dni roboczych." },
  { q: "Czy są zniżki dla placówek publicznych?", a: "Tak. Szkoły publiczne otrzymują 30% rabatu na plan Szkoła i 20% na plan Nauczyciel." },
  { q: "Jak szybko mogę zacząć?", a: "Rejestracja trwa 2 minuty. Dla planu Klasa — dostęp od razu, bez karty płatniczej." },
  { q: "Czy platforma działa na telefonie?", a: "Tak. EduNex działa w każdej przeglądarce — komputer, tablet, telefon. Bez instalacji." },
  { q: "Jak AI wykrywa ściąganie?", a: "AI analizuje ruchy myszy, wykrywa opuszczanie okna, porównuje odpowiedzi uczniów i wysyła alerty na żywo." },
  { q: "Czy mogę przenieść dane z innego systemu?", a: "Tak. Oferujemy bezpłatny import z Vulcan, Librusa, CSV i Excel. Nasi specjaliści pomogą." },
  { q: "Jakie są wymagania sprzętowe?", a: "Dowolne urządzenie z przeglądarką (Chrome, Edge, Firefox, Opera, Safari). Stabilne łącze do monitoringu." },
  { q: "Czy są szkolenia dla nauczycieli?", a: "Tak. Bezpłatne webinary co tydzień, baza wiedzy z video poradnikami oraz szkolenia stacjonarne." },
  { q: "Jak działa certyfikat po egzaminie?", a: "Po zakończeniu egzaminu generujemy PDF z unikalnym numerem seryjnym i kodem QR do weryfikacji online." },
  { q: "Czy mogę przetestować przed zakupem?", a: "Tak. Plan Klasa jest całkowicie darmowy — bez limitu czasu, bez karty, bez zobowiązań." },
];
function FAQFlow() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">FAQ</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Wątpliwości? Wyjaśniamy" /></h2>
        </div>
        <div className="reveal space-y-3">
          {FAQ.map((it, i) => (
            <div key={it.q} className="card-premium rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-white/[0.02]">
                <span className="text-sm font-medium text-white/80 pr-4">{it.q}</span>
                <span className={`shrink-0 w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] grid place-items-center transition-all duration-300 ${open === i ? "border-accent/30 text-accent rotate-45" : "text-white/30"}`}>
                  <Plus className="w-3.5 h-3.5"/>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-out ${open === i ? "max-h-48" : "max-h-0"}`}>
                <p className="px-6 pb-4 text-sm text-white/50 leading-relaxed">{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── BLOG + MARQUEE PARTNERS ──── */
const PARTNERS = [
  { n: "Vulcan", i: Computer, c: "from-blue-400 to-indigo-500" },
  { n: "Librus", i: Globe2, c: "from-emerald-400 to-teal-500" },
  { n: "Mobidziennik", i: Smartphone, c: "from-accent to-sky-500" },
  { n: "Office 365", i: LayoutDashboard, c: "from-orange-400 to-red-500" },
  { n: "Google Workspace", i: Search, c: "from-amber-400 to-yellow-500" },
  { n: "API REST", i: GitBranch, c: "from-violet-400 to-fuchsia-500" },
  { n: "Vulcan", i: Computer, c: "from-blue-400 to-indigo-500" },
  { n: "Librus", i: Globe2, c: "from-emerald-400 to-teal-500" },
  { n: "Mobidziennik", i: Smartphone, c: "from-accent to-sky-500" },
  { n: "Office 365", i: LayoutDashboard, c: "from-orange-400 to-red-500" },
  { n: "Google Workspace", i: Search, c: "from-amber-400 to-yellow-500" },
  { n: "API REST", i: GitBranch, c: "from-violet-400 to-fuchsia-500" },
];
function BlogFlow() {
  const posts = [
    { t: "Jak AI zmienia egzaminy w polskich szkołach", d: "Sztuczna inteligencja automatyzuje ocenianie i wykrywa ściąganie. Sprawdź, co zmieniło się w 2025 roku.", tag: "AI", time: "5 min" },
    { t: "RODO w szkole — poradnik dla dyrektora", d: "Wszystko o ochronie danych uczniowskich. Umowy, zgody, procedury krok po kroku.", tag: "RODO", time: "8 min" },
    { t: "Egzaminy online — jak przygotować szkołę", d: "Od wyboru platformy po pierwszy test. Praktyczny przewodnik dla nauczycieli.", tag: "Poradnik", time: "6 min" },
    { t: "Monitoring na żywo — jak działa w praktyce", d: "Zobacz jak nauczyciele wykorzystują monitoring do poprawy wyników swoich uczniów.", tag: "Funkcje", time: "4 min" },
  ];
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="absolute -right-40 top-1/2 parallax-layer opacity-30" data-depth="6" style={{ animationDuration: "17s" }}>
        <div className="w-[400px] h-[400px] rounded-full glass-orb floating-2" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm">Blog</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"><TextReveal text="Wiedza i aktualności" /></h2>
          <p className="mt-3 text-white/40 text-sm">Porady, aktualności i best practices dla nowoczesnej szkoły.</p>
        </div>
        <div className="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((p, i) => (
            <div key={p.t} className="card-premium rounded-2xl p-6 hover:-translate-y-1 hover-glow cursor-pointer stagger-item" style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent/80">{p.tag}</span>
                <span className="text-[10px] text-white/30">{p.time}</span>
              </div>
              <h3 className="font-semibold text-sm text-white/90">{p.t}</h3>
              <p className="mt-2 text-xs text-white/50 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-12">
          <span className="section-label block text-center mb-6 text-white/30">Zintegrowany z</span>
          <div className="overflow-hidden mask-image-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track">
              {PARTNERS.map((p, i) => (
                <div key={`${p.n}-${i}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs text-white/40 shrink-0">
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${p.c} grid place-items-center`}><p.i className="w-2.5 h-2.5 text-black"/></div>
                  {p.n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── MOBILE ──── */
function MobileCtaFlow() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal-scale">
          <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/30 via-violet-950/20 to-fuchsia-950/20 border border-white/[0.06] p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[300px] h-[300px] rounded-full glass-orb floating-3" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-[24px] bg-gradient-to-br from-accent to-violet-500 grid place-items-center mb-6 shadow-lg">
                <SmartphoneNfc className="w-8 h-8 text-black"/>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">EduNex w <span className="shimmer">Twojej kieszeni</span></h2>
              <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">Uczniowie wchodzą PIN-em z dowolnego telefonu. Nauczyciele zarządzają egzaminami z tabletu. Zero instalacji, zero problemów.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white/40"><Smartphone className="w-4 h-4"/>Android · wkrótce</div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white/40"><Monitor className="w-4 h-4"/>PWA · dostępne</div>
                <Link to="/auth/student" className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-all shadow-sm magnetic-btn">Wypróbuj <ArrowRight className="w-4 h-4"/></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── NEWSLETTER ──── */
function NewsletterFlow() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!email.trim()) return; setSent(true); toast.success("Zapisano do newslettera!"); setEmail(""); };
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        <div className="reveal">
          {sent ? (
            <div className="card-premium rounded-2xl p-8"><CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 floating-3"/><h2 className="text-2xl font-bold text-emerald-300">Jesteś zapisany!</h2><p className="mt-2 text-sm text-white/50">Nowości i porady — raz na dwa tygodnie.</p></div>
          ) : (
            <>
              <Bell className="w-7 h-7 text-accent mx-auto mb-4 floating-3"/>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Bądź na bieżąco</h2>
              <p className="mt-3 text-white/40 text-sm">Nowe funkcje, porady i aktualności — raz na dwa tygodnie, zero spamu.</p>
              <form onSubmit={onSubmit} className="mt-6 flex items-center gap-2 max-w-sm mx-auto">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Twój e-mail" className="flex-1 px-5 py-3 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/30 transition-all" />
                <button type="submit" className="btn-shine px-5 py-3 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-all shrink-0 magnetic-btn"><Send className="w-4 h-4"/></button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ──── CONTACT ──── */
function ContactFlow() {
  const submit = useServerFn(submitContact);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({ data: { name: String(fd.get("name") ?? ""), email: String(fd.get("email") ?? ""), subject: String(fd.get("subject") ?? "Zapytanie"), message: String(fd.get("message") ?? "") } });
      toast.success("Wiadomość wysłana. Odezwiemy się w 24h.");
      (e.target as HTMLFormElement).reset();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Błąd wysyłki"); } finally { setBusy(false); }
  };
  return (
    <section id="kontakt" className="relative py-28 sm:py-36 overflow-hidden section-premium">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal card-premium rounded-2xl p-6 sm:p-10">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <span className="section-label inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 backdrop-blur-sm mb-4">Kontakt</span>
              <h2 className="text-3xl font-bold tracking-tight">Napisz do nas</h2>
              <p className="mt-2 text-sm text-white/40">Odpowiadamy w 24h w dni robocze.</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex gap-3"><Mail className="w-5 h-5 text-accent shrink-0 mt-0.5"/><div><div className="text-white/80">kontakt@edunex.pl</div><div className="text-xs text-white/40">Sekretariat</div></div></li>
                <li className="flex gap-3"><Phone className="w-5 h-5 text-accent shrink-0 mt-0.5"/><div><div className="text-white/80">+48 22 100 12 34</div><div className="text-xs text-white/40">Pon–Pt, 8:00–16:00</div></div></li>
              </ul>
            </div>
            <form onSubmit={onSubmit} className="lg:col-span-3 grid sm:grid-cols-2 gap-3">
              <input name="name" required placeholder="Imię i nazwisko" className="sm:col-span-2 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/30 transition-all" />
              <input name="email" type="email" required placeholder="E-mail" className="sm:col-span-2 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/30 transition-all" />
              <input name="subject" placeholder="Temat" className="sm:col-span-2 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/30 transition-all" />
              <textarea name="message" rows={4} required placeholder="Treść wiadomości" className="sm:col-span-2 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/30 transition-all resize-none" />
              <div className="sm:col-span-2 flex items-center justify-between gap-3">
                <p className="text-xs text-white/40">Zgoda na kontakt zwrotny.</p>
                <button disabled={busy} type="submit" className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all relative magnetic-btn">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>} Wyślij
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──── STICKY CTA ──── */
function StickyCta() {
  const [visible, setVisible] = useState(false);
  const lastRef = useRef(0);
  useEffect(() => {
    const f = () => {
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = s / h;
      if (pct > 0.15 && pct < 0.85) {
        if (s > lastRef.current) setVisible(true);
        else setVisible(false);
      } else {
        setVisible(false);
      }
      lastRef.current = s;
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <div className={`sticky-cta-wrap ${visible ? "visible" : ""}`}>
      <div className="bg-black/70 backdrop-blur-2xl border-t border-white/[0.06] py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="pulse-dot"><span className="w-1.5 h-1.5 rounded-full bg-accent block" /></span>
            <span className="text-sm text-white/60 max-sm:hidden"><span className="text-white font-medium">Ponad 36 000</span> użytkowników już korzysta</span>
            <span className="text-sm text-white/60 sm:hidden">36 000+ użytkowników</span>
          </div>
          <Link to="/auth/teacher" className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-all shadow-sm shrink-0 magnetic-btn">
            Rozpocznij za darmo <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──── FOOTER ──── */
function FooterFlow() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const f = () => setShowTop(window.scrollY > 400); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <footer className="relative border-t border-white/[0.06] pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/50 grid place-items-center hover:bg-white/[0.1] hover:text-white transition-all backdrop-blur-md">
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-accent to-fuchsia-500 p-[1.5px] shadow-lg">
                <div className="w-full h-full rounded-[10px] bg-[oklch(0.06_0.03_270)] grid place-items-center">
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="url(#logoGradF)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <defs><linearGradient id="logoGradF" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#22d3ee"/><stop offset="50%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#f472b6"/></linearGradient></defs>
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <div className="font-semibold text-base">EduNex</div>
            </div>
            <p className="mt-3 text-xs text-white/40 leading-relaxed max-w-xs">Nowoczesna platforma egzaminacyjna dla polskich szkół. Zgodna z wytycznymi MEN i RODO.</p>
            <div className="mt-4 flex items-center gap-2">
              {[Github, MessageSquare].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] grid place-items-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"><Icon className="w-3.5 h-3.5"/></a>
              ))}
            </div>
          </div>
          <div>
            <div className="section-label text-white/30 mb-4">Platforma</div>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link to="/auth/student" className="hover:text-white transition-colors">Uczeń</Link></li>
              <li><Link to="/auth/teacher" className="hover:text-white transition-colors">Nauczyciel</Link></li>
              <li><a href="#funkcje" className="hover:text-white transition-colors">Funkcje</a></li>
              <li><a href="#cennik" className="hover:text-white transition-colors">Cennik</a></li>
            </ul>
          </div>
          <div>
            <div className="section-label text-white/30 mb-4">Dokumenty</div>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link to="/dokumenty" className="hover:text-white transition-colors">Regulamin</Link></li>
              <li><Link to="/dokumenty" className="hover:text-white transition-colors">Polityka prywatności</Link></li>
              <li><Link to="/dokumenty" className="hover:text-white transition-colors">RODO</Link></li>
            </ul>
          </div>
          <div>
            <div className="section-label text-white/30 mb-4">Kontakt</div>
            <ul className="space-y-2 text-sm text-white/40">
              <li>kontakt@edunex.pl</li>
              <li>+48 22 100 12 34</li>
            </ul>
            <div className="mt-4 text-[10px] text-white/20 font-mono">
              <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent"/>online</span>
              <span className="ml-2">v11.1</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.06] text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} EduNex · Projekt edukacyjny dla polskich szkół
        </div>
      </div>
    </footer>
  );
}

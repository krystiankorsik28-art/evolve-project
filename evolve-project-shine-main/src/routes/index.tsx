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
    <div className="min-h-screen selection:bg-cyan-400/30 selection:text-white overflow-x-clip antialiased">
      <Toaster theme="dark" />
      <CursorGlow />
      <SocialProof />
      <CookieBanner />
      <BackgroundFX />
      <NavBar />
      <Hero />
      <Stats />
      <Marquee />
      <BentoFeatures />
      <ForWhom />
      <Process />
      <Achievements />
      <Testimonials />
      <Pricing />
      <FAQSection />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
}

/* ──── Hooks ──── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    requestAnimationFrame(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight + 300) el.classList.add("revealed");
      });
    });
    setTimeout(() => els.forEach((el) => el.classList.add("revealed")), 800);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed") });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ──── Cursor ──── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => { if (ref.current) ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; };
    window.addEventListener("mousemove", f);
    return () => window.removeEventListener("mousemove", f);
  }, []);
  return <div ref={ref} className="cursor-glow hidden lg:block" />;
}

/* ──── Social proof ──── */
const SOCIAL_EVENTS = [
  { n: "Zofia Wiśniewska", a: "zakończyła egzamin", s: "92%", g: "emerald" },
  { n: "III LO w Gdyni", a: "dodała pytania", s: "+bank", g: "cyan" },
  { n: "Jakub Kamiński", a: "otrzymał certyfikat", s: "matematyka", g: "amber" },
  { n: "V LO Kraków", a: "rozpoczęła sprawdzian", s: "28 uczniów", g: "violet" },
  { n: "Hanna Lewandowska", a: "poprawiła wynik", s: "+14 pkt", g: "emerald" },
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
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4500 + Math.random() * 1500);
    };
    show();
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => { timeout = setTimeout(() => { show(); schedule(); }, 4000 + Math.random() * 6000); };
    schedule();
    return () => clearTimeout(timeout);
  }, []);
  const cm: Record<string, string> = { emerald: "#34d399", cyan: "#22d3ee", amber: "#fbbf24", violet: "#a78bfa" };
  return (
    <div className="fixed bottom-24 left-6 z-50 flex flex-col gap-2 max-lg:hidden">
      {items.map((ev) => (
        <div key={ev.id} className="rounded-xl border border-white/[0.06] bg-black/70 backdrop-blur-xl px-3.5 py-2.5 shadow-xl max-w-[280px]"
          style={{ animation: "slideInUp 0.35s ease-out" }}>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cm[ev.g] ?? "#888", boxShadow: `0 0 6px ${cm[ev.g] ?? "#888"}` }} />
            <div><span className="font-medium text-white/90">{ev.n}</span><span className="text-white/50"> {ev.a}</span> <span className="text-cyan-200/80 font-mono">{ev.s}</span></div>
          </div>
        </div>
      ))}
      <style>{`@keyframes slideInUp { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}

/* ──── Cookie ──── */
function CookieBanner() {
  const [v, setV] = useState(true);
  useEffect(() => { if (typeof window !== "undefined" && localStorage.getItem("cookies-ok")) setV(false); }, []);
  if (!v) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/50">Używamy plików cookie, aby zapewnić najlepsze doświadczenia.</p>
        <button onClick={() => { localStorage.setItem("cookies-ok", "1"); setV(false) }} className="px-4 py-2 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition shrink-0">Akceptuję</button>
      </div>
    </div>
  );
}

/* ──── Background ──── */
function BackgroundFX() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const shapes = el.querySelectorAll<HTMLElement>(".float-shape-bg");
    const f = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      shapes.forEach((s) => { const sp = parseFloat(s.dataset.speed || "1"); s.style.transform = `translate(${x * 16 * sp}px, ${y * 16 * sp}px)`; });
    };
    window.addEventListener("mousemove", f);
    return () => window.removeEventListener("mousemove", f);
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div data-speed="1.2" className="float-shape-bg absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-violet-500/15 blur-[140px] animate-float" />
      <div data-speed="0.8" className="float-shape-bg absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full bg-cyan-400/10 blur-[140px] animate-float" style={{ animationDelay: "2s" }} />
      <div data-speed="0.5" className="float-shape-bg absolute bottom-0 left-1/3 w-[320px] h-[320px] rounded-full bg-rose-500/10 blur-[120px] animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}

/* ──── Nav ──── */
const NAV = [
  ["#funkcje", "Funkcje"], ["#cennik", "Cennik"], ["#faq", "FAQ"], ["#kontakt", "Kontakt"],
];
function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const f = () => { setScrolled(window.scrollY > 10); const h = document.documentElement; setProgress(Math.min((window.scrollY / (h.scrollHeight - h.clientHeight)) * 100, 100)); };
    f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white/[0.03]">
        <div className="h-full bg-gradient-to-r from-cyan-400/60 via-violet-400/60 to-transparent scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-500 ${scrolled ? "border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-sm" : "border-transparent bg-transparent"}`}>
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <Mark />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold tracking-tight">EduNex</div>
              <div className="text-[8px] tracking-[0.2em] text-white/40 uppercase font-mono">Platforma egzaminacyjna</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {NAV.map(([h, l]) => (
              <a key={h} href={h} className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition">{l}</a>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link to="/auth/student" className="px-3 py-2 text-sm rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition inline-flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4"/>Uczeń
            </Link>
            <Link to="/auth/teacher" className="px-4 py-2 text-sm rounded-lg font-medium inline-flex items-center gap-1.5 text-black bg-white hover:bg-white/90 transition-all shadow-sm">
              Zaloguj <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
          <button onClick={() => setOpen(!open)} className="sm:hidden p-2 rounded-lg hover:bg-white/[0.04]" aria-label="Menu">
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
        {open && (
          <div className="lg:hidden mt-2 rounded-2xl border border-white/[0.06] bg-black/80 backdrop-blur-xl p-3 flex flex-col gap-1 text-sm">
            {["Funkcje", "Cennik", "FAQ", "Kontakt"].map((l, i) => (
              <a key={l} onClick={() => setOpen(false)} href={`#${["funkcje","cennik","faq","kontakt"][i]}`} className="px-3 py-2.5 rounded-lg hover:bg-white/[0.04]">{l}</a>
            ))}
            <div className="h-px bg-white/[0.06] my-1"/>
            <Link onClick={() => setOpen(false)} to="/auth/student" className="px-3 py-2.5 rounded-lg hover:bg-white/[0.04]">Uczeń</Link>
            <Link onClick={() => setOpen(false)} to="/auth/teacher" className="px-3 py-2.5 rounded-lg hover:bg-white/[0.04]">Nauczyciel</Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Mark() {
  return (
    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 p-[1.5px] shadow-sm">
      <div className="w-full h-full rounded-[10px] bg-[#07080d] grid place-items-center">
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/>
        </svg>
      </div>
    </div>
  );
}

/* ──── Hero ──── */
function Hero() {
  return (
    <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-white/60 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
          Platforma zatwierdzona przez MEN · 100% online
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[0.9] tracking-tight">
          <span className="text-white">Egzaminy bez<br/></span>
          <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">tarcia i papieru.</span>
        </h1>
        <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Certyfikowana platforma egzaminacyjna dla polskich szkół. Twórz sprawdziany, zarządzaj klasami i monitoruj wyniki na żywo — w jednym miejscu.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/auth/teacher" className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-white text-black hover:bg-white/90 transition-all shadow-sm">
            Rozpocznij za darmo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition"/>
          </Link>
          <Link to="/auth/student" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04] transition">
            <GraduationCap className="w-4 h-4"/>Wejdź PIN-em
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
          {[
            ["Zgodność z MEN", ShieldCheck], ["Serwery w UE", Globe2], ["RODO", Lock], ["99.98% uptime", Activity], ["Wsparcie 24/7", Zap],
          ].map(([t, I]) => (
            <span key={t as string} className="inline-flex items-center gap-1.5"><I className="w-3.5 h-3.5 text-cyan-400/60"/>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── Stats ──── */
const STATS = [
  { v: "3 752+", l: "Przeprowadzonych egzaminów", c: "from-cyan-400 to-blue-400" },
  { v: "829+", l: "Aktywnych nauczycieli", c: "from-violet-400 to-fuchsia-400" },
  { v: "36 140+", l: "Uczniów w systemie", c: "from-emerald-400 to-teal-400" },
  { v: "99.98%", l: "Dostępność", c: "from-amber-400 to-orange-400" },
  { v: "18 920+", l: "Certyfikatów wydanych", c: "from-emerald-400 to-cyan-400" },
];
function Stats() {
  return (
    <section className="border-y border-white/[0.05] py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {STATS.map((s, i) => (
          <div key={s.l} className="text-center reveal" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r ${s.c} bg-clip-text text-transparent tabular-nums`}>{s.v}</div>
            <div className="text-xs text-white/40 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──── Marquee ──── */
function Marquee() {
  const items = [
    "XIV LO im. Staszica · Warszawa", "III LO Marynarki Wojennej · Gdynia",
    "V LO im. Witkowskiego · Kraków", "XIII LO · Szczecin",
    "II LO im. Batorego · Warszawa", "I LO im. Kopernika · Łódź",
    "ZSE im. Skłodowskiej-Curie · Poznań", "VI LO im. Kochanowskiego · Wrocław",
  ];
  return (
    <section className="py-6 border-b border-white/[0.05]">
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex shrink-0 gap-12 animate-[marquee_40s_linear_infinite] pr-12">
          {[...items, ...items].map((s, i) => (
            <span key={i} className="text-sm text-white/30 whitespace-nowrap font-display">{s}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

/* ──── Features (6 categories, bento grid) ──── */
const FEATURE_CATEGORIES = [
  {
    id: "egzaminy", label: "Egzaminy", icon: FileText, gradient: "from-cyan-400 to-blue-500",
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
];

function BentoFeatures() {
  const [active, setActive] = useState(FEATURE_CATEGORIES[0].id);
  const [key, setKey] = useState(0);
  const cat = FEATURE_CATEGORIES.find((c) => c.id === active) ?? FEATURE_CATEGORIES[0];
  const total = FEATURE_CATEGORIES.reduce((a, c) => a + c.items.reduce((b, i) => b + i.bullets.length, 0), 0);
  useEffect(() => setKey((k) => k + 1), [active]);
  return (
    <section id="funkcje" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="reveal max-w-xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">Funkcje</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight">
            Ponad <span className="text-gradient-cyber">{total}+</span> możliwości
          </h2>
          <p className="mt-3 text-white/50 text-sm">Wszystko, czego potrzebuje nowoczesna szkoła.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FEATURE_CATEGORIES.map((c) => {
            const a = active === c.id;
            return (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${a ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white hover:bg-white/[0.04]"}`}>
                <c.icon className="w-4 h-4"/>{c.label}
              </button>
            );
          })}
        </div>
        <div key={key} style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.items.map((item, i) => (
              <div key={item.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200">
                <h3 className="font-display text-sm font-semibold text-white/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"/>
                  {item.title}
                </h3>
                <ul className="mt-2.5 space-y-1">
                  {item.bullets.map((b) => (
                    <li key={b} className="text-xs text-white/50 flex gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400/40 shrink-0 mt-0.5"/>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </section>
  );
}

/* ──── ForWhom ──── */
function ForWhom() {
  const cards = [
    { icon: GraduationCap, accent: "from-cyan-400 to-blue-500", to: "/auth/student", title: "Uczeń", lines: ["Wejście PIN-em lub kontem", "Czysty interfejs egzaminu", "Wynik widoczny od razu", "Certyfikat PDF + QR"] },
    { icon: Users, accent: "from-violet-400 to-fuchsia-500", to: "/auth/teacher", title: "Nauczyciel", lines: ["Pytania z AI w 3s", "Klasy, oceny, dziennik", "Monitoring na żywo", "Eksport PDF/Excel"] },
    { icon: Shield, accent: "from-amber-300 to-rose-400", to: "/auth/admin", title: "Dyrekcja", lines: ["Zatwierdzanie nauczycieli", "Raporty zbiorcze", "Audyt i statystyki"] },
    { icon: Heart, accent: "from-emerald-400 to-teal-500", to: "/auth/parent", title: "Rodzic", lines: ["Wgląd w wyniki dziecka", "Powiadomienia", "Raport postępów"] },
  ];
  return (
    <section className="py-20 sm:py-28 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="reveal text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">Dla kogo</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">Cztery perspektywy, jedna platforma</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((c, i) => (
            <Link key={c.title} to={c.to} className="reveal group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.accent} grid place-items-center shadow-sm`}>
                  <c.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-white/60">
                {c.lines.map((l) => (
                  <li key={l} className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 mt-0.5"/>{l}</li>
                ))}
              </ul>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/40 group-hover:text-cyan-300 transition-colors">
                Przejdź <ArrowUpRight className="w-3 h-3"/>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── Process ──── */
function Process() {
  const steps = [
    { n: "1", t: "Załóż klasę", d: "Wpisz przedmiot i listę uczniów. Import z CSV — 2 minuty." },
    { n: "2", t: "Przygotuj pytania", d: "Wpisz ręcznie, wybierz z banku lub wygeneruj AI z 3 słów." },
    { n: "3", t: "Generuj PIN", d: "6-cyfrowy kod. Uczeń wpisuje na dowolnym urządzeniu — bez logowania." },
    { n: "4", t: "Monitoruj", d: "Postęp na żywo. AI wykrywa podejrzane zachowania." },
    { n: "5", t: "Oceń i raportuj", d: "Auto-ocena w 0,3s. Eksport PDF/Excel jednym klikiem." },
  ];
  return (
    <section className="py-20 sm:py-28 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="reveal text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">Jak działa</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">Pięć kroków do gotowego egzaminu</h2>
          <p className="mt-3 text-white/50 text-sm">Od założenia klasy do raportu — w mniej niż 10 minut.</p>
        </div>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.n} className="reveal flex items-start gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.06] grid place-items-center text-sm font-semibold text-white/60 group-hover:text-cyan-300 group-hover:border-cyan-400/30 transition-all duration-200">
                {s.n}
              </div>
              <div className="flex-1 pt-1.5">
                <h3 className="font-display text-base font-semibold">{s.t}</h3>
                <p className="text-sm text-white/50 mt-1">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal mt-8 text-center">
          <Link to="/auth/teacher" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-white text-black hover:bg-white/90 transition-all shadow-sm">
            Wypróbuj teraz — 2 minuty <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──── Achievements ──── */
const ACHIEVEMENTS = [
  { icon: Trophy, value: "847+", label: "Egzaminów dziennie", color: "from-amber-400 to-orange-500" },
  { icon: School, value: "128+", label: "Aktywnych szkół", color: "from-cyan-400 to-blue-500" },
  { icon: Users, value: "2 340", label: "Nauczycieli online", color: "from-violet-400 to-fuchsia-500" },
  { icon: Award, value: "18 920", label: "Certyfikatów", color: "from-emerald-400 to-teal-500" },
  { icon: Heart, value: "97.8%", label: "Zadowolonych uczniów", color: "from-rose-400 to-pink-500" },
  { icon: Infinity, value: "99.98%", label: "Uptime SLA", color: "from-emerald-300 to-cyan-400" },
];
function Achievements() {
  return (
    <section className="py-20 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="reveal text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">Osiągnięcia</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">Platforma w <span className="text-gradient-cyber">liczbach</span></h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((a, i) => (
            <div key={a.label} className="reveal rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${a.color} grid place-items-center mb-3 shadow-sm`}>
                <a.icon className="w-5 h-5 text-black" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold tabular-nums">
                <span className={`bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.value}</span>
              </div>
              <div className="text-xs text-white/40 mt-1">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── Testimonials ──── */
const NOTES = [
  { n: "Katarzyna Mazurek", r: "Matematyka · XIV LO Warszawa", text: "Przed EduNex układałam testy w Wordzie. Teraz robię to dwa razy szybciej." },
  { n: "Paweł Górski", r: "Wicedyrektor · III LO Gdynia", text: "Monitoring na żywo to game changer — od razu widzę, kto potrzebuje pomocy." },
  { n: "Magdalena Adamczyk", r: "Polonistka · V LO Kraków", text: "Uczeń widzi wynik od razu i wie co poprawić. Oszczędzam 10 godzin tygodniowo." },
  { n: "Tomasz Wróblewski", r: "Dyrektor · ZSE Poznań", text: "Platforma spełnia wszystkie wymogi RODO. Koszty druku spadły o 90%." },
  { n: "Anna Jabłońska", r: "Anglistka · VI LO Wrocław", text: "Generator AI — wczytuję zdjęcie i w 10s mam 10 pytań. Niesamowite." },
];
function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const iv = setInterval(() => setIdx((i) => (i + 1) % NOTES.length), 5000); return () => clearInterval(iv); }, []);
  return (
    <section className="py-20 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="reveal mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">Opinie</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">Co mówią nauczyciele</h2>
        </div>
        <div key={idx} className="reveal rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8" style={{ animation: "fadeIn 0.4s ease-out" }}>
          <div className="text-4xl text-cyan-300/30 font-display leading-none mb-3">"</div>
          <blockquote className="text-white/80 text-base sm:text-lg leading-relaxed">{NOTES[idx].text}</blockquote>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-black font-semibold text-xs">{NOTES[idx].n[0]}</div>
            <div className="text-left">
              <div className="font-medium text-sm">{NOTES[idx].n}</div>
              <div className="text-xs text-white/40">{NOTES[idx].r}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-5">
          {NOTES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === idx ? "bg-white/60 w-5" : "bg-white/20 hover:bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── Pricing ──── */
const PLANS = [
  { name: "Klasa", price: "0", sub: "na zawsze", lines: ["Do 35 uczniów", "Bank pytań 300+", "15 egzaminów/mies", "Podstawowe raporty", "Wsparcie e-mail"], feat: false },
  { name: "Nauczyciel", price: "99", sub: "/mies", lines: ["Do 60 uczniów", "Bank pytań 3000+", "Egzaminy bez limitu", "Generator AI 200 zapytań", "Monitoring na żywo", "Wsparcie priorytetowe"], feat: false },
  { name: "Szkoła Plus", price: "890", sub: "/mies", lines: ["Do 800 uczniów", "Bank pytań bez limitu", "Anti-cheat + monitoring", "API REST", "Dedykowany opiekun", "Priorytetowy SLA"], feat: true },
  { name: "Kuratorium", price: "Indywidualnie", sub: "", lines: ["Nieograniczona liczba szkół", "Centralna baza", "Raporty wojewódzkie", "SLA 99,99%", "Dedykowany zespół"], feat: false },
];
function Pricing() {
  const navigate = useNavigate();
  const [yr, setYr] = useState(false);
  const yp = (p: string) => p === "0" || p === "Indywidualnie" ? p : String(Math.round(parseInt(p) * 0.8));
  const isContact = (p: string) => p === "Indywidualnie";
  const isFree = (p: string) => p === "0";
  return (
    <section id="cennik" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="reveal text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">Cennik</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">Wybierz swój plan</h2>
          <p className="mt-3 text-white/50 text-sm">Płatność kartą, przelewem lub krypto</p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm ${!yr ? "text-white font-medium" : "text-white/40"}`}>Miesięcznie</span>
          <button onClick={() => setYr((v) => !v)} className={`relative w-12 h-6 rounded-full transition-colors ${yr ? "bg-cyan-400" : "bg-white/20"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${yr ? "translate-x-6" : ""}`} />
          </button>
          <span className={`text-sm ${yr ? "text-white font-medium" : "text-white/40"}`}>
            Rocznie <span className="ml-1.5 text-[10px] font-mono bg-emerald-400/15 text-emerald-300 px-1.5 py-0.5 rounded">-20%</span>
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
          {PLANS.map((pl) => {
            const price = yr && !isFree(pl.price) && !isContact(pl.price) ? yp(pl.price) : pl.price;
            return (
              <div key={pl.name} className={`rounded-xl border flex flex-col transition-all duration-200 ${pl.feat ? "border-cyan-400/40 bg-cyan-950/30 shadow-sm" : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"}`}>
                {pl.feat && <div className="h-1 rounded-t-xl bg-gradient-to-r from-cyan-400 to-violet-400" />}
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold">{pl.name}</h3>
                    {pl.feat && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-300 text-[9px] font-semibold uppercase tracking-wider"><Star className="w-2.5 h-2.5"/>Popularny</span>}
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className={`font-display text-3xl font-bold ${pl.feat ? "text-cyan-300" : "text-white"}`}>{price}</span>
                    <span className="text-xs text-white/40">{yr && pl.sub === "/mies" ? "/rok" : pl.sub}</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-xs flex-1">
                    {pl.lines.map((l) => (
                      <li key={l} className="flex gap-2"><CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${pl.feat ? "text-cyan-300" : "text-white/30"}`} /><span className={pl.feat ? "text-white/80" : "text-white/50"}>{l}</span></li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    {isFree(pl.price) && <button onClick={() => navigate({ to: "/auth/teacher" })} className="w-full py-2.5 rounded-lg text-sm font-medium border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.04] transition">Rozpocznij za darmo</button>}
                    {!isFree(pl.price) && !isContact(pl.price) && <NexaPayCheckout planName={pl.name} amount={yr ? yp(pl.price) + " zł" : pl.price + " zł"} amountUsd={String(Math.round(parseInt(pl.price) / 4))} />}
                    {isContact(pl.price) && <button onClick={() => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })} className="w-full py-2.5 rounded-lg text-sm font-medium border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.04] transition">Poproś o wycenę</button>}
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
const FAQ = [
  { q: "Czy uczniowie muszą zakładać konto?", a: "Nie. Uczeń wchodzi przeglądarką, wpisuje PIN i imię. Konto nie jest wymagane." },
  { q: "Czy mogę wgrać pytania z dokumentu?", a: "Tak. Wspieramy import z Worda, PDF oraz Excel. Możesz też wczytać zdjęcie — AI odczyta pytania." },
  { q: "Jak wygląda umowa ze szkołą?", a: "Umowa powierzenia danych zgodna z RODO oraz faktura VAT. Proces do trzech dni." },
  { q: "Czy są zniżki dla placówek publicznych?", a: "Tak. Szkoły publiczne otrzymują 30% rabatu na plan Szkoła." },
  { q: "Jak szybko mogę zacząć?", a: "Rejestracja trwa 2 minuty. Dla planu Klasa — dostęp od razu." },
];
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-4">
        <div className="reveal text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono">FAQ</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">Wątpliwości — wyjaśnione</h2>
        </div>
        <div className="reveal space-y-2">
          {FAQ.map((it, i) => (
            <div key={it.q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition">
                <span className="text-sm font-medium text-white/80">{it.q}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full border border-white/[0.06] grid place-items-center transition-all duration-200 ${open === i ? "border-cyan-400/30 text-cyan-300 rotate-45" : "text-white/30"}`}>
                  <Plus className="w-3.5 h-3.5"/>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-40" : "max-h-0"}`}>
                <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──── Newsletter ──── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!email.trim()) return; setSent(true); toast.success("Zapisano do newslettera!"); setEmail(""); setTimeout(() => setSent(false), 3000); };
  return (
    <section className="py-16 border-t border-white/[0.05]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="reveal">
          {sent ? (
            <><CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" /><h2 className="font-display text-2xl font-semibold text-emerald-300">Jesteś zapisany!</h2></>
          ) : (
            <><Bell className="w-6 h-6 text-cyan-300 mx-auto mb-3" /><h2 className="font-display text-2xl font-semibold">Bądź na bieżąco</h2><p className="mt-2 text-sm text-white/50">Nowe funkcje i porady — raz na dwa tygodnie, zero spamu.</p></>
          )}
          {!sent && (
            <form onSubmit={onSubmit} className="mt-5 flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Twój e-mail" className="flex-1 w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.12] transition" />
              <button type="submit" className="px-4 py-2.5 rounded-lg font-medium text-sm bg-white text-black hover:bg-white/90 transition shrink-0"><Send className="w-4 h-4"/></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ──── Contact ──── */
function Contact() {
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
    <section id="kontakt" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.15em] text-white/50 font-mono mb-4">Kontakt</div>
            <h2 className="font-display text-2xl font-semibold">Napisz do nas</h2>
            <p className="mt-2 text-sm text-white/50">Odpowiadamy w 24h w dni robocze.</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3"><Mail className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5"/><div><div className="text-white/80">kontakt@edunex.pl</div><div className="text-xs text-white/40">Sekretariat</div></div></li>
              <li className="flex gap-3"><Phone className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5"/><div><div className="text-white/80">+48 22 100 12 34</div><div className="text-xs text-white/40">Pon–Pt, 8:00–16:00</div></div></li>
            </ul>
          </div>
          <form onSubmit={onSubmit} className="lg:col-span-3 grid sm:grid-cols-2 gap-3">
            <input name="name" required placeholder="Imię i nazwisko" className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.12] transition" />
            <input name="email" type="email" required placeholder="E-mail" className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.12] transition" />
            <input name="subject" placeholder="Temat" className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.12] transition" />
            <textarea name="message" rows={4} required placeholder="Treść wiadomości" className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.12] transition resize-none" />
            <div className="sm:col-span-2 flex items-center justify-between gap-3">
              <p className="text-xs text-white/40">Zgoda na kontakt zwrotny.</p>
              <button disabled={busy} type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white text-black hover:bg-white/90 disabled:opacity-50 transition">
                {busy ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>} Wyślij
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ──── Footer ──── */
function Footer() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const f = () => setShowTop(window.scrollY > 400); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <footer className="border-t border-white/[0.05] pt-12 pb-6">
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-9 h-9 rounded-lg bg-white/[0.08] border border-white/[0.06] text-white/60 grid place-items-center hover:bg-white/[0.12] hover:text-white transition-all">
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
      <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5"><Mark /><div className="font-display text-base font-semibold">EduNex</div></div>
          <p className="mt-3 text-xs text-white/40 leading-relaxed max-w-xs">Nowoczesna platforma egzaminacyjna dla polskich szkół. Zgodna z wytycznymi MEN.</p>
          <div className="mt-4 flex items-center gap-2">
            {[Github, MessageSquare].map((Icon, i) => (
              <a key={i} href="#" className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] grid place-items-center text-white/30 hover:text-white hover:bg-white/[0.08] transition"><Icon className="w-3.5 h-3.5"/></a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Platforma</div>
          <ul className="space-y-1.5 text-sm text-white/50">
            <li><Link to="/auth/student" className="hover:text-white transition">Uczeń</Link></li>
            <li><Link to="/auth/teacher" className="hover:text-white transition">Nauczyciel</Link></li>
            <li><a href="#funkcje" className="hover:text-white transition">Funkcje</a></li>
            <li><a href="#cennik" className="hover:text-white transition">Cennik</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Dokumenty</div>
          <ul className="space-y-1.5 text-sm text-white/50">
            <li><Link to="/dokumenty" className="hover:text-white transition">Regulamin</Link></li>
            <li><Link to="/dokumenty" className="hover:text-white transition">Polityka prywatności</Link></li>
            <li><Link to="/dokumenty" className="hover:text-white transition">RODO</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Kontakt</div>
          <ul className="space-y-1.5 text-sm text-white/50">
            <li>kontakt@edunex.pl</li>
            <li>+48 22 100 12 34</li>
          </ul>
          <div className="mt-3 text-[10px] text-white/20 font-mono">
            <span className="inline-flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400"/>online</span>
            <span className="ml-2">v6.0</span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-white/[0.05] text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} EduNex · Projekt edukacyjny dla polskich szkół
      </div>
    </footer>
  );
}

/* ──── SectionHead (reusable) not used — sections are self-contained ──── */



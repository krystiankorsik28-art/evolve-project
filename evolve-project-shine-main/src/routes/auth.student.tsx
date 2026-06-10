import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  GraduationCap, ArrowLeft, Loader2, User, KeyRound,
  CheckCircle2, AlertTriangle, Mail, Lock, Eye,
  EyeOff, LogIn, Sparkles, BookOpen, MonitorPlay, Save,
} from "lucide-react";
import { toast } from "sonner";
import { studentPinLogin } from "@/lib/student-auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/student")({
  component: StudentLogin,
  head: () => ({ meta: [{ title: "Uczeń — logowanie | EduNex" }] }),
});

type AuthTab = "login" | "register" | "pin";

const STUDENT_FEATURES = [
  { icon: BookOpen, title: "Różnorodne pytania", desc: "11 typów zadań w jednym interfejsie" },
  { icon: MonitorPlay, title: "Monitoring ekranu", desc: "Bezpieczny tryb egzaminacyjny" },
  { icon: Save, title: "Autozapis", desc: "Odpowiedzi zapisywane co 0,5 s" },
  { icon: Sparkles, title: "Konto ucznia", desc: "Historia egzaminów i wyniki" },
];

function StudentLogin() {
  const navigate = useNavigate();
  const login = useServerFn(studentPinLogin);
  const [tab, setTab] = useState<AuthTab>("pin");

  // account login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  // PIN flow state
  const [pinStep, setPinStep] = useState<1 | 2>(1);
  const [pinFirstName, setPinFirstName] = useState("");
  const [pinLastName, setPinLastName] = useState("");
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [pinLoading, setPinLoading] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const pin = pinDigits.join("");
  const namesReady = pinFirstName.trim().length >= 2 && pinLastName.trim().length >= 2;
  const pinReady = namesReady && pin.length === 6;

  useEffect(() => { if (pinStep === 2) refs.current[0]?.focus(); }, [pinStep]);

  // auto-submit PIN when all 6 digits entered
  useEffect(() => {
    if (pinReady && pinStep === 2 && !pinLoading) {
      const submitPin = async () => {
        setPinLoading(true);
        try {
          const timeout = new Promise<never>((_, rej) =>
            setTimeout(() => rej(new Error("Serwer nie odpowiedział w 15s.")), 15000),
          );
          const res = await Promise.race([login({ data: { first_name: pinFirstName.trim(), last_name: pinLastName.trim(), pin } }), timeout]);
          sessionStorage.setItem("edunex_student", JSON.stringify({ ...res }));
          toast.success(`Witaj, ${pinFirstName}!`);
          await navigate({ to: "/student/exam/$attemptId", params: { attemptId: res.attempt_id } });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Błąd");
          setPinDigits(["","","","","",""]);
          refs.current[0]?.focus();
          setPinLoading(false);
        }
      };
      submitPin();
    }
  }, [pin]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...pinDigits]; next[i] = d; setPinDigits(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length > 0) {
      e.preventDefault();
      const next = text.split("").concat(Array(6 - text.length).fill(""));
      setPinDigits(next.slice(0, 6));
      const last = Math.min(text.length, 5);
      refs.current[last]?.focus();
    }
  };

  const fireConfetti = () => {
    const c = document.createElement("canvas");
    c.className = "fixed inset-0 pointer-events-none z-50";
    c.style.width = "100vw"; c.style.height = "100vh";
    document.body.appendChild(c);
    const ctx = c.getContext("2d")!;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const colors = ["#22d3ee","#67e8f9","#34d399","#fbbf24","#f472b6","#818cf8"];
    const pieces: { x: number; y: number; vx: number; vy: number; w: number; h: number; c: string; r: number }[] = [];
    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5,
        vx: (Math.random() - 0.5) * 6, vy: Math.random() * 3 + 2,
        w: Math.random() * 8 + 4, h: Math.random() * 4 + 2, c: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 360,
      });
    }
    let frame = 0;
    const anim = () => {
      frame++;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of pieces) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += 5;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.r * Math.PI) / 180);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (frame < 200) requestAnimationFrame(anim);
      else c.remove();
    };
    anim();
  };

  const onAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error("Brak sesji po zalogowaniu");
        fireConfetti();
        toast.custom(() => (
          <div className="flex items-center gap-4 bg-[#0d1f40] border border-cyan-400/30 rounded-2xl px-5 py-4 shadow-[0_12px_40px_-12px_rgba(34,211,238,0.4)] backdrop-blur-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 grid place-items-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">Zalogowano pomyślnie</div>
              <div className="text-sm text-cyan-200/70">Panel ucznia EduNex</div>
            </div>
          </div>
        ), { duration: 2000 });
        navigate({ to: "/student/dashboard" });
        return;
      } else {
        if (!firstName.trim() || !lastName.trim()) throw new Error("Podaj imię i nazwisko");
        if (password.length < 6) throw new Error("Hasło musi mieć min. 6 znaków");
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/student`,
            data: { first_name: firstName, last_name: lastName, display_name: `${firstName} ${lastName}`, role: "student" },
          },
        });
        if (error) throw error;
        if (!data.user) throw new Error("Nie udało się utworzyć konta");
        toast.success("Konto utworzone! Sprawdź e-mail, aby potwierdzić. Możesz też od razu użyć kodu PIN.");
        setTab("pin");
        setPassword("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd");
    } finally { setLoading(false); }
  };

  const onForgotPassword = async () => {
    if (!email.trim()) return toast.error("Wpisz e-mail");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/student` });
      if (error) throw error;
      toast.success("Link resetujący wysłany.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd");
    } finally { setLoading(false); }
  };

  const onPinContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namesReady) { toast.error("Wpisz imię i nazwisko (min. 2 znaki)"); return; }
    setPinStep(2);
  };

  const onPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinReady) { toast.error("Wpisz pełny 6-cyfrowy PIN"); return; }
    setPinLoading(true);
    try {
      const timeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("Serwer nie odpowiedział w 15s.")), 15000),
      );
      const res = await Promise.race([login({ data: { first_name: pinFirstName.trim(), last_name: pinLastName.trim(), pin } }), timeout]);
      sessionStorage.setItem("edunex_student", JSON.stringify({ ...res }));
      toast.success(`Witaj, ${pinFirstName}!`);
      await navigate({ to: "/student/exam/$attemptId", params: { attemptId: res.attempt_id } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd";
      toast.error(msg);
      setPinLoading(false);
    }
  };

  const tabs: { key: AuthTab; label: string }[] = [
    { key: "login", label: "Zaloguj się" },
    { key: "register", label: "Zarejestruj się" },
    { key: "pin", label: "Kod PIN" },
  ];

  return (
    <div className="min-h-screen bg-[#05080f] text-white flex relative overflow-hidden">
      <Toaster theme="dark" />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-8%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-cyan-500/15 via-teal-400/10 to-transparent blur-[160px] animate-[authFloat_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-teal-500/12 to-emerald-400/5 blur-[140px] animate-[authFloat_30s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[25%] left-[18%] w-1.5 h-1.5 rounded-full bg-cyan-400/30 animate-[authFloat_8s_ease-in-out_infinite]" />
        <div className="absolute top-[55%] right-[28%] w-2 h-2 rounded-full bg-teal-400/20 animate-[authFloat_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[35%] left-[35%] w-1 h-1 rounded-full bg-cyan-300/25 animate-[authFloat_10s_ease-in-out_infinite]" />
      </div>

      {/* Left panel */}
      <aside className="hidden lg:flex w-[440px] flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a1a]/90 via-[#0a1818]/70 to-[#05080f]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[length:48px_48px]" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors w-fit"><ArrowLeft className="w-4 h-4"/>Strona główna</Link>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 grid place-items-center shadow-xl shadow-cyan-400/20">
                <GraduationCap className="w-7 h-7 text-[#05080f]"/>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase">Panel</div>
                <div className="text-xl font-display">Uczeń</div>
              </div>
            </div>
            <h2 className="text-2xl font-display leading-tight text-white/90">Twoje konto, Twoje wyniki.</h2>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">Załóż konto, aby śledzić historię egzaminów. Możesz też użyć kodu PIN bez logowania.</p>
            <div className="mt-8 space-y-2.5">
              {STUDENT_FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-teal-400/20 grid place-items-center">
                    <f.icon className="w-4 h-4 text-cyan-300/80"/>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">{f.title}</div>
                    <div className="text-[11px] text-white/40">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-white/50 italic">„Egzamin działał idealnie — wynik od razu, a konto pozwala wrócić do historii."</p>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 grid place-items-center text-[7px] text-[#05080f] font-bold">K</div>
                <span className="text-white/60">Kuba · II LO Warszawa</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/15 font-mono tracking-wider">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse"/>28 410 uczniów · 2 847+ egzaminów</span>
          </div>
        </div>
      </aside>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4"/>Powrót</Link>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setPinStep(1); setPinDigits(["","","","","",""]); }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  tab === t.key
                    ? "bg-gradient-to-r from-cyan-400 to-teal-400 text-[#05080f] shadow-md"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Account login form */}
          {(tab === "login" || tab === "register") && (
            <div className="animate-[fadeSlideIn_0.35s_ease-out]">
              <h1 className="text-2xl font-display">
                {tab === "login" ? "Zaloguj się" : "Załóż konto"}
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {tab === "login" ? "Użyj e-maila i hasła." : "Wypełnij dane, aby założyć konto."}
              </p>
              <form onSubmit={onAccountSubmit} className="mt-6 space-y-4">
                {tab === "register" && (
                  <>
                    <Field label="Imię">
                      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jan" autoComplete="given-name" className={inp}/>
                    </Field>
                    <Field label="Nazwisko">
                      <input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Kowalski" autoComplete="family-name" className={inp}/>
                    </Field>
                  </>
                )}
                <Field label="E-mail">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jan@szkola.pl" autoComplete={tab === "login" ? "email" : "email"} className={`${inp} pl-10`}/>
                  </div>
                </Field>
                <Field label="Hasło">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••" autoComplete={tab === "login" ? "current-password" : "new-password"} className={`${inp} pl-10 pr-10`}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </Field>
                <button className="relative w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-[#05080f] font-medium text-sm tracking-wide transition-all disabled:opacity-40 inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 overflow-hidden group" disabled={loading}>
                  <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <LogIn className="w-4 h-4"/>}
                  {loading ? (tab === "login" ? "Logowanie..." : "Rejestracja...") : (tab === "login" ? "Zaloguj się" : "Utwórz konto")}
                </button>
                {tab === "login" && (
                  <button type="button" onClick={onForgotPassword} className="w-full text-xs text-white/40 hover:text-white/70 transition-colors">Nie pamiętasz hasła?</button>
                )}
              </form>
            </div>
          )}

          {/* PIN flow */}
          {tab === "pin" && (
            <div className="animate-[fadeSlideIn_0.35s_ease-out]">
              {pinStep === 1 && (
                <div>
                  <h1 className="text-2xl font-display">Dołącz do egzaminu</h1>
                  <p className="text-white/40 text-sm mt-1">Podaj swoje imię i nazwisko — bez konta.</p>
                  <form onSubmit={onPinContinue} className="mt-6 space-y-4">
                    <Field label="Imię">
                      <input value={pinFirstName} onChange={(e) => setPinFirstName(e.target.value)} required placeholder="Jan" autoComplete="given-name" className={inp}/>
                    </Field>
                    <Field label="Nazwisko">
                      <input value={pinLastName} onChange={(e) => setPinLastName(e.target.value)} required placeholder="Kowalski" autoComplete="family-name" className={inp}/>
                    </Field>
                    <button disabled={!namesReady} className="relative w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-[#05080f] font-medium text-sm tracking-wide transition-all disabled:opacity-40 inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 overflow-hidden group">
                      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      Kontynuuj
                    </button>
                  </form>
                  <div className="mt-4 flex items-start gap-2 text-xs text-white/40 bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-300/60"/>
                    <span>Dane są widoczne dla nauczyciela. Wpisz prawdziwe imię i nazwisko.</span>
                  </div>
                </div>
              )}
              {pinStep === 2 && (
                <div>
                  <h1 className="text-2xl font-display">Kod PIN</h1>
                  <p className="text-white/40 text-sm mt-1">PIN od nauczyciela — 6 cyfr.</p>
                  <form onSubmit={onPinSubmit} className="mt-6 space-y-5">
                    <div onPaste={handlePaste} className="flex justify-between gap-2">
                      {pinDigits.map((d, i) => (
                        <input key={i} ref={(el) => { refs.current[i] = el; }} inputMode="numeric" maxLength={1} value={d}
                          onChange={(e) => setDigit(i, e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
                          className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-mono bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none focus:border-cyan-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_-8px_rgba(34,211,238,0.15)] transition-all"
                        />
                      ))}
                    </div>
                    <button disabled={!pinReady || pinLoading} className="relative w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-[#05080f] font-medium text-sm tracking-wide transition-all disabled:opacity-40 inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 overflow-hidden group">
                      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      {pinLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <KeyRound className="w-4 h-4"/>}
                      {pinLoading ? "Sprawdzam..." : "Rozpocznij egzamin"}
                    </button>
                    <button type="button" onClick={() => { setPinStep(1); setPinDigits(["","","","","",""]); }} className="w-full text-xs text-white/40 hover:text-white/70 transition-colors">← Wstecz</button>
                  </form>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/30">
            <Link to="/auth/teacher" className="hover:text-white/60 transition-colors">Nauczyciel →</Link>
            <Link to="/auth/admin" className="hover:text-white/60 transition-colors">Admin →</Link>
            <Link to="/auth/parent" className="hover:text-white/60 transition-colors">Rodzic →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full h-11 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none transition-all text-white text-sm placeholder:text-white/20 focus:border-cyan-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_-8px_rgba(34,211,238,0.15)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/40 mb-1.5 tracking-wide">{label}</div>
      {children}
    </label>
  );
}

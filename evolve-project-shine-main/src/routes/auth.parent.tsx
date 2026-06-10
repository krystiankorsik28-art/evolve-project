import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart, ArrowLeft, Loader2, Mail, Lock, User, CheckCircle2,
  ShieldCheck, Eye, EyeOff, BarChart3, Bell, LogIn,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/parent")({
  component: ParentLogin,
  head: () => ({ meta: [{ title: "Rodzic — panel | EduNex" }] }),
});

const PARENT_FEATURES = [
  { icon: Eye, title: "Wyniki dziecka", desc: "Wgląd w egzaminy i sprawdziany" },
  { icon: Bell, title: "Powiadomienia", desc: "Alerty o nowych ocenach i testach" },
  { icon: BarChart3, title: "Postępy", desc: "Wykresy osiągnięć w czasie" },
  { icon: ShieldCheck, title: "Bezpieczeństwo", desc: "Dane widoczne tylko dla Ciebie" },
];

function strength(s: string): { level: number; label: string; cls: string } {
  if (!s) return { level: 0, label: "", cls: "" };
  let score = 0;
  if (s.length >= 8) score++; if (s.length >= 12) score++;
  if (/[A-Z]/.test(s)) score++; if (/[0-9]/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  if (score <= 1) return { level: 1, label: "Słabe", cls: "pw-weak" };
  if (score === 2) return { level: 2, label: "Średnie", cls: "pw-fair" };
  if (score <= 3) return { level: 3, label: "Dobre", cls: "pw-good" };
  return { level: 4, label: "Silne", cls: "pw-strong" };
}

function ParentLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error("Brak sesji");
        toast.custom(() => (
          <div className="flex items-center gap-4 bg-[#0d1f40] border border-emerald-400/30 rounded-2xl px-5 py-4 shadow-[0_12px_40px_-12px_rgba(52,211,153,0.4)] backdrop-blur-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-amber-500 grid place-items-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">Witaj w panelu rodzica</div>
              <div className="text-sm text-emerald-200/70">EduNex dla rodziców</div>
            </div>
          </div>
        ), { duration: 2000 });
        window.location.assign("/parent");
        return;
      } else {
        if (!firstName.trim() || !lastName.trim()) throw new Error("Podaj imię i nazwisko");
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/parent`,
            data: { first_name: firstName, last_name: lastName, display_name: `${firstName} ${lastName}`, phone, role: "parent" },
          },
        });
        if (error) throw error;
        if (!data.user) throw new Error("Nie udało się utworzyć konta");
        toast.success("Konto utworzone! Sprawdź e-mail, aby potwierdzić.");
        setMode("login"); setPassword("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd");
    } finally { setLoading(false); }
  };

  const onForgotPassword = async () => {
    if (!email.trim()) return toast.error("Wpisz e-mail");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (error) throw error;
      toast.success("Link resetujący wysłany.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-white flex relative overflow-hidden">
      <Toaster theme="dark" />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-8%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-emerald-500/15 via-amber-400/10 to-transparent blur-[160px] animate-[authFloat_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-amber-500/12 to-emerald-400/5 blur-[140px] animate-[authFloat_30s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 rounded-full bg-emerald-400/30 animate-[authFloat_8s_ease-in-out_infinite]" />
        <div className="absolute top-[45%] right-[25%] w-2 h-2 rounded-full bg-amber-400/20 animate-[authFloat_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[35%] left-[30%] w-1 h-1 rounded-full bg-emerald-300/25 animate-[authFloat_10s_ease-in-out_infinite]" />
      </div>

      {/* Left panel */}
      <aside className="hidden lg:flex w-[440px] flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a10]/90 via-[#0a1810]/70 to-[#05080f]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.04)_1px,transparent_1px)] bg-[length:48px_48px]" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors w-fit"><ArrowLeft className="w-4 h-4"/>Strona główna</Link>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-500 grid place-items-center shadow-xl shadow-emerald-400/20">
                <Heart className="w-7 h-7 text-[#05080f]"/>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase">Panel</div>
                <div className="text-xl font-display">Rodzic</div>
              </div>
            </div>
            <h2 className="text-2xl font-display leading-tight text-white/90">Bądź na bieżąco z postępami dziecka.</h2>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">Wyniki, sprawdziany, powiadomienia — wszystko w jednym miejscu, prosto od nauczyciela.</p>
            <div className="mt-8 space-y-2.5">
              {PARENT_FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400/20 to-amber-400/20 grid place-items-center">
                    <f.icon className="w-4 h-4 text-emerald-300/80"/>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">{f.title}</div>
                    <div className="text-[11px] text-white/40">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs text-white/50 italic leading-relaxed">„W końcu widzę na bieżąco, jak radzi sobie moje dziecko — bez czekania na wywiadówkę."</p>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-amber-500 grid place-items-center text-[7px] text-[#05080f] font-bold">A</div>
                <span className="text-white/60">Anna K. · mama Zosi, XIV LO</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/15 font-mono tracking-wider">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse"/>Bezpieczny dostęp · dane szyfrowane</span>
          </div>
        </div>
      </aside>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4"/>Powrót</Link>

          <div className="flex mb-8 border-b border-white/[0.06]">
            <button onClick={() => setMode("login")} className={`pb-3 px-4 text-sm font-medium transition-all relative ${mode === "login" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
              Logowanie
              {mode === "login" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-amber-500 rounded-full" />}
            </button>
            <button onClick={() => setMode("register")} className={`pb-3 px-4 text-sm font-medium transition-all relative ${mode === "register" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
              Rejestracja
              {mode === "register" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-amber-500 rounded-full" />}
            </button>
          </div>

          <div className="animate-[fadeSlideIn_0.45s_ease-out]">
            <h1 className="text-2xl font-display">{mode === "login" ? "Witaj" : "Załóż konto rodzica"}</h1>
            <p className="text-white/40 text-sm mt-1">
              {mode === "login" ? "Zaloguj się, aby śledzić postępy dziecka." : "Obserwuj wyniki i sprawdziany na bieżąco."}
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Imię">
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Anna" className={inp}/>
                  </Field>
                  <Field label="Nazwisko">
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Kowalska" className={inp}/>
                  </Field>
                </div>
              )}
              <Field label="E-mail">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="rodzic@email.pl" className={`${inp} pl-10`}/>
                </div>
              </Field>
              <Field label="Hasło">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} required minLength={6} placeholder="••••••••" className={`${inp} pl-10 pr-10`}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {mode === "register" && password && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength(password).cls}`} />
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5">{strength(password).label}</div>
                  </div>
                )}
              </Field>
              {mode === "register" && (
                <Field label="Telefon (opcjonalnie)">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+48 600 000 000" className={`${inp} pl-10`}/>
                  </div>
                </Field>
              )}
              <button disabled={loading} className="relative w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-[#05080f] font-medium text-sm tracking-wide transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 overflow-hidden group">
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                {mode === "login" ? "Zaloguj się" : "Załóż konto"}
              </button>
              {mode === "login" && (
                <button type="button" onClick={onForgotPassword} disabled={loading} className="w-full text-xs text-emerald-300/60 hover:text-emerald-200 transition-colors disabled:opacity-50">
                  Nie pamiętasz hasła?
                </button>
              )}
            </form>
            {mode === "register" && (
              <div className="mt-4 flex items-start gap-2 text-xs text-white/40 bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300/60"/>
                <span>Po rejestracji potwierdź adres e-mail. Będziesz mógł dodać dziecko kodem przypisania.</span>
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/30">
            <Link to="/auth/teacher" className="hover:text-white/60 transition-colors">Nauczyciel →</Link>
            <Link to="/auth/student" className="hover:text-white/60 transition-colors">Uczeń →</Link>
            <Link to="/auth/admin" className="hover:text-white/60 transition-colors">Admin →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full h-11 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none transition-all text-white text-sm placeholder:text-white/20 focus:border-emerald-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_-8px_rgba(52,211,153,0.15)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/40 mb-1.5 tracking-wide">{label}</div>
      {children}
    </label>
  );
}

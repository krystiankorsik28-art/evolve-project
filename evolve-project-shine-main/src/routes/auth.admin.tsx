import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Shield, ArrowLeft, Loader2, Lock, Mail, KeyRound, CheckCircle2, AlertTriangle, Eye, EyeOff, Fingerprint, Server, History, Send, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { sendAdminOtp, verifyAdminOtp } from "@/lib/admin.functions";

export const Route = createFileRoute("/auth/admin")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Administrator — logowanie | EduNex" }] }),
});

const SECURITY_FEATURES = [
  { icon: Fingerprint, title: "Dwuetapowe logowanie", desc: "Hasło + kod dostępu" },
  { icon: Eye, title: "Dziennik audytu", desc: "Rejestracja wszystkich logowań" },
  { icon: Server, title: "TLS 1.3", desc: "Połączenie szyfrowane" },
  { icon: History, title: "Auto-wylogowanie", desc: "Po 15 min bezczynności" },
];

function AdminLogin() {
  const sendOtpFn = useServerFn(sendAdminOtp);
  const verifyFn = useServerFn(verifyAdminOtp);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => { if (step === 3) refs.current[0]?.focus(); }, [step]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // auto-submit OTP when all 6 digits entered
  useEffect(() => {
    if (otp.every(d => d !== "") && step === 3 && !loading) {
      const verify = async () => {
        setLoading(true);
        try {
          await verifyFn({ data: { code: otp.join("") } });
          toast.success("Dostęp przyznany");
          window.location.assign("/admin");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Nieprawidłowy kod");
          setOtp(["","","","","",""]);
          refs.current[0]?.focus();
          setLoading(false);
        }
      };
      verify();
    }
  }, [otp.join("")]);

  const onCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await sendOtpFn();
      toast.success("Kod wysłany na e-mail. Sprawdź skrzynkę.");
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Odmowa");
    } finally { setLoading(false); }
  };

  const setOtpAt = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 1);
    const next = [...otp]; next[i] = d; setOtp(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const onOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const onOtpPaste = (e: React.ClipboardEvent) => {
    const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (txt.length === 6) { e.preventDefault(); setOtp(txt.split("")); refs.current[5]?.focus(); }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { toast.error("Wprowadź 6 cyfr"); return; }
    setLoading(true);
    try {
      await verifyFn({ data: { code } });
      toast.success("Dostęp przyznany");
      window.location.assign("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nieprawidłowy kod");
      setOtp(["","","","","",""]);
      refs.current[0]?.focus();
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      await sendOtpFn();
      toast.success("Nowy kod wysłany.");
      setCountdown(30);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-white flex relative overflow-hidden">
      <Toaster theme="dark" />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-8%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-rose-600/15 via-red-500/10 to-transparent blur-[160px] animate-[authFloat_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-red-500/12 to-amber-400/5 blur-[140px] animate-[authFloat_30s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 rounded-full bg-red-400/30 animate-[authFloat_8s_ease-in-out_infinite]" />
        <div className="absolute top-[50%] right-[30%] w-2 h-2 rounded-full bg-rose-400/20 animate-[authFloat_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[25%] left-[40%] w-1 h-1 rounded-full bg-red-300/25 animate-[authFloat_10s_ease-in-out_infinite]" />
      </div>

      {/* Left panel */}
      <aside className="hidden lg:flex w-[440px] flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#140a0a]/90 via-[#1a0a0a]/70 to-[#05080f]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(155,42,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(155,42,42,0.04)_1px,transparent_1px)] bg-[length:48px_48px]" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors w-fit"><ArrowLeft className="w-4 h-4"/>Strona główna</Link>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 grid place-items-center shadow-xl shadow-red-600/20">
                <Shield className="w-7 h-7 text-white"/>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase">Zabezpieczony</div>
                <div className="text-xl font-display">Administrator</div>
              </div>
            </div>
            <h2 className="text-2xl font-display leading-tight text-white/90">Dostęp tylko dla upoważnionych.</h2>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">Logowanie dwuetapowe. Każda próba jest rejestrowana.</p>
            <div className="mt-8 space-y-2.5">
              {SECURITY_FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400/20 to-rose-400/20 grid place-items-center">
                    <f.icon className="w-4 h-4 text-red-300/80"/>
                  </div>
                  <div>
                    <div className="text-sm text-white/80">{f.title}</div>
                    <div className="text-[11px] text-white/40">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex -space-x-1.5">
                  {["#9b2a2a","#b03333","#c04444","#d05555"].map((c,i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-[#05080f]" style={{background: c}}/>
                  ))}
                </div>
                <span className="text-white/50">12 adminów online · 0 incydentów</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/15 font-mono tracking-wider">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse"/>System zaufany · Serwery: Warszawa, Frankfurt</span>
          </div>
        </div>
      </aside>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4"/>Powrót</Link>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <StepDot n={1} label="Logowanie" active={step >= 1} done={step > 1} />
            <div className={`flex-1 h-px ${step > 1 ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-white/[0.06]"}`}/>
            <StepDot n={2} label="Kod e-mail" active={step >= 2} done={step > 2} />
            <div className={`flex-1 h-px ${step > 2 ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-white/[0.06]"}`}/>
            <StepDot n={3} label="Weryfikacja" active={step >= 3} done={false} />
          </div>

          {step === 1 && (
            <div className="animate-[fadeSlideIn_0.4s_ease-out]">
              <h1 className="text-2xl font-display">Logowanie</h1>
              <p className="text-white/40 text-sm mt-1">Podaj służbowy e-mail i hasło.</p>
              <form onSubmit={onCredentials} className="mt-6 space-y-4">
                <Field label="E-mail">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="admin@edunex.pl" className={`${inp} pl-10`}/>
                  </div>
                </Field>
                <Field label="Hasło">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} required placeholder="••••••••" className={`${inp} pl-10 pr-10`}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </Field>
                <button disabled={loading} className="relative w-full h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-sm tracking-wide transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 overflow-hidden group">
                  <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : null}Kontynuuj
                </button>
              </form>
              <div className="mt-4 flex items-start gap-2 text-xs text-white/40 bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-300/60"/>
                <span>5 nieudanych prób = blokada IP. Wszystkie próby logowania są rejestrowane.</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeSlideIn_0.4s_ease-out]">
              <h1 className="text-2xl font-display">Kod wysłany</h1>
              <p className="text-white/40 text-sm mt-1">Sprawdź skrzynkę odbiorczą — kod jest ważny 10 minut.</p>
              <div className="mt-6 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400/20 to-rose-400/20 grid place-items-center shrink-0">
                  <Send className="w-5 h-5 text-red-300/80"/>
                </div>
                <div>
                  <div className="text-sm text-white/80">E-mail wysłany na</div>
                  <div className="text-xs text-white/40 font-mono">{email.replace(/(.{2}).+@/, "$1***@")}</div>
                </div>
              </div>
              <button onClick={() => setStep(3)} className="relative w-full mt-5 h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-sm tracking-wide transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 overflow-hidden group">
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Smartphone className="w-4 h-4"/>Mam kod — weryfikuj
              </button>
              <div className="mt-4 flex items-center justify-between text-xs">
                <button type="button" disabled={loading || countdown > 0} onClick={resendOtp} className="text-white/40 hover:text-white/70 transition-colors disabled:opacity-40">
                  {loading ? "Wysyłanie..." : countdown > 0 ? `Wyślij ponownie (${countdown}s)` : "Wyślij ponownie"}
                </button>
                <button type="button" onClick={()=>{ setStep(1); setOtp(["","","","","",""]); }} className="text-white/40 hover:text-white/70 transition-colors">← Wstecz</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-[fadeSlideIn_0.4s_ease-out]">
              <h1 className="text-2xl font-display">Kod weryfikacyjny</h1>
              <p className="text-white/40 text-sm mt-1">Wprowadź 6-cyfrowy kod z e-maila.</p>
              <form onSubmit={onVerifyOtp} className="mt-6 space-y-5">
                <div onPaste={onOtpPaste} className="flex justify-between gap-2">
                  {otp.map((v, i) => (
                    <input key={i} ref={(el) => { refs.current[i] = el; }} inputMode="numeric" value={v} onChange={(e)=>setOtpAt(i, e.target.value)} onKeyDown={(e)=>onOtpKey(i, e)}
                      className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-mono bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none focus:border-red-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_-8px_rgba(220,38,38,0.15)] transition-all"
                    />
                  ))}
                </div>
                <button disabled={loading} className="relative w-full h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-sm tracking-wide transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 overflow-hidden group">
                  <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <KeyRound className="w-4 h-4"/>}Zweryfikuj
                </button>
                <div className="flex items-center justify-between">
                  <button type="button" disabled={loading || countdown > 0} onClick={resendOtp} className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-40">
                    {loading ? "Wysyłanie..." : countdown > 0 ? `Wyślij ponownie (${countdown}s)` : "Wyślij ponownie"}
                  </button>
                  <button type="button" onClick={()=>{ setStep(2); setOtp(["","","","","",""]); }} className="text-xs text-white/40 hover:text-white/70 transition-colors">← Wstecz</button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/30">
            <Link to="/auth/teacher" className="hover:text-white/60 transition-colors">Nauczyciel →</Link>
            <Link to="/auth/student" className="hover:text-white/60 transition-colors">Uczeń →</Link>
            <Link to="/auth/parent" className="hover:text-white/60 transition-colors">Rodzic →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full h-11 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none transition-all text-white text-sm placeholder:text-white/20 focus:border-red-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_-8px_rgba(220,38,38,0.15)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/40 mb-1.5 tracking-wide">{label}</div>
      {children}
    </label>
  );
}

function StepDot({ n, active, done, label }: { n: number; active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-medium border transition-all ${done ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-gradient-to-br from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-600/20" : "bg-transparent border-white/[0.15] text-white/40"}`}>
        {done ? <CheckCircle2 className="w-4 h-4"/> : n}
      </div>
      <span className={`text-xs transition-colors ${active ? "text-white/80" : "text-white/30"}`}>{label}</span>
    </div>
  );
}

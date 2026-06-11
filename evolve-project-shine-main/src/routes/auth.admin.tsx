import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, CheckCircle2, KeyRound, ChevronLeft, Award, ScanFace, Server, Clock, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/admin")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Logowanie — Admin | EduNex" }] }),
});

const FEATURES = [
  { icon: ScanFace, t: "Weryfikacja 2FA", d: "Dodatkowa warstwa bezpieczeństwa dla kont administracyjnych" },
  { icon: Server, t: "Audyt systemowy", d: "Pełny dziennik zdarzeń i logów dostępu" },
  { icon: Lock, t: "Szyfrowanie TLS 1.3", d: "Najwyższy standard ochrony transmisji danych" },
  { icon: Clock, t: "Auto-logout", d: "Sesja wygasa automatycznie po 15 minutach" },
];

function AdminLogin() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState<string[]>(["","","","","",""]);
  const [countdown, setCountdown] = useState(30);
  const [busy, setBusy] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && countdown > 0) { const t = setTimeout(() => setCountdown((c) => c - 1), 1000); return () => clearTimeout(t); }
  }, [step, countdown]);

  const sendOtp = async () => {
    if (!email || !pass) { toast.error("Wypełnij wszystkie pola"); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setStep(2);
    setCountdown(30);
    setBusy(false);
    toast.success("Kod OTP wysłany na email");
  };

  const verifyOtp = () => {
    if (otp.some((d) => !d)) { toast.error("Wpisz kod 6-cyfrowy"); return; }
    setBusy(true);
    setTimeout(() => {
      localStorage.setItem("user_role", "admin");
      toast.success("Zweryfikowano!");
      navigate({ to: "/admin" });
      setBusy(false);
    }, 600);
  };

  const handleOtpDigit = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp];
    n[i] = v.slice(-1);
    setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div className="auth-bg auth-grad-red">
      <Toaster theme="dark" />
      <div className="auth-panel max-lg:hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative z-10 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4"/>EduNex
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-medium w-fit">
            <Shield className="w-3.5 h-3.5"/>Administrator
          </div>
          <h2 className="display-md font-bold text-white">Panel administracyjny</h2>
          <p className="body-sm">Bezpieczne logowanie z weryfikacją OTP. Zarządzaj szkołami, użytkownikami i systemem.</p>
          <div className="space-y-3 mt-4">
            {FEATURES.map((f) => (
              <div key={f.t} className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 grid place-items-center shrink-0"><f.icon className="w-4 h-4 text-rose-300"/></div>
                <div><div className="text-sm text-white/90 font-medium">{f.t}</div><div className="text-xs text-white/40">{f.d}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <UserCheck className="w-3.5 h-3.5 text-rose-300"/> 12 adminów online
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-xs mb-6">
            <ChevronLeft className="w-3 h-3"/>EduNex
          </Link>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-white/[0.04] text-white/30 border border-white/[0.06]"
                }`}>{step > s ? <CheckCircle2 className="w-4 h-4"/> : s}</div>
                {s < 3 && <div className={`w-8 h-0.5 transition-all ${step > s ? "bg-rose-500/30" : "bg-white/[0.06]"}`} />}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
            <div className="space-y-4">
              <div>
                <label className="auth-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@edunex.pl" className="auth-input pl-10" />
                </div>
              </div>
              <div>
                <label className="auth-label">Hasło</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="auth-input pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><Eye className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
            <button onClick={sendOtp} disabled={busy} className="auth-submit mt-6" style={{ background: "linear-gradient(135deg, oklch(0.7 0.2 30), oklch(0.6 0.15 0))" }}>
              {busy ? "Wysyłanie..." : "Wyślij kod OTP"}
            </button>
            <div className="mt-6 flex justify-center gap-4 text-xs text-white/30">
              <Link to="/auth/teacher" className="hover:text-white/60">Nauczyciel</Link>
              <Link to="/auth/student" className="hover:text-white/60">Uczeń</Link>
              <Link to="/auth/parent" className="hover:text-white/60">Rodzic</Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center" style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 grid place-items-center mb-4"><Mail className="w-7 h-7 text-rose-300"/></div>
            <div className="text-sm text-white/70">Kod wysłany na</div>
            <div className="text-sm font-medium text-white mt-1">{email.replace(/(.{3})(.*)(?=@)/, "$1***")}</div>
            <button onClick={() => setStep(3)} className="auth-submit mt-8" style={{ background: "linear-gradient(135deg, oklch(0.7 0.2 30), oklch(0.6 0.15 0))" }}>
              Mam kod — weryfikuj
            </button>
            <div className="mt-4">
              {countdown > 0 ? (
                <span className="text-xs text-white/30">Wyślij ponownie za {countdown}s</span>
              ) : (
                <button onClick={sendOtp} className="text-xs text-rose-300/70 hover:text-rose-300">Wyślij ponownie</button>
              )}
            </div>
            <button onClick={() => setStep(1)} className="btn-ghost w-full mt-4 justify-center text-xs"><ChevronLeft className="w-3 h-3"/>Wróć</button>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
            <div className="text-center mb-6">
              <KeyRound className="w-12 h-12 mx-auto text-rose-300/60 mb-3" />
              <div className="text-sm text-white/70">Wpisz kod weryfikacyjny</div>
              <div className="text-xs text-white/40 mt-1">Kod 6-cyfrowy z emaila</div>
            </div>
            <div className="flex justify-center gap-2.5 mb-6">
              {otp.map((d, i) => (
                <input key={i} ref={(r) => { otpRefs.current[i] = r; }} type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handleOtpDigit(i, e.target.value)} onKeyDown={(e) => handleOtpKey(i, e)}
                  className="w-11 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center text-lg font-bold text-white focus:border-rose-400/40 focus:outline-none focus:shadow-[0_0_0_3px_oklch(0.7_0.2_30_/_0.1)] transition-all" />
              ))}
            </div>
            <button onClick={verifyOtp} disabled={busy} className="auth-submit" style={{ background: "linear-gradient(135deg, oklch(0.7 0.2 30), oklch(0.6 0.15 0))" }}>
              {busy ? "Weryfikacja..." : "Zweryfikuj"}
            </button>
            <button onClick={() => setStep(2)} className="btn-ghost w-full mt-4 justify-center text-xs"><ChevronLeft className="w-3 h-3"/>Wróć</button>
          </div>
        )}
      </div>
    </div>
  );
}

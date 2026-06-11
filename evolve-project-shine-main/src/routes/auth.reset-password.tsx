import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPassword,
  head: () => ({ meta: [{ title: "Reset hasła | EduNex" }] }),
});

function ResetPassword() {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!pass || !confirm) { toast.error("Wypełnij wszystkie pola"); return; }
    if (pass !== confirm) { toast.error("Hasła nie są zgodne"); return; }
    if (pass.length < 8) { toast.error("Hasło musi mieć min. 8 znaków"); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1000));
    setBusy(false);
    setDone(true);
    setTimeout(() => navigate({ to: "/auth/teacher" }), 2500);
  };

  if (done) {
    return (
      <div className="min-h-screen auth-bg grid place-items-center">
        <Toaster theme="dark" />
        <div className="text-center" style={{ animation: "fadeSlideIn 0.5s ease-out" }}>
          <div className="w-20 h-20 mx-auto rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 grid place-items-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="display-md font-bold text-white">Hasło zmienione</h2>
          <p className="body-sm mt-2">Za chwilę zostaniesz przekierowany do logowania.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen auth-bg grid place-items-center">
        <Toaster theme="dark" />
        <div className="text-center max-w-sm mx-auto px-4" style={{ animation: "fadeSlideIn 0.5s ease-out" }}>
          <div className="w-20 h-20 mx-auto rounded-[28px] bg-rose-500/10 border border-rose-500/20 grid place-items-center mb-6">
            <AlertTriangle className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="display-md font-bold text-white">Token wygasł</h2>
          <p className="body-sm mt-2">Link resetujący stracił ważność. Zażądaj nowego.</p>
          <Link to="/auth/teacher" className="auth-submit mt-8 inline-flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, oklch(0.65 0.15 240), oklch(0.6 0.15 220))", width: "auto", padding: "0.75rem 2rem" }}>
            <ArrowLeft className="w-4 h-4"/>Strona logowania
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-bg grid place-items-center">
      <Toaster theme="dark" />
      <div className="max-w-sm w-full mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-xs mb-6">
            <ChevronLeft className="w-3 h-3"/>EduNex
          </Link>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 border border-accent/20 grid place-items-center mb-4">
            <ShieldCheck className="w-7 h-7 text-accent" />
          </div>
          <h2 className="display-md font-bold text-white">Ustaw nowe hasło</h2>
          <p className="body-sm mt-1">Minimum 8 znaków, duża i mała litera, cyfra.</p>
        </div>

        <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
          <div className="space-y-4">
            <div>
              <label className="auth-label">Nowe hasło</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="auth-input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><Eye className="w-4 h-4"/></button>
              </div>
              {pass && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${pass.length < 6 ? "pw-weak" : pass.length < 10 ? "pw-fair" : pass.length < 14 ? "pw-good" : "pw-strong"}`} />
                  </div>
                  <div className="text-[10px] text-white/30 mt-1">{pass.length < 6 ? "Słabe" : pass.length < 10 ? "Średnie" : pass.length < 14 ? "Dobre" : "Mocne"}</div>
                </div>
              )}
            </div>
            <div>
              <label className="auth-label">Potwierdź hasło</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPass ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className={`auth-input pl-10 pr-10 ${confirm && pass !== confirm ? "error" : ""}`} />
              </div>
              {confirm && pass !== confirm && <div className="text-[10px] text-rose-300/70 mt-1">Hasła nie są zgodne</div>}
              {confirm && pass === confirm && <div className="text-[10px] text-emerald-300/70 mt-1">Hasła zgodne</div>}
            </div>
          </div>
          <button onClick={submit} disabled={busy} className="auth-submit mt-6">
            {busy ? "Zmieniam..." : "Zmień hasło"}
          </button>
        </div>
      </div>
    </div>
  );
}

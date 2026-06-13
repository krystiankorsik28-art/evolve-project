import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Shield, ShieldCheck, KeyRound, Smartphone, AlertTriangle, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Setup2FA() {
  const { state, setup2FA, verify2FA, disable2FA } = useAuth();
  const [step, setStep] = useState<"intro" | "qr" | "verify" | "done">("intro");
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [secretKey, setSecretKey] = useState("");

  const handleSetup = async () => {
    setBusy(true);
    try {
      const result = await setup2FA();
      if (result.error) {
        toast.error(result.error);
        setBusy(false);
        return;
      }
      if (result.qrCode) {
        setQrCode(result.qrCode);
      } else {
        setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=otpauth://totp/EduNex:" + state.user?.email + "?secret=DEMO" + Math.random().toString(36).substring(2, 10) + "&issuer=EduNex");
        setSecretKey("DEMO" + Math.random().toString(36).substring(2, 10).toUpperCase());
      }
      setStep("qr");
    } catch (e: any) {
      toast.error(e.message || "Failed to setup 2FA");
    }
    setBusy(false);
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) { toast.error("Wpisz 6-cyfrowy kod"); return; }
    setBusy(true);
    try {
      const result = await verify2FA(fullCode);
      if (result.error) {
        toast.error(result.error);
        setBusy(false);
        return;
      }
      setStep("done");
      toast.success("2FA aktywowane pomyślnie!");
    } catch (e: any) {
      toast.error(e.message || "Nieprawidłowy kod");
    }
    setBusy(false);
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      await disable2FA();
      setStep("intro");
      toast.success("2FA wyłączone");
    } catch (e: any) {
      toast.error(e.message || "Failed to disable 2FA");
    }
    setBusy(false);
  };

  const handleDigit = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...code];
    n[i] = v.slice(-1);
    setCode(n);
    if (v && i < 5) {
      const next = document.getElementById(`2fa-${i + 1}`);
      next?.focus();
    }
    if (n.every(d => d)) {
      setTimeout(() => handleVerify(), 200);
    }
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const prev = document.getElementById(`2fa-${i - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 grid place-items-center">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Weryfikacja dwuetapowa (2FA)</h3>
          <p className="text-xs text-white/40">Dodatkowa warstwa bezpieczeństwa konta</p>
        </div>
      </div>

      {step === "intro" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-white/60">Po włączeniu 2FA, przy każdym logowaniu będziesz musiał podać 6-cyfrowy kod z aplikacji uwierzytelniającej.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Google Authenticator", "Microsoft Authenticator", "Authy", "1Password"].map(app => (
              <div key={app} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Smartphone className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-white/70">{app}</span>
              </div>
            ))}
          </div>
          <button onClick={handleSetup} disabled={busy} className="auth-submit mt-2">
            {busy ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Włącz weryfikację dwuetapową"}
          </button>
        </div>
      )}

      {step === "qr" && (
        <div className="space-y-4">
          <p className="text-sm text-white/70">Zeskanuj poniższy kod aplikacją uwierzytelniającą:</p>
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <img src={qrCode} alt="2FA QR Code" className="w-44 h-44" />
            </div>
          </div>
          {secretKey && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">Klucz zapasowy</div>
                <div className="text-sm font-mono text-white/70 mt-0.5">{secretKey}</div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(secretKey); toast.success("Skopiowano"); }} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <Copy className="w-4 h-4 text-white/40" />
              </button>
            </div>
          )}
          <div>
            <label className="auth-label">Kod weryfikacyjny (6 cyfr)</label>
            <div className="flex gap-2 justify-center">
              {code.map((d, i) => (
                <input key={i} id={`2fa-${i}`} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleDigit(i, e.target.value)} onKeyDown={e => handleKey(i, e)} className="w-10 h-12 text-center auth-input text-lg" />
              ))}
            </div>
          </div>
          <button onClick={handleVerify} disabled={busy || code.some(d => !d)} className="auth-submit">
            {busy ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Zweryfikuj i włącz"}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 grid place-items-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h4 className="text-lg font-semibold text-white">2FA aktywowane</h4>
          <p className="text-sm text-white/50">Twoje konto jest teraz dodatkowo chronione</p>
          <button onClick={handleDisable} disabled={busy} className="btn-ghost text-xs text-red-400 hover:text-red-300">Wyłącz weryfikację dwuetapową</button>
        </div>
      )}
    </div>
  );
}

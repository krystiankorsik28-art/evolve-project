import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, Users, ArrowRight, CheckCircle2, BrainCircuit, Sparkles, Database, Shield, User, UserPlus, ChevronLeft, Award } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/teacher")({
  component: TeacherLogin,
  head: () => ({ meta: [{ title: "Logowanie — Nauczyciel | EduNex" }] }),
});

const FEATURES = [
  { icon: Sparkles, t: "Generator AI", d: "Twórz pytania z 3 słów — AI generuje cały test w 10s" },
  { icon: Shield, t: "Monitoring AI", d: "Wykrywaj ściąganie w czasie rzeczywistym z alertami" },
  { icon: Database, t: "Bank pytań", d: "200+ gotowych zestawów, import z Word/PDF/Excel" },
  { icon: BarChart3, t: "Analityka", d: "Wyniki, rankingi, raporty i prognozy dla każdej klasy" },
];

function TeacherLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submitLogin = async () => {
    if (!email || !pass) { toast.error("Wypełnij wszystkie pola"); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("user_role", "teacher");
    navigate({ to: "/teacher" });
    setBusy(false);
  };

  const submitRegister = async () => {
    if (!fname || !lname || !email || !pass) { toast.error("Wypełnij wszystkie pola"); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Konto utworzone! Wymaga zatwierdzenia przez admina.");
    setBusy(false);
  };

  return (
    <div className="auth-bg auth-grad-violet">
      <Toaster theme="dark" />
      <div className="auth-panel max-lg:hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative z-10 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4"/>EduNex
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium w-fit">
            <Users className="w-3.5 h-3.5"/>Nauczyciel
          </div>
          <h2 className="display-md font-bold text-white">Panel nauczyciela</h2>
          <p className="body-sm">Zarządzaj egzaminami, monitoruj wyniki i korzystaj z AI — wszystko w jednym miejscu.</p>
          <div className="space-y-3 mt-4">
            {FEATURES.map((f) => (
              <div key={f.t} className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 grid place-items-center shrink-0"><f.icon className="w-4 h-4 text-violet-300"/></div>
                <div><div className="text-sm text-white/90 font-medium">{f.t}</div><div className="text-xs text-white/40">{f.d}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Award className="w-3.5 h-3.5 text-violet-300"/> "AI generuje pytania szybciej niż ja je wymyślam. Game changer."
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-white/30">
              <span className="w-5 h-5 rounded-full bg-violet-400/20 grid place-items-center text-[9px]">PN</span>
              Paweł Nowak, V LO Kraków
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-xs mb-6">
            <ChevronLeft className="w-3 h-3"/>EduNex
          </Link>
          <div className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-fit mx-auto">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`auth-tab ${mode === m ? "active" : ""}`}>
                {m === "login" ? <><Mail className="w-3.5 h-3.5"/>Logowanie</> : <><UserPlus className="w-3.5 h-3.5"/>Rejestracja</>}
              </button>
            ))}
          </div>
        </div>

        {mode === "login" ? (
          <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
            <div className="space-y-4">
              <div>
                <label className="auth-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nauczyciel@szkola.pl" className="auth-input pl-10" />
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
            <div className="flex justify-end mt-2">
              <Link to="/auth/reset-password" className="text-xs text-violet-300/70 hover:text-violet-300 transition-colors">Nie pamiętasz hasła?</Link>
            </div>
            <button onClick={submitLogin} disabled={busy} className="auth-submit mt-6" style={{ background: "linear-gradient(135deg, oklch(0.65 0.2 280), oklch(0.6 0.15 240))" }}>
              {busy ? "Logowanie..." : "Zaloguj się"}
            </button>
            <div className="mt-6 flex justify-center gap-4 text-xs text-white/30">
              <Link to="/auth/admin" className="hover:text-white/60">Admin</Link>
              <Link to="/auth/student" className="hover:text-white/60">Uczeń</Link>
              <Link to="/auth/parent" className="hover:text-white/60">Rodzic</Link>
            </div>
          </div>
        ) : (
          <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="auth-label">Imię</label><input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="Jan" className="auth-input" /></div>
                <div><label className="auth-label">Nazwisko</label><input type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Kowalski" className="auth-input" /></div>
              </div>
              <div><label className="auth-label">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nauczyciel@szkola.pl" className="auth-input" /></div>
              <div>
                <label className="auth-label">Hasło</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Utwórz hasło" className="auth-input pl-10 pr-10" />
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
            </div>
            <p className="text-[11px] text-white/30 mt-3">Konto wymaga zatwierdzenia przez administratora szkoły.</p>
            <button onClick={submitRegister} disabled={busy} className="auth-submit mt-4" style={{ background: "linear-gradient(135deg, oklch(0.65 0.2 280), oklch(0.6 0.15 240))" }}>
              {busy ? "Rejestracja..." : "Utwórz konto"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

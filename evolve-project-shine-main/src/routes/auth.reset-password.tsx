import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Lock, Loader2, CheckCircle2, AlertTriangle, ArrowLeft,
  Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPassword,
  head: () => ({ meta: [{ title: "Resetowanie hasła | EduNex" }] }),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      setError("Brak poprawnego tokenu resetowania. Poproś o nowy link.");
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Hasło musi mieć min. 6 znaków"); return; }
    if (password !== confirm) { toast.error("Hasła nie są zgodne"); return; }
    setLoading(true);
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast.success("Hasło zmienione pomyślnie!");
      setTimeout(() => navigate({ to: "/auth/teacher" }), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-white flex relative overflow-hidden">
      <Toaster theme="dark" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-8%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-transparent blur-[160px] animate-[authFloat_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-violet-500/12 to-cyan-400/5 blur-[140px] animate-[authFloat_30s_ease-in-out_infinite_reverse]" />
      </div>
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4"/>EduNex
          </Link>
          {done ? (
            <div className="animate-[fadeSlideIn_0.4s_ease-out] text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-500/15 border border-emerald-400/30 grid place-items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">Hasło zmienione</h1>
              <p className="text-white/50 text-sm">Za chwilę zostaniesz przekierowany do logowania.</p>
            </div>
          ) : error ? (
            <div className="animate-[fadeSlideIn_0.4s_ease-out] text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-red-500/15 border border-red-400/30 grid place-items-center">
                <AlertTriangle className="w-8 h-8 text-red-300" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">Niepoprawny link</h1>
              <p className="text-white/50 text-sm mb-6">{error}</p>
              <Link to="/auth/teacher" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm">
                ← Strona logowania
              </Link>
            </div>
          ) : (
            <div className="animate-[fadeSlideIn_0.4s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center shadow-lg shadow-cyan-400/20">
                  <ShieldCheck className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] text-cyan-300/70 uppercase font-mono">EduNex</div>
                  <h1 className="text-xl font-display">Nowe hasło</h1>
                </div>
              </div>
              <p className="text-white/40 text-sm mb-6">Ustaw nowe hasło do swojego konta.</p>
              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <div className="text-[11px] font-medium text-white/40 mb-1.5 tracking-wide">Nowe hasło</div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••" className="w-full h-11 pl-10 pr-10 bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none text-white text-sm placeholder:text-white/20 focus:border-cyan-400/40 focus:bg-white/[0.06]" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </label>
                <label className="block">
                  <div className="text-[11px] font-medium text-white/40 mb-1.5 tracking-wide">Potwierdź hasło</div>
                  <input type={showPw ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} placeholder="••••••" className="w-full h-11 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl outline-none text-white text-sm placeholder:text-white/20 focus:border-cyan-400/40 focus:bg-white/[0.06]" />
                </label>
                <button className="relative w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-slate-900 font-medium text-sm transition-all disabled:opacity-40 inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4"/>}
                  {loading ? "Zapisywanie..." : "Zmień hasło"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

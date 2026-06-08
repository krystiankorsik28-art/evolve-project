import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Shield, LogOut, Users, FileText, MessageSquare, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPanel,
  head: () => ({ meta: [{ title: "Panel administratora | EduNex" }] }),
});

type PendingTeacher = { id: string; user_id: string; role: string; approval_status: string; created_at: string };

function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<PendingTeacher[]>([]);
  const [stats, setStats] = useState({ exams: 0, attempts: 0, messages: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth/admin" }); return; }
      setEmail(user.email ?? "");
      const [{ data: roles }, { count: examCount }, { count: attemptCount }] = await Promise.all([
        supabase.from("user_roles").select("id,user_id,role,approval_status,created_at").eq("approval_status","pending"),
        supabase.from("exams").select("*", { count: "exact", head: true }),
        supabase.from("attempts").select("*", { count: "exact", head: true }),
      ]);
      setPending((roles ?? []) as PendingTeacher[]);
      setStats({ exams: examCount ?? 0, attempts: attemptCount ?? 0, messages: 0 });
      setLoading(false);
    })();
  }, [navigate]);

  const decide = async (id: string, approve: boolean) => {
    const { error } = await supabase.from("user_roles").update({
      approval_status: approve ? "approved" : "rejected",
      approved_at: approve ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setPending((p) => p.filter((x) => x.id !== id));
    toast.success(approve ? "Zatwierdzono" : "Odrzucono");
  };

  const logout = async () => { await supabase.auth.signOut(); await navigate({ to: "/" }); };

  if (loading) return <div className="min-h-screen grid place-items-center bg-black"><Loader2 className="w-6 h-6 animate-spin text-emerald-400"/></div>;

  return (
    <div className="min-h-screen bg-black text-emerald-100 font-mono">
      <Toaster />
      <header className="border-b border-emerald-500/30 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400"/>
            <span className="font-bold tracking-widest text-emerald-300">EDUNEX :: ADMIN</span>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-500/70 hidden sm:inline">{email}</span>
            <button onClick={logout} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-emerald-300 hover:bg-emerald-500/10"><LogOut className="w-4 h-4"/> exit</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1 tracking-widest text-emerald-300">{">"} ADMIN_CONSOLE.exe</h1>
        <p className="text-emerald-500/70 text-sm mb-8">Zatwierdzaj nauczycieli, monitoruj system, audyt.</p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <AdminStat icon={Users} label="Nauczyciele oczekujący" value={String(pending.length)}/>
          <AdminStat icon={FileText} label="Egzaminy w systemie" value={String(stats.exams)}/>
          <AdminStat icon={MessageSquare} label="Próby uczniów" value={String(stats.attempts)}/>
        </div>

        <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
          <h2 className="text-lg font-bold mb-4 text-emerald-300">{">"} pending_teachers/</h2>
          {pending.length === 0 ? (
            <p className="text-emerald-500/60 text-sm">Brak oczekujących wniosków.</p>
          ) : (
            <ul className="space-y-2">
              {pending.map((p) => (
                <li key={p.id} className="flex items-center justify-between p-3 rounded border border-emerald-500/20 bg-black/40">
                  <div className="text-xs">
                    <div className="text-emerald-200">user_id: {p.user_id}</div>
                    <div className="text-emerald-500/60">requested: {new Date(p.created_at).toLocaleString("pl-PL")}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>decide(p.id, true)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs"><CheckCircle2 className="w-4 h-4"/> approve</button>
                    <button onClick={()=>decide(p.id, false)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs"><XCircle className="w-4 h-4"/> reject</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function AdminStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5">
      <div className="flex items-center justify-between mb-2"><Icon className="w-5 h-5 text-emerald-400"/><span className="text-[10px] text-emerald-500/60">// stat</span></div>
      <div className="text-3xl font-bold text-emerald-200">{value}</div>
      <div className="text-xs text-emerald-500/70 mt-1">{label}</div>
    </div>
  );
}

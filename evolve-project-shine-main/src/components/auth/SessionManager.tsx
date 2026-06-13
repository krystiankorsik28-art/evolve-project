import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Monitor, Smartphone, Tablet, Globe, Clock, ShieldX, LogOut } from "lucide-react";
import { toast } from "sonner";

export function SessionManager() {
  const { sessions, loadSessions, revokeSession } = useAuth();

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      toast.success("Sesja zakończona");
    } catch { toast.error("Nie udało się zakończyć sesji"); }
  };

  const getDeviceIcon = (type?: string) => {
    switch (type) {
      case "mobile": return <Smartphone className="w-4 h-4" />;
      case "tablet": return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "przed chwilą";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz temu`;
    return d.toLocaleDateString("pl-PL");
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 grid place-items-center">
          <Globe className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Aktywne sesje</h3>
          <p className="text-xs text-white/40">Urządzenia zalogowane na Twoje konto</p>
        </div>
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div key={session.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${session.isCurrent ? 'bg-accent/5 border-accent/15' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg grid place-items-center ${session.isCurrent ? 'bg-accent/10 text-accent' : 'bg-white/[0.04] text-white/40'}`}>
                {getDeviceIcon(session.deviceType)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/80">{session.deviceName || "Nieznane urządzenie"}</span>
                  {session.isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent font-medium">Obecna</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30">{session.location || "Nieznana lokalizacja"}</span>
                  <span className="text-white/10">·</span>
                  <span className="text-xs text-white/30">{formatDate(session.lastActive)}</span>
                </div>
              </div>
            </div>
            {!session.isCurrent && (
              <button onClick={() => handleRevoke(session.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group">
                <ShieldX className="w-4 h-4 text-white/20 group-hover:text-red-400 transition-colors" />
              </button>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8 text-white/20 text-sm">Brak aktywnych sesji</div>
      )}
    </div>
  );
}

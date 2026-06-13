import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Fingerprint, Plus, Trash2, Clock, Shield, Loader2, Smartphone, Laptop } from "lucide-react";
import { toast } from "sonner";

export function PasskeyAuth() {
  const { passkeys, loadPasskeys, registerPasskey, deletePasskey } = useAuth();
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    loadPasskeys();
    setSupported(!!window.PublicKeyCredential);
  }, [loadPasskeys]);

  const handleRegister = async () => {
    setBusy(true);
    try {
      const result = await registerPasskey();
      if (result.error) { toast.error(result.error); return; }
      toast.success("Passkey zapisany!");
    } catch (e: any) {
      toast.error(e.message || "Nie udało się dodać passkey");
    }
    setBusy(false);
  };

  const handleDelete = async (id: string) => {
    await deletePasskey(id);
    toast.success("Passkey usunięty");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pl-PL");
  };

  if (!supported) {
    return (
      <div className="card-premium p-6 opacity-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] grid place-items-center">
            <Fingerprint className="w-5 h-5 text-white/30" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Passkeys</h3>
            <p className="text-xs text-white/30">Twoja przeglądarka nie obsługuje WebAuthn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 grid place-items-center">
            <Fingerprint className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Passkeys</h3>
            <p className="text-xs text-white/40">Logowanie bez hasła za pomocą odcisku palca lub Face ID</p>
          </div>
        </div>
        <button onClick={handleRegister} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 transition-colors">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Dodaj passkey
        </button>
      </div>

      <div className="space-y-2">
        {passkeys.map((pk) => (
          <div key={pk.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] grid place-items-center text-white/40">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-white/80">{pk.name}</div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-white/30">
                  <span>Dodano: {formatDate(pk.createdAt)}</span>
                  {pk.lastUsed && (
                    <>
                      <span className="text-white/10">·</span>
                      <span>Ostatnio: {formatDate(pk.lastUsed)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(pk.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group">
              <Trash2 className="w-4 h-4 text-white/20 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        ))}
      </div>

      {passkeys.length === 0 && (
        <div className="text-center py-8 text-white/20 text-sm">Brak zapisanych passkeys</div>
      )}
    </div>
  );
}

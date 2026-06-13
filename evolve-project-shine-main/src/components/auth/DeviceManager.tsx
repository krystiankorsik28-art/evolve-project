import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Monitor, Smartphone, Tablet, Shield, ShieldCheck, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

export function DeviceManager() {
  const { devices, loadDevices, removeDevice, trustDevice } = useAuth();

  useEffect(() => { loadDevices(); }, [loadDevices]);

  const handleRemove = async (deviceId: string) => {
    await removeDevice(deviceId);
    toast.success("Urządzenie usunięte");
  };

  const handleTrust = async (deviceId: string) => {
    await trustDevice(deviceId);
    toast.success("Urządzenie zaufane");
  };

  const getDeviceIcon = (type: string) => {
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
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Zaufane urządzenia</h3>
          <p className="text-xs text-white/40">Urządzenia z zapamiętanym logowaniem</p>
        </div>
      </div>

      <div className="space-y-2">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] grid place-items-center text-white/40">
                {getDeviceIcon(device.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/80">{device.name}</span>
                  {device.trusted && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-white/30">
                  <span>{device.os}</span>
                  <span className="text-white/10">·</span>
                  <span>{device.browser}</span>
                  <span className="text-white/10">·</span>
                  <span>{formatDate(device.lastUsed)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!device.trusted && (
                <button onClick={() => handleTrust(device.id)} className="p-2 rounded-lg hover:bg-accent/10 transition-colors group" title="Zaufaj urządzeniu">
                  <ShieldCheck className="w-4 h-4 text-white/20 group-hover:text-accent transition-colors" />
                </button>
              )}
              <button onClick={() => handleRemove(device.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group" title="Usuń urządzenie">
                <Trash2 className="w-4 h-4 text-white/20 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-8 text-white/20 text-sm">Brak zapisanych urządzeń</div>
      )}
    </div>
  );
}

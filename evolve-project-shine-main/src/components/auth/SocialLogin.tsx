import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import type { AuthProvider } from "@/lib/auth/auth-types";
import { toast } from "sonner";

const PROVIDERS: { id: AuthProvider; label: string; icon: string }[] = [
  { id: "google", label: "Google", icon: "G" },
  { id: "github", label: "GitHub", icon: "GH" },
  { id: "microsoft", label: "Microsoft", icon: "MS" },
  { id: "apple", label: "Apple", icon: "A" },
  { id: "discord", label: "Discord", icon: "D" },
  { id: "linkedin", label: "LinkedIn", icon: "LI" },
];

export function SocialLogin({ mode = "login" }: { mode?: "login" | "register" }) {
  const { signInWithProvider } = useAuth();
  const [busy, setBusy] = useState<AuthProvider | null>(null);

  const handleProvider = async (provider: AuthProvider) => {
    setBusy(provider);
    try {
      await signInWithProvider(provider);
    } catch (e: any) {
      toast.error(e.message || `Failed to ${mode} with ${provider}`);
    } finally {
      setBusy(null);
    }
  };

  const getProviderStyle = (id: AuthProvider) => {
    const styles: Record<AuthProvider, string> = {
      google: "border-[#4285F4]/20 hover:border-[#4285F4]/40 hover:bg-[#4285F4]/5",
      github: "border-[#333]/20 hover:border-[#333]/40 hover:bg-[#333]/5",
      microsoft: "border-[#00A4EF]/20 hover:border-[#00A4EF]/40 hover:bg-[#00A4EF]/5",
      apple: "border-white/10 hover:border-white/20 hover:bg-white/5",
      discord: "border-[#5865F2]/20 hover:border-[#5865F2]/40 hover:bg-[#5865F2]/5",
      linkedin: "border-[#0A66C2]/20 hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5",
    };
    return styles[id];
  };

  const getProviderText = (id: AuthProvider) => {
    const textStyles: Record<AuthProvider, string> = {
      google: "text-[#4285F4]",
      github: "text-white/80",
      microsoft: "text-[#00A4EF]",
      apple: "text-white/80",
      discord: "text-[#5865F2]",
      linkedin: "text-[#0A66C2]",
    };
    return textStyles[id];
  };

  return (
    <div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-white/30">lub kontynuuj przez</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {PROVIDERS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handleProvider(id)}
            disabled={busy !== null}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium
              bg-white/[0.02] backdrop-blur-sm
              ${getProviderStyle(id)}
              ${busy === id ? 'opacity-50 cursor-wait' : 'hover:-translate-y-0.5'}
              disabled:cursor-not-allowed`}
          >
            {busy === id ? (
              <svg className="animate-spin w-4 h-4 text-white/50" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span className={`w-5 h-5 rounded grid place-items-center text-[10px] font-bold ${getProviderText(id)}`}>
                {icon}
              </span>
            )}
            <span className={getProviderText(id)}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

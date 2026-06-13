import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Building2, Users, CheckCircle2, Plus, ChevronRight, Sparkles } from "lucide-react";

export function OrganizationManager() {
  const { organizations, currentOrganization, setCurrentOrganization, loadOrganizations } = useAuth();

  useEffect(() => { loadOrganizations(); }, [loadOrganizations]);

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 grid place-items-center">
            <Building2 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Organizacje i zespoły</h3>
            <p className="text-xs text-white/40">Zarządzaj szkołami i zespołami</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 hover:text-white transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Nowa organizacja
        </button>
      </div>

      <div className="space-y-2">
        {organizations.map((org) => (
          <button
            key={org.id}
            onClick={() => setCurrentOrganization(org)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left
              ${currentOrganization?.id === org.id ? 'bg-accent/5 border-accent/15' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] grid place-items-center text-white/40">
                {org.logo ? <img src={org.logo} alt="" className="w-6 h-6 rounded" /> : <Building2 className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/80">{org.name}</span>
                  {currentOrganization?.id === org.id && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Users className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/30">{org.memberCount} członków</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    org.plan === 'enterprise' ? 'bg-violet-500/15 text-violet-300' :
                    org.plan === 'pro' ? 'bg-accent/15 text-accent' :
                    org.plan === 'basic' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-white/[0.04] text-white/30'
                  }`}>
                    {org.plan === 'enterprise' ? 'Enterprise' : org.plan === 'pro' ? 'Pro' : org.plan === 'basic' ? 'Basic' : 'Darmowy'}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </button>
        ))}
      </div>

      {organizations.length === 0 && (
        <div className="text-center py-8 text-white/20 text-sm">Nie należysz do żadnej organizacji</div>
      )}
    </div>
  );
}

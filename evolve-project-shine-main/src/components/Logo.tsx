import { Link } from "@tanstack/react-router";

export function Logo({ size = "md", withText = true }: { size?: "sm" | "md" | "lg"; withText?: boolean }) {
  const dim = size === "lg" ? 48 : size === "sm" ? 36 : 40;
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link to="/" className="flex items-center gap-3 group select-none">
      <div className="relative" style={{ width: dim, height: dim }}>
        <div
          className="absolute inset-0 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition"
          style={{ background: "conic-gradient(from 200deg, #22d3ee, #8b5cf6, #ec4899, #22d3ee)" }}
        />
        <svg viewBox="0 0 48 48" width={dim} height={dim} className="relative">
          <defs>
            <linearGradient id="edunex-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="55%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="edunex-cap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#edunex-bg)" />
          <rect x="2" y="2" width="44" height="44" rx="13" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
          {/* shine */}
          <path d="M5 6 Q14 4 26 6 L26 12 Q15 10 5 12 Z" fill="white" opacity="0.12" />
          {/* graduation cap */}
          <path d="M24 14 L37 20 L24 26 L11 20 Z" fill="url(#edunex-cap)" />
          <path d="M15 22 V29 C15 31.2 19 33 24 33 C29 33 33 31.2 33 29 V22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="37" cy="20" r="1.8" fill="white" />
          <path d="M37 20 V27 L38.4 28.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          {/* spark */}
          <path d="M40 8 L41 10.5 L43.5 11.5 L41 12.5 L40 15 L39 12.5 L36.5 11.5 L39 10.5 Z" fill="white" opacity="0.95" />
        </svg>
      </div>
      {withText && (
        <div className="flex items-center gap-2">
          <span className={`font-display font-bold tracking-tight ${text} bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent`}>
            EduNex
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-gradient-to-b from-white to-rose-100 text-slate-900 border border-white/30 shadow-sm">
            PL
          </span>
        </div>
      )}
    </Link>
  );
}

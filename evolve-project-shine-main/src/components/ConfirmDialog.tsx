import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type State = { opts: ConfirmOptions; resolve: (v: boolean) => void } | null;

let setStateRef: ((s: State) => void) | null = null;

/**
 * Promise-based confirm replacement for window.confirm().
 * Renders a themed modal via <ConfirmDialog /> mounted in the root layout.
 */
export function confirmDialog(input: string | ConfirmOptions): Promise<boolean> {
  const opts: ConfirmOptions = typeof input === "string" ? { description: input } : input;
  return new Promise<boolean>((resolve) => {
    if (!setStateRef) {
      // Fallback if dialog not mounted yet
      resolve(typeof window !== "undefined" ? window.confirm(opts.description ?? opts.title ?? "Potwierdź") : false);
      return;
    }
    setStateRef({ opts, resolve });
  });
}

export function ConfirmDialog() {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    setStateRef = setState;
    return () => {
      setStateRef = null;
    };
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state) return null;

  const { opts, resolve } = state;
  const close = (v: boolean) => {
    setState(null);
    resolve(v);
  };

  const danger = opts.danger ?? true;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => close(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="p-5 flex items-start gap-4">
          <div className={`shrink-0 w-11 h-11 rounded-xl grid place-items-center ${danger ? "bg-rose-500/15 text-rose-400" : "bg-cyan-500/15 text-cyan-300"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white">
              {opts.title ?? "Potwierdź"}
            </div>
            {opts.description && (
              <div className="mt-1 text-sm text-white/70 whitespace-pre-wrap break-words">
                {opts.description}
              </div>
            )}
          </div>
          <button
            onClick={() => close(false)}
            className="shrink-0 -m-1 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 pb-5 pt-1 flex items-center justify-end gap-2">
          <button
            onClick={() => close(false)}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium"
          >
            {opts.cancelText ?? "Anuluj"}
          </button>
          <button
            onClick={() => close(true)}
            autoFocus
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${danger ? "bg-rose-500 hover:bg-rose-400 text-white" : "bg-cyan-500 hover:bg-cyan-400 text-slate-900"}`}
          >
            {opts.confirmText ?? (danger ? "Usuń" : "Potwierdź")}
          </button>
        </div>
      </div>
    </div>
  );
}
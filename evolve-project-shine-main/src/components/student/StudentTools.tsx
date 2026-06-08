import { useEffect, useRef, useState } from "react";
import {
  Calculator, NotebookPen, BookOpen, ShieldAlert, Plus, Minus,
  Sparkles, X, Type, Volume2, VolumeX, RotateCcw,
} from "lucide-react";

type Tool = "calc" | "notes" | "rules" | "a11y" | null;

export function StudentTools({ attemptId }: { attemptId: string }) {
  const [open, setOpen] = useState<Tool>(null);
  const [fontScale, setFontScale] = useState<number>(() => {
    const v = localStorage.getItem(`edunex_font_${attemptId}`);
    return v ? Number(v) : 1;
  });
  const [highContrast, setHighContrast] = useState(false);
  const [muted, setMuted] = useState(true);

  // apply font scale globally to main content
  useEffect(() => {
    document.documentElement.style.setProperty("--edunex-font-scale", String(fontScale));
    localStorage.setItem(`edunex_font_${attemptId}`, String(fontScale));
  }, [fontScale, attemptId]);

  useEffect(() => {
    if (highContrast) document.documentElement.classList.add("edunex-hc");
    else document.documentElement.classList.remove("edunex-hc");
  }, [highContrast]);

  return (
    <>
      {/* Floating launcher */}
      <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2">
        <ToolBtn label="Kalkulator" icon={Calculator} onClick={() => setOpen("calc")} />
        <ToolBtn label="Notatki" icon={NotebookPen} onClick={() => setOpen("notes")} />
        <ToolBtn label="Dostępność" icon={Type} onClick={() => setOpen("a11y")} />
        <ToolBtn label="Regulamin" icon={ShieldAlert} onClick={() => setOpen("rules")} />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-[#0a0e1a] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white flex items-center gap-2">
                {open === "calc" && <><Calculator className="w-4 h-4 text-cyan-300"/>Kalkulator</>}
                {open === "notes" && <><NotebookPen className="w-4 h-4 text-cyan-300"/>Brudnopis</>}
                {open === "rules" && <><BookOpen className="w-4 h-4 text-cyan-300"/>Regulamin egzaminu</>}
                {open === "a11y" && <><Sparkles className="w-4 h-4 text-cyan-300"/>Dostępność i komfort</>}
              </h3>
              <button onClick={() => setOpen(null)} className="text-white/60 hover:text-white"><X className="w-4 h-4"/></button>
            </div>

            {open === "calc" && <CalcPad />}
            {open === "notes" && <Notepad attemptId={attemptId} />}
            {open === "rules" && <Rules />}
            {open === "a11y" && (
              <A11yPanel
                fontScale={fontScale} setFontScale={setFontScale}
                highContrast={highContrast} setHighContrast={setHighContrast}
                muted={muted} setMuted={setMuted}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ToolBtn({ label, icon: Icon, onClick }: { label: string; icon: React.ComponentType<{ className?: string }>; onClick: () => void }) {
  return (
    <button onClick={onClick} title={label} className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-900 backdrop-blur border border-white/15 text-white text-xs font-medium transition">
      <Icon className="w-4 h-4"/>
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function CalcPad() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("");
  const press = (s: string) => setExpr((e) => e + s);
  const clear = () => { setExpr(""); setResult(""); };
  const back = () => setExpr((e) => e.slice(0, -1));
  const evalIt = () => {
    try {
      // bezpieczna ocena – tylko cyfry i operatory
      if (!/^[-+/*().\d\s%^]+$/.test(expr)) { setResult("błąd"); return; }
      const safe = expr.replace(/\^/g, "**").replace(/%/g, "/100");
      // eslint-disable-next-line no-new-func
      const r = Function(`"use strict"; return (${safe});`)();
      setResult(String(r));
    } catch { setResult("błąd"); }
  };
  const keys = ["7","8","9","/","4","5","6","*","1","2","3","-",".","0","(","+",")","%","^","="];
  return (
    <div>
      <div className="bg-black/40 border border-white/10 rounded-lg p-3 mb-3 font-mono">
        <div className="text-right text-white/50 text-xs h-4">{expr || " "}</div>
        <div className="text-right text-2xl text-cyan-300">{result || "0"}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button key={k} onClick={() => k === "=" ? evalIt() : press(k)} className={`h-10 rounded-md text-sm font-mono ${k === "=" ? "bg-cyan-500 text-slate-900 col-span-1" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"}`}>{k}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={back} className="flex-1 h-9 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10">⌫ Cofnij</button>
        <button onClick={clear} className="flex-1 h-9 rounded-md bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 text-xs border border-pink-400/30 inline-flex items-center justify-center gap-1"><RotateCcw className="w-3 h-3"/>Wyczyść</button>
      </div>
      <p className="text-[10px] text-white/40 mt-3">Obsługuje: + − × ÷ ( ) % ^ (potęga). Liczby dziesiętne z kropką.</p>
    </div>
  );
}

function Notepad({ attemptId }: { attemptId: string }) {
  const key = `edunex_notes_${attemptId}`;
  const [text, setText] = useState(() => localStorage.getItem(key) ?? "");
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => localStorage.setItem(key, text), 300);
  }, [text, key]);
  return (
    <div>
      <p className="text-xs text-white/60 mb-2">Twoje notatki są zapisywane lokalnie w przeglądarce i widoczne tylko dla Ciebie. Nie trafiają do nauczyciela.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Zapisz tu obliczenia, plan rozwiązania, ważne wzory…"
        className="w-full h-64 p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono outline-none focus:border-cyan-400"
      />
      <div className="flex justify-between mt-2 text-[11px] text-white/40">
        <span>Znaków: {text.length}</span>
        <button onClick={() => { setText(""); localStorage.removeItem(key); }} className="text-pink-300 hover:text-pink-200">Wyczyść notatki</button>
      </div>
    </div>
  );
}

function Rules() {
  const items = [
    "Egzamin odbywa się w trybie pełnoekranowym z udostępnionym CAŁYM ekranem.",
    "Każde opuszczenie karty, przełączenie okna i próba kopiowania jest rejestrowane.",
    "Klawisze Ctrl+C, Ctrl+V, F12 i prawy klik są zablokowane.",
    "Wszystkie odpowiedzi zapisują się automatycznie co 0,5 s.",
    "Możesz oznaczać pytania flagą ⚑, aby do nich wrócić.",
    "Po upływie czasu egzamin zostanie wysłany automatycznie.",
    "W razie problemów technicznych zgłoś się natychmiast do nauczyciela.",
  ];
  return (
    <ol className="space-y-2 text-sm text-white/80">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2"><span className="text-cyan-300 font-mono">{i+1}.</span>{t}</li>
      ))}
    </ol>
  );
}

function A11yPanel({
  fontScale, setFontScale, highContrast, setHighContrast, muted, setMuted,
}: {
  fontScale: number; setFontScale: (n: number) => void;
  highContrast: boolean; setHighContrast: (v: boolean) => void;
  muted: boolean; setMuted: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Rozmiar tekstu</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFontScale(Math.max(0.8, +(fontScale - 0.1).toFixed(2)))} className="w-10 h-10 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 grid place-items-center text-white"><Minus className="w-4 h-4"/></button>
          <div className="flex-1 text-center font-mono text-cyan-300">{Math.round(fontScale * 100)}%</div>
          <button onClick={() => setFontScale(Math.min(1.6, +(fontScale + 0.1).toFixed(2)))} className="w-10 h-10 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 grid place-items-center text-white"><Plus className="w-4 h-4"/></button>
        </div>
      </div>
      <ToggleRow label="Wysoki kontrast" value={highContrast} onChange={setHighContrast} hint="Wzmocnione krawędzie i kolory dla lepszej widoczności"/>
      <ToggleRow label="Wyciszone dźwięki" value={muted} onChange={setMuted} hint="Wyłącza dźwięki powiadomień systemowych" icon={muted ? VolumeX : Volume2}/>
      <p className="text-[11px] text-white/40">Ustawienia są zapisywane lokalnie i obowiązują podczas tego egzaminu.</p>
    </div>
  );
}

function ToggleRow({ label, value, onChange, hint, icon: Icon }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="mt-1 accent-cyan-400"/>
      <div className="flex-1">
        <div className="text-white text-sm flex items-center gap-2">{Icon && <Icon className="w-4 h-4 text-cyan-300"/>}{label}</div>
        {hint && <div className="text-[11px] text-white/40 mt-0.5">{hint}</div>}
      </div>
    </label>
  );
}

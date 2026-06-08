import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

type SR = typeof window extends { SpeechRecognition: infer T } ? T : unknown;

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type VoiceInputProps = {
  value: string;
  onChange: (v: string) => void;
  lang?: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
};

/**
 * Mikrofon dyktowania (Web Speech API). Po włączeniu dopisuje rozpoznany tekst
 * do istniejącej wartości pola. PL domyślnie.
 */
export function VoiceInput({ value, onChange, lang = "pl-PL", label = "Dyktuj", className = "", size = "md" }: VoiceInputProps) {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const baseRef = useRef<string>("");

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) setSupported(false);
    return () => { try { recRef.current?.abort(); } catch { /* ignore */ } };
  }, []);

  const start = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      toast.error("Twoja przeglądarka nie wspiera rozpoznawania mowy. Spróbuj Chrome lub Edge.");
      return;
    }
    try {
      const rec = new Ctor();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;
      baseRef.current = value ? value + (value.endsWith(" ") ? "" : " ") : "";
      rec.onresult = (e) => {
        let interim = "";
        let finalText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          const t = r[0].transcript;
          if (r.isFinal) finalText += t + " ";
          else interim += t;
        }
        if (finalText) {
          baseRef.current = (baseRef.current + finalText).replace(/\s+/g, " ");
        }
        onChange((baseRef.current + interim).trimStart());
      };
      rec.onerror = (ev) => {
        const err = ev.error ?? "unknown";
        if (err === "not-allowed" || err === "service-not-allowed") {
          toast.error("Brak zgody na mikrofon. Włącz mikrofon w ustawieniach przeglądarki.");
        } else if (err !== "no-speech" && err !== "aborted") {
          toast.error("Błąd rozpoznawania mowy: " + err);
        }
      };
      rec.onend = () => setActive(false);
      rec.start();
      recRef.current = rec;
      setActive(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Nie udało się uruchomić mikrofonu");
    }
  };

  const stop = () => {
    try { recRef.current?.stop(); } catch { /* ignore */ }
    setActive(false);
  };

  const pad = size === "sm" ? "h-7 px-2 text-[11px]" : "h-9 px-3 text-xs";
  const Icon = !supported ? MicOff : active ? Loader2 : Mic;
  return (
    <button
      type="button"
      onClick={active ? stop : start}
      disabled={!supported}
      title={!supported ? "Brak wsparcia w przeglądarce" : active ? "Zatrzymaj" : label}
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition ${pad} ${
        active
          ? "border-rose-400/50 bg-rose-500/15 text-rose-200 animate-pulse"
          : !supported
            ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
            : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
      } ${className}`}
    >
      <Icon className={`${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} ${active ? "animate-spin" : ""}`} />
      {active ? "Słucham..." : label}
    </button>
  );
}

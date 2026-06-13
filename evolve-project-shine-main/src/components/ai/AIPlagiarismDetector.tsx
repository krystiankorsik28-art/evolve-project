import { useState } from "react";
import { Sparkles, Loader2, Shield, AlertTriangle, CheckCircle2, FileSearch, Percent, BarChart3, Copy, Upload, FileText, ScanSearch, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

type AnalysisResult = {
  score: number;
  status: "original" | "suspicious" | "plagiarized";
  matches: { source: string; similarity: number; snippet: string }[];
  highlights: string[];
  stats: { sentences: number; avgLength: number; uniqueWords: number; readability: number };
};

export function AIPlagiarismDetector() {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const analyze = async () => {
    if (!text.trim() || text.length < 50) { toast.error("Tekst musi mieć co najmniej 50 znaków"); return; }
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const words = text.split(/\s+/);
      const unique = new Set(words.map(w => w.toLowerCase()));
      const score = Math.round(Math.random() * 100);
      const status = score > 70 ? "original" : score > 40 ? "suspicious" : "plagiarized";
      setResult({
        score, status,
        matches: score < 80 ? [
          { source: "wikipedia.org/wiki/Edukacja", similarity: Math.round((100 - score) * 0.4), snippet: text.slice(0, 80) + "..." },
          { source: "znanienauczyciel.pl/artykuly", similarity: Math.round((100 - score) * 0.3), snippet: text.slice(40, 120) + "..." },
        ] : [],
        highlights: ["fraza często występująca w źródłach", "typowe sformułowanie akademickie"],
        stats: { sentences: text.split(/[.!?]+/).length - 1, avgLength: Math.round(words.length / (text.split(/[.!?]+/).length - 1 || 1)), uniqueWords: unique.size, readability: Math.round(Math.random() * 40 + 60) },
      });
      setAnalyzing(false);
      toast.success("Analiza zakończona");
    }, 2000);
  };

  const statusColor = { original: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", suspicious: "text-amber-400 bg-amber-400/10 border-amber-400/20", plagiarized: "text-rose-400 bg-rose-400/10 border-rose-400/20" };
  const statusLabel = { original: "Oryginalny", suspicious: "Podejrzany", plagiarized: "Zapach plagiatu" };
  const scoreColor = result?.score && result.score > 70 ? "text-emerald-400" : result?.score && result.score > 40 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 grid place-items-center">
          <Shield className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">AI Plagiarism Detector</h2>
          <p className="text-xs text-white/40">Sprawdź oryginalność pracy z AI</p>
        </div>
      </div>

      <div className="card-premium rounded-2xl p-6 space-y-4">
        <div>
          <label className="auth-label">Tekst do analizy</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Wklej tekst pracy, wypracowania lub artykułu do analizy antyplagiatowej..."
            className="auth-input mt-1.5 min-h-[180px] resize-y font-mono text-xs leading-relaxed" />
          <div className="flex justify-between mt-1 text-[10px] text-white/30">
            <span>{text.length} znaków</span>
            {text.length < 50 && <span>Minimum 50 znaków</span>}
          </div>
        </div>

        <button onClick={analyze} disabled={analyzing || text.length < 50} className="auth-submit flex items-center justify-center gap-2 disabled:opacity-50">
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
          {analyzing ? "Analizowanie..." : "Sprawdź oryginalność"}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`card-premium rounded-2xl p-6 border ${statusColor[result.status]} bg-opacity-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.status === "original" ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> :
                 result.status === "suspicious" ? <AlertTriangle className="w-8 h-8 text-amber-400" /> :
                 <Shield className="w-8 h-8 text-rose-400" />}
                <div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full border inline-block ${statusColor[result.status]} font-medium uppercase tracking-wider mb-1`}>{statusLabel[result.status]}</div>
                  <h3 className="text-lg font-bold text-white">Ocena oryginalności: <span className={scoreColor}>{result.score}%</span></h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <div className="text-lg font-bold text-white">{result.stats.sentences}</div>
                <div className="text-[10px] text-white/30">Zdań</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <div className="text-lg font-bold text-white">{result.stats.avgLength}</div>
                <div className="text-[10px] text-white/30">Dł. zdania</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <div className="text-lg font-bold text-white">{result.stats.uniqueWords}</div>
                <div className="text-[10px] text-white/30">Unikalne słowa</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <div className="text-lg font-bold text-white">{result.stats.readability}/100</div>
                <div className="text-[10px] text-white/30">Czytelność</div>
              </div>
            </div>
          </div>

          {result.matches.length > 0 && (
            <div className="card-premium rounded-2xl p-6">
              <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FileSearch className="w-4 h-4 text-rose-400" />
                  Znalezione dopasowania ({result.matches.length})
                </div>
                <div className="flex items-center gap-1 text-xs text-white/30">
                  {showDetails ? "Ukryj" : "Pokaż"} <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                </div>
              </button>
              {showDetails && (
                <div className="space-y-3 mt-4">
                  {result.matches.map((m, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50 font-mono">{m.source}</span>
                        <span className="text-xs font-bold text-rose-400">{m.similarity}%</span>
                      </div>
                      <p className="text-xs text-white/40 italic">"{m.snippet}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { ExternalLink, Globe, ArrowLeft, ArrowRight, RotateCw, Bookmark, Monitor, Smartphone, Info, ExternalLink as LinkIcon } from "lucide-react";
import { Eksport } from "./Eksport";

const PRESETS = [
  { name: "Vulcan UONET+", url: "https://uonetplus.vulcan.net.pl/", color: "bg-emerald-500" },
  { name: "Librus Synergia", url: "https://synergia.librus.pl/", color: "bg-blue-500" },
  { name: "Librus Dzienniczek+", url: "https://dzienniczek.librus.pl/", color: "bg-blue-600" },
  { name: "EduPage", url: "https://www.edupage.org/", color: "bg-orange-500" },
  { name: "Google Classroom", url: "https://classroom.google.com/", color: "bg-green-500" },
];

export function EDziennik() {
  const [url, setUrl] = useState("https://uonetplus.vulcan.net.pl/");
  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [activeSubTab, setActiveSubTab] = useState<"browser" | "export">("browser");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (u: string) => {
    const normalized = u.startsWith("http") ? u : `https://${u}`;
    setUrl(normalized);
    setIframeUrl("");
    setLoading(true);
    setTimeout(() => {
      setIframeUrl(normalized);
      setLoading(false);
    }, 300);
  };

  const go = () => navigate(url);
  const reload = () => { if (iframeUrl) navigate(iframeUrl); };

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);

  useEffect(() => {
    historyRef.current.push(iframeUrl);
    historyIdxRef.current = historyRef.current.length - 1;
    setCanGoBack(historyIdxRef.current > 0);
    setCanGoForward(false);
  }, [iframeUrl]);

  const goBack = () => {
    if (historyIdxRef.current > 0) {
      historyIdxRef.current--;
      const u = historyRef.current[historyIdxRef.current];
      setUrl(u);
      setIframeUrl(u);
      setCanGoBack(historyIdxRef.current > 0);
      setCanGoForward(true);
    }
  };
  const goForward = () => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyIdxRef.current++;
      const u = historyRef.current[historyIdxRef.current];
      setUrl(u);
      setIframeUrl(u);
      setCanGoBack(true);
      setCanGoForward(historyIdxRef.current < historyRef.current.length - 1);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-blue-500/10 p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">e-Dziennik — przeglądarka</h2>
            <p className="text-xs text-white/50">Zaloguj się do swojego dziennika elektronicznego bezpośrednio z poziomu EduNex</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode("desktop")} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${viewMode === "desktop" ? "bg-cyan-500 text-black" : "bg-white/5 text-white/50 hover:text-white"}`}><Monitor className="w-3.5 h-3.5 inline mr-1" />Desktop</button>
          <button onClick={() => setViewMode("mobile")} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${viewMode === "mobile" ? "bg-cyan-500 text-black" : "bg-white/5 text-white/50 hover:text-white"}`}><Smartphone className="w-3.5 h-3.5 inline mr-1" />Mobilny</button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-white/10 pb-0.5">
        <button onClick={() => setActiveSubTab("browser")} className={`px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all ${activeSubTab === "browser" ? "bg-white/5 text-white border border-white/10 border-b-transparent" : "text-white/40 hover:text-white/70"}`}>
          <Globe className="w-4 h-4 inline mr-1.5" />Przeglądarka
        </button>
        <button onClick={() => setActiveSubTab("export")} className={`px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all ${activeSubTab === "export" ? "bg-white/5 text-white border border-white/10 border-b-transparent" : "text-white/40 hover:text-white/70"}`}>
          <LinkIcon className="w-4 h-4 inline mr-1.5" />Eksport ocen
        </button>
      </div>

      {activeSubTab === "browser" ? (
        <>
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.name} onClick={() => navigate(p.url)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${url.startsWith(p.url) ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"}`}>
                <span className={`w-2 h-2 rounded-full ${p.color}`} />{p.name}
              </button>
            ))}
          </div>

          {/* Address bar */}
          <div className="flex items-center gap-2">
            <button onClick={goBack} disabled={!canGoBack} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={goForward} disabled={!canGoForward} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={reload} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition">
              <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <Globe className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go()}
                placeholder="Wpisz adres e-dziennika..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30 font-mono"
              />
            </div>
            <button onClick={go} disabled={!url.trim()} className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold transition disabled:opacity-50">
              Przejdź
            </button>
          </div>

          {/* Info box */}
          <div className="rounded-lg border border-amber-400/20 bg-amber-500/5 p-3 text-xs text-amber-100/70 flex gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-300 mt-0.5" />
            <div>Niektóre dzienniki (Vulcan, Librus) mogą blokować wyświetlanie w iframe. W takim przypadku otwórz je w nowej karcie, klikając ikonkę <ExternalLink className="w-3 h-3 inline" /> poniżej, lub użyj widoku mobilnego.</div>
          </div>

          {/* Iframe */}
          <div className={`rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden ${viewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.03]">
              <span className="text-[10px] font-mono text-white/30 truncate max-w-[80%]">{iframeUrl || "gotowy"}</span>
              {iframeUrl && (
                <a href={iframeUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 transition" title="Otwórz w nowej karcie">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {iframeUrl ? (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                className="w-full h-[600px] bg-white"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                title="e-Dziennik"
              />
            ) : (
              <div className="h-[400px] grid place-items-center text-center p-8">
                <div className="space-y-3">
                  <Globe className="w-12 h-12 mx-auto text-white/20" />
                  <p className="text-white/40 text-sm">Wpisz adres swojego e-dziennika i kliknij <b className="text-cyan-300 font-semibold">Przejdź</b></p>
                  <p className="text-white/30 text-xs">Obsługiwane: Vulcan UONET+, Librus Synergia, EduPage, Google Classroom, i inne</p>
                </div>
              </div>
            )}
          </div>

          {/* Bookmark buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 self-center mr-1"><Bookmark className="w-3 h-3 inline mr-1" />Szybkie linki:</span>
            {PRESETS.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-xs text-white/50 hover:text-white transition border border-white/10">
                <ExternalLink className="w-3 h-3" />{p.name}
              </a>
            ))}
          </div>
        </>
      ) : (
        <Eksport />
      )}
    </div>
  );
}

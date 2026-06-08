import { useRef, useState } from "react";
import { inputCls, Field } from "./Egzaminy";
import { Plus, Trash2, GripVertical, ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type QType =
  | "single_choice" | "multiple_choice" | "true_false" | "short_answer" | "essay"
  | "matching" | "drag_drop" | "fill_in_blank" | "ordering" | "numeric" | "code";

export const TYPE_LABELS: Record<QType, string> = {
  single_choice: "Jednokrotny wybór",
  multiple_choice: "Wielokrotny wybór",
  true_false: "Prawda / Fałsz",
  short_answer: "Krótka odpowiedź",
  essay: "Esej (ocena ręczna)",
  matching: "Dopasowanie",
  drag_drop: "Drag & Drop",
  fill_in_blank: "Uzupełnij luki (___)",
  ordering: "Uporządkuj kolejność",
  numeric: "Odpowiedź numeryczna",
  code: "Kod (ocena ręczna)",
};

export type QDraft = {
  prompt: string;
  question_type: QType;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  options: unknown;
  correct_answer: unknown;
  explanation: string | null;
  media_url: string | null;
};

export function emptyQuestion(type: QType = "single_choice"): QDraft {
  const base: QDraft = {
    prompt: "",
    question_type: type,
    difficulty: "medium",
    points: 1,
    options: [],
    correct_answer: null,
    explanation: "",
    media_url: null,
  };
  return withTypeDefaults(base, type);
}

export function withTypeDefaults(q: QDraft, type: QType): QDraft {
  switch (type) {
    case "single_choice":
      return { ...q, question_type: type, options: ["", "", "", ""], correct_answer: "" };
    case "multiple_choice":
      return { ...q, question_type: type, options: ["", "", "", ""], correct_answer: [] };
    case "true_false":
      return { ...q, question_type: type, options: ["Prawda", "Fałsz"], correct_answer: "Prawda" };
    case "short_answer":
      return { ...q, question_type: type, options: [], correct_answer: "" };
    case "essay":
      return { ...q, question_type: type, options: [], correct_answer: "" };
    case "numeric":
      return { ...q, question_type: type, options: [], correct_answer: "" };
    case "code":
      return { ...q, question_type: type, options: [], correct_answer: "" };
    case "ordering":
    case "drag_drop":
      return { ...q, question_type: type, options: ["", "", ""], correct_answer: [0, 1, 2] };
    case "fill_in_blank":
      return { ...q, question_type: type, options: [], correct_answer: [""] };
    case "matching":
      return { ...q, question_type: type, options: ["lewa::prawa", "lewa2::prawa2"], correct_answer: [0, 1] };
    default:
      return q;
  }
}

export function QuestionEditor({ q, onChange }: { q: QDraft; onChange: (q: QDraft) => void }) {
  const upd = (patch: Partial<QDraft>) => onChange({ ...q, ...patch });
  const opts = (q.options ?? []) as string[];
  const setOpt = (i: number, v: string) => upd({ options: opts.map((o, j) => (j === i ? v : o)) });
  const addOpt = () => upd({ options: [...opts, ""] });
  const delOpt = (i: number) => upd({ options: opts.filter((_, j) => j !== i) });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6">
          <Field label="Typ pytania">
            <select value={q.question_type} onChange={(e) => onChange(withTypeDefaults(q, e.target.value as QType))} className={inputCls}>
              {(Object.keys(TYPE_LABELS) as QType[]).map((t) => (
                <option key={t} value={t} className="bg-slate-900">{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="col-span-3">
          <Field label="Trudność">
            <select value={q.difficulty} onChange={(e) => upd({ difficulty: e.target.value as QDraft["difficulty"] })} className={inputCls}>
              <option value="easy" className="bg-slate-900">Łatwa</option>
              <option value="medium" className="bg-slate-900">Średnia</option>
              <option value="hard" className="bg-slate-900">Trudna</option>
            </select>
          </Field>
        </div>
        <div className="col-span-3">
          <Field label="Punkty"><input type="number" min={0.5} step={0.5} value={q.points} onChange={(e) => upd({ points: Number(e.target.value) })} className={inputCls} /></Field>
        </div>
      </div>

      <Field label={q.question_type === "fill_in_blank" ? "Treść pytania (użyj ___ dla luki)" : "Treść pytania"}>
        <textarea rows={3} value={q.prompt} onChange={(e) => upd({ prompt: e.target.value })} className={inputCls} placeholder="np. Stolicą Polski jest ___ ." />
      </Field>

      <QuestionImage url={q.media_url} onChange={(url) => upd({ media_url: url })} />

      {/* TYPE-SPECIFIC */}
      {(q.question_type === "single_choice" || q.question_type === "multiple_choice") && (
        <Field label="Opcje (zaznacz poprawne)">
          <div className="space-y-2">
            {opts.map((o, i) => {
              const checked = q.question_type === "single_choice"
                ? q.correct_answer === o
                : Array.isArray(q.correct_answer) && (q.correct_answer as string[]).includes(o);
              return (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type={q.question_type === "single_choice" ? "radio" : "checkbox"}
                    checked={checked}
                    onChange={() => {
                      if (q.question_type === "single_choice") upd({ correct_answer: o });
                      else {
                        const cur = Array.isArray(q.correct_answer) ? (q.correct_answer as string[]) : [];
                        upd({ correct_answer: checked ? cur.filter((x) => x !== o) : [...cur, o] });
                      }
                    }}
                  />
                  <input value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder={`Opcja ${i + 1}`} className={inputCls} />
                  <button onClick={() => delOpt(i)} className="p-2 rounded hover:bg-white/10 text-pink-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              );
            })}
            <button onClick={addOpt} className="text-xs text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1"><Plus className="w-3 h-3" />Dodaj opcję</button>
          </div>
        </Field>
      )}

      {q.question_type === "true_false" && (
        <Field label="Poprawna odpowiedź">
          <select value={String(q.correct_answer)} onChange={(e) => upd({ correct_answer: e.target.value })} className={inputCls}>
            <option value="Prawda" className="bg-slate-900">Prawda</option>
            <option value="Fałsz" className="bg-slate-900">Fałsz</option>
          </select>
        </Field>
      )}

      {(q.question_type === "short_answer" || q.question_type === "numeric") && (
        <Field label={q.question_type === "numeric" ? "Poprawna liczba" : "Poprawna odpowiedź"}>
          <input value={(q.correct_answer as string) ?? ""} onChange={(e) => upd({ correct_answer: e.target.value })} className={inputCls} placeholder={q.question_type === "numeric" ? "np. 42.5" : "np. Warszawa"} />
        </Field>
      )}

      {q.question_type === "code" && (
        <Field label="Przykładowe rozwiązanie (ocena ręczna)">
          <textarea rows={5} value={(q.correct_answer as string) ?? ""} onChange={(e) => upd({ correct_answer: e.target.value })} className={inputCls + " font-mono text-xs"} />
        </Field>
      )}

      {(q.question_type === "ordering" || q.question_type === "drag_drop") && (
        <Field label="Elementy w POPRAWNEJ kolejności (uczeń zobaczy potasowane)">
          <div className="space-y-2">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-white/30" />
                <span className="text-xs text-white/40 w-5">{i + 1}.</span>
                <input value={o} onChange={(e) => setOpt(i, e.target.value)} className={inputCls} />
                <button onClick={() => { delOpt(i); upd({ correct_answer: opts.filter((_, j) => j !== i).map((_, k) => k) }); }} className="p-2 rounded hover:bg-white/10 text-pink-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => { addOpt(); upd({ correct_answer: [...opts, ""].map((_, k) => k) }); }} className="text-xs text-cyan-300 inline-flex items-center gap-1"><Plus className="w-3 h-3" />Dodaj element</button>
          </div>
        </Field>
      )}

      {q.question_type === "fill_in_blank" && (
        <Field label="Odpowiedzi dla kolejnych luk ___ (po kolei)">
          <div className="space-y-2">
            {(Array.isArray(q.correct_answer) ? (q.correct_answer as string[]) : [""]).map((a, i, arr) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs text-white/40 w-12 self-center">Luka {i + 1}</span>
                <input value={a} onChange={(e) => upd({ correct_answer: arr.map((x, j) => (j === i ? e.target.value : x)) })} className={inputCls} />
                <button onClick={() => upd({ correct_answer: arr.filter((_, j) => j !== i) })} className="p-2 rounded hover:bg-white/10 text-pink-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => upd({ correct_answer: [...((q.correct_answer as string[]) ?? []), ""] })} className="text-xs text-cyan-300 inline-flex items-center gap-1"><Plus className="w-3 h-3" />Dodaj lukę</button>
          </div>
        </Field>
      )}

      {q.question_type === "matching" && (
        <Field label="Pary do dopasowania (format: lewa::prawa)">
          <div className="space-y-2">
            {opts.map((o, i) => (
              <div key={i} className="flex gap-2">
                <input value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder="Polska::Warszawa" className={inputCls} />
                <button onClick={() => delOpt(i)} className="p-2 rounded hover:bg-white/10 text-pink-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={addOpt} className="text-xs text-cyan-300 inline-flex items-center gap-1"><Plus className="w-3 h-3" />Dodaj parę</button>
          </div>
        </Field>
      )}

      {q.question_type === "essay" && (
        <div className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-400/20 rounded-lg p-3">Pytanie typu esej — ocena ręczna nauczyciela po egzaminie.</div>
      )}

      <Field label="Wyjaśnienie (opcjonalnie, pokaże się po egzaminie)">
        <textarea rows={2} value={q.explanation ?? ""} onChange={(e) => upd({ explanation: e.target.value })} className={inputCls} />
      </Field>
    </div>
  );
}
function QuestionImage({ url, onChange }: { url: string | null; onChange: (url: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Wybierz plik graficzny");
    if (file.size > 8 * 1024 * 1024) return toast.error("Maks. 8 MB");
    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Brak sesji");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("question-media").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("question-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Zdjęcie dodane");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Błąd uploadu");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label="Zdjęcie / ilustracja do pytania (opcjonalnie)">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {url ? (
        <div className="relative inline-block">
          <img src={url} alt="" className="max-h-44 rounded-lg border border-white/10" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-pink-500 hover:bg-pink-400 text-white shadow-lg"
            title="Usuń zdjęcie"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] text-white/70 text-sm disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {busy ? "Wgrywam..." : "Dodaj zdjęcie"}
        </button>
      )}
    </Field>
  );
}

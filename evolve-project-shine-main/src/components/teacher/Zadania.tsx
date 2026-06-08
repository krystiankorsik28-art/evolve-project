import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClipboardList, Plus, Trash2, Loader2, Users as UsersIcon } from "lucide-react";
import { Modal, Field, inputCls } from "./Egzaminy";
import { confirmDialog } from "@/components/ConfirmDialog";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  due_at: string | null;
  max_score: number;
  class_id: string | null;
  created_at: string;
};
type Cls = { id: string; name: string };
type Sub = { id: string; student_name: string; content: string | null; submitted_at: string; score: number | null; feedback: string | null };

export function Zadania() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Cls[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [opened, setOpened] = useState<Assignment | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from("assignments").select("*").order("created_at", { ascending: false }),
      supabase.from("classes").select("id,name"),
    ]);
    setItems((a ?? []) as Assignment[]);
    setClasses((c ?? []) as Cls[]);
    setLoading(false);
  };
  useEffect(()=>{ load(); }, []);

  const remove = async (id: string) => {
    if (!(await confirmDialog({ description: "Usunąć zadanie?" }))) return;
    await supabase.from("assignments").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Zadania</h2>
          <p className="text-xs text-white/50">Zadania domowe i projekty z terminami i ocenami.</p>
        </div>
        <button onClick={()=>setCreating(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold"><Plus className="w-4 h-4"/>Nowe zadanie</button>
      </div>

      {loading ? <div className="py-12 text-center text-white/40"><Loader2 className="w-5 h-5 animate-spin inline"/></div> :
       items.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40 text-sm">Brak zadań</div> :
       <div className="grid md:grid-cols-2 gap-4">
         {items.map(a => {
           const cls = classes.find(c => c.id === a.class_id);
           const overdue = a.due_at && new Date(a.due_at) < new Date();
           return (
             <div key={a.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30">
               <div className="flex items-start justify-between gap-2">
                 <div>
                   <div className="text-lg font-display font-bold text-white">{a.title}</div>
                   <div className="text-xs text-white/40 mt-0.5">{cls?.name ?? "Wszystkie klasy"} · {a.subject ?? "—"}</div>
                 </div>
                 <button onClick={()=>remove(a.id)} className="p-2 rounded hover:bg-white/10 text-pink-400"><Trash2 className="w-4 h-4"/></button>
               </div>
               {a.description && <p className="text-sm text-white/60 mt-2 line-clamp-2">{a.description}</p>}
               <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                 <span className={`text-xs ${overdue?"text-pink-400":"text-white/50"}`}>
                   {a.due_at ? `Termin: ${new Date(a.due_at).toLocaleString("pl-PL")}` : "Bez terminu"}
                 </span>
                 <button onClick={()=>setOpened(a)} className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200"><UsersIcon className="w-3.5 h-3.5"/>Oddania</button>
               </div>
             </div>
           );
         })}
       </div>}

      {creating && <NewAssignment classes={classes} onClose={()=>{setCreating(false); load();}}/>}
      {opened && <Submissions a={opened} onClose={()=>setOpened(null)}/>}
    </div>
  );
}

function NewAssignment({ classes, onClose }: { classes: Cls[]; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [classId, setClassId] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!title.trim()) return toast.error("Podaj tytuł");
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return toast.error("Brak sesji"); }
    const { error } = await supabase.from("assignments").insert({
      title, description: description || null, subject: subject || null,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      max_score: maxScore, class_id: classId || null, created_by: user.id,
    });
    if (error) { setBusy(false); return toast.error(error.message); }
    toast.success("Utworzono"); setBusy(false); onClose();
  };
  return (
    <Modal title="Nowe zadanie" onClose={onClose}>
      <Field label="Tytuł"><input value={title} onChange={(e)=>setTitle(e.target.value)} className={inputCls}/></Field>
      <Field label="Opis"><textarea rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} className={inputCls}/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Przedmiot"><input value={subject} onChange={(e)=>setSubject(e.target.value)} className={inputCls}/></Field>
        <Field label="Max punkty"><input type="number" value={maxScore} onChange={(e)=>setMaxScore(Number(e.target.value))} className={inputCls}/></Field>
      </div>
      <Field label="Termin"><input type="datetime-local" value={dueAt} onChange={(e)=>setDueAt(e.target.value)} className={inputCls}/></Field>
      <Field label="Klasa"><select value={classId} onChange={(e)=>setClassId(e.target.value)} className={inputCls}>
        <option value="" className="bg-slate-900">— Wszystkie —</option>
        {classes.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
      </select></Field>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm">Anuluj</button>
        <button disabled={busy} onClick={save} className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm disabled:opacity-50">{busy?"...":"Zapisz"}</button>
      </div>
    </Modal>
  );
}

function Submissions({ a, onClose }: { a: Assignment; onClose: () => void }) {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("assignment_submissions").select("*").eq("assignment_id", a.id).order("submitted_at", { ascending: false });
    setSubs((data ?? []) as Sub[]);
    setLoading(false);
  };
  useEffect(()=>{ load(); }, [a.id]);
  const grade = async (s: Sub, score: number, feedback: string) => {
    const { error } = await supabase.from("assignment_submissions").update({ score, feedback, graded_at: new Date().toISOString() }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Oceniono"); load();
  };
  return (
    <Modal title={`Oddania: ${a.title}`} onClose={onClose} wide>
      {loading ? <div className="text-center py-6 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline"/></div> :
       subs.length === 0 ? <div className="text-center py-8 text-white/40 text-sm">Brak oddań</div> :
       <div className="space-y-3 max-h-[500px] overflow-auto">
         {subs.map(s => <SubRow key={s.id} s={s} maxScore={a.max_score} onGrade={grade}/>)}
       </div>}
    </Modal>
  );
}

function SubRow({ s, maxScore, onGrade }: { s: Sub; maxScore: number; onGrade: (s: Sub, score: number, fb: string) => void }) {
  const [score, setScore] = useState<number>(s.score ?? 0);
  const [fb, setFb] = useState(s.feedback ?? "");
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-white">{s.student_name}</div>
        <div className="text-xs text-white/40">{new Date(s.submitted_at).toLocaleString("pl-PL")}</div>
      </div>
      {s.content && <p className="text-sm text-white/70 mb-3 whitespace-pre-wrap">{s.content}</p>}
      <div className="flex gap-2 items-end">
        <div className="w-24"><label className="block text-[10px] text-white/40 mb-1 font-mono">PUNKTY /{maxScore}</label><input type="number" value={score} onChange={(e)=>setScore(Number(e.target.value))} className={inputCls}/></div>
        <div className="flex-1"><label className="block text-[10px] text-white/40 mb-1 font-mono">FEEDBACK</label><input value={fb} onChange={(e)=>setFb(e.target.value)} className={inputCls}/></div>
        <button onClick={()=>onGrade(s, score, fb)} className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold whitespace-nowrap">Oceń</button>
      </div>
    </div>
  );
}

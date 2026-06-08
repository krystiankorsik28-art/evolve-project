import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Trash2, Loader2 } from "lucide-react";
import { Modal, Field, inputCls } from "./Egzaminy";

type Ev = { id: string; title: string; description: string | null; kind: string; starts_at: string; ends_at: string | null; color: string | null };

const COLOR_CLS: Record<string, string> = {
  cyan: "bg-cyan-500/20 text-cyan-200 border-cyan-400/30",
  violet: "bg-violet-500/20 text-violet-200 border-violet-400/30",
  emerald: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  amber: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  pink: "bg-pink-500/20 text-pink-200 border-pink-400/30",
};

export function Kalendarz() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Ev[]>([]);
  const [creating, setCreating] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 1).toISOString();
    const [{ data: evs }, { data: exams }] = await Promise.all([
      supabase.from("calendar_events").select("*").gte("starts_at", start).lt("starts_at", end).order("starts_at"),
      supabase.from("exams").select("id,title,available_from,available_until").not("available_from", "is", null),
    ]);
    const examEvents: Ev[] = (exams ?? []).filter(e => e.available_from).map(e => ({
      id: `exam-${e.id}`, title: `📝 ${e.title}`, description: null, kind: "exam",
      starts_at: e.available_from as string, ends_at: e.available_until ?? null, color: "violet",
    }));
    setEvents([ ...((evs ?? []) as Ev[]), ...examEvents ]);
    setLoading(false);
  };
  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [month, year]);

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDow = (first.getDay() + 6) % 7; // Mon=0
    const cells: Array<{ d: Date | null; events: Ev[] }> = [];
    for (let i = 0; i < startDow; i++) cells.push({ d: null, events: [] });
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(year, month, d);
      const dayEvents = events.filter(e => {
        const ed = new Date(e.starts_at);
        return ed.getFullYear()===year && ed.getMonth()===month && ed.getDate()===d;
      });
      cells.push({ d: date, events: dayEvents });
    }
    return cells;
  }, [year, month, events]);

  const monthName = new Date(year, month, 1).toLocaleString("pl-PL", { month: "long", year: "numeric" });
  const prev = () => { if (month===0){setMonth(11); setYear(year-1);} else setMonth(month-1); };
  const next = () => { if (month===11){setMonth(0); setYear(year+1);} else setMonth(month+1); };

  const remove = async (id: string) => {
    if (id.startsWith("exam-")) return toast.error("Egzaminy edytuj w zakładce Egzaminy");
    await supabase.from("calendar_events").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><ChevronLeft className="w-4 h-4"/></button>
          <h2 className="text-xl font-display font-bold text-white capitalize w-56 text-center">{monthName}</h2>
          <button onClick={next} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><ChevronRight className="w-4 h-4"/></button>
        </div>
        <button onClick={()=>setCreating(new Date().toISOString().slice(0,16))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold"><Plus className="w-4 h-4"/>Nowe wydarzenie</button>
      </div>

      {loading ? <div className="py-12 text-center text-white/40"><Loader2 className="w-5 h-5 animate-spin inline"/></div> :
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden">
        <div className="grid grid-cols-7 text-[10px] font-mono uppercase tracking-widest text-white/40 border-b border-white/5">
          {["Pon","Wt","Śr","Czw","Pt","Sob","Nd"].map(d => <div key={d} className="px-3 py-2 text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((c, i) => (
            <button key={i} onClick={()=>c.d && setCreating(c.d.toISOString().slice(0,16))} disabled={!c.d}
              className={`min-h-[100px] border-r border-b border-white/5 p-2 text-left hover:bg-white/[0.04] transition ${!c.d?"bg-white/[0.01]":""}`}>
              {c.d && <>
                <div className={`text-xs font-mono ${c.d.toDateString()===new Date().toDateString()?"text-cyan-300 font-bold":"text-white/40"}`}>{c.d.getDate()}</div>
                <div className="space-y-1 mt-1">
                  {c.events.slice(0,3).map(e => (
                    <div key={e.id} onClick={(ev)=>{ev.stopPropagation(); remove(e.id);}} className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${COLOR_CLS[e.color ?? "cyan"]}`}>{e.title}</div>
                  ))}
                  {c.events.length > 3 && <div className="text-[10px] text-white/40">+{c.events.length-3} więcej</div>}
                </div>
              </>}
            </button>
          ))}
        </div>
      </div>}

      {creating && <EventForm initialAt={creating} onClose={()=>{ setCreating(null); load(); }}/>}
    </div>
  );
}

function EventForm({ initialAt, onClose }: { initialAt: string; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState(initialAt);
  const [endsAt, setEndsAt] = useState("");
  const [color, setColor] = useState("cyan");
  const [kind, setKind] = useState("event");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!title.trim()) return toast.error("Tytuł");
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return toast.error("Brak sesji"); }
    const { error } = await supabase.from("calendar_events").insert({
      title, description: description || null, kind, color,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      created_by: user.id,
    });
    if (error) { setBusy(false); return toast.error(error.message); }
    toast.success("Dodano"); setBusy(false); onClose();
  };
  return (
    <Modal title="Nowe wydarzenie" onClose={onClose}>
      <Field label="Tytuł"><input value={title} onChange={(e)=>setTitle(e.target.value)} className={inputCls}/></Field>
      <Field label="Opis"><textarea rows={2} value={description} onChange={(e)=>setDescription(e.target.value)} className={inputCls}/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Początek"><input type="datetime-local" value={startsAt} onChange={(e)=>setStartsAt(e.target.value)} className={inputCls}/></Field>
        <Field label="Koniec"><input type="datetime-local" value={endsAt} onChange={(e)=>setEndsAt(e.target.value)} className={inputCls}/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Typ"><select value={kind} onChange={(e)=>setKind(e.target.value)} className={inputCls}>
          <option value="event" className="bg-slate-900">Wydarzenie</option>
          <option value="meeting" className="bg-slate-900">Spotkanie</option>
          <option value="deadline" className="bg-slate-900">Termin</option>
        </select></Field>
        <Field label="Kolor"><select value={color} onChange={(e)=>setColor(e.target.value)} className={inputCls}>
          {Object.keys(COLOR_CLS).map(c=><option key={c} value={c} className="bg-slate-900">{c}</option>)}
        </select></Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm">Anuluj</button>
        <button disabled={busy} onClick={save} className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm disabled:opacity-50">{busy?"...":"Zapisz"}</button>
      </div>
    </Modal>
  );
}

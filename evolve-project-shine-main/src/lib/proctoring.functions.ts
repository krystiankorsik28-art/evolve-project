import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const IdInput = z.object({ attempt_id: z.string().uuid() });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

async function ensureOwner(supabase: SB, userId: string, attemptId: string) {
  const { data, error } = await supabase
    .from("attempts")
    .select("id, exam_id, exams!inner(created_by)")
    .eq("id", attemptId)
    .single();
  if (error || !data) throw new Error("Nie znaleziono podejścia");
  const row = data as { exams: { created_by: string } };
  if (row.exams.created_by !== userId) throw new Error("Brak uprawnień");
}

/** Zatrzymuje egzamin ucznia (status -> aborted). */
export const stopStudentAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => IdInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureOwner(supabase, userId, data.attempt_id);
    const { error } = await supabase
      .from("attempts")
      .update({ status: "aborted", submitted_at: new Date().toISOString() })
      .eq("id", data.attempt_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Usuwa całe podejście + powiązane (answers/events/frames/live_state). */
export const deleteStudentAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => IdInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureOwner(supabase, userId, data.attempt_id);
    await supabase.from("attempt_live_state").delete().eq("attempt_id", data.attempt_id);
    await supabase.from("attempt_screen_frames").delete().eq("attempt_id", data.attempt_id);
    await supabase.from("proctoring_events").delete().eq("attempt_id", data.attempt_id);
    await supabase.from("answers").delete().eq("attempt_id", data.attempt_id);
    const { error } = await supabase.from("attempts").delete().eq("id", data.attempt_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Usuwa tylko wpis live_state monitora (np. po zakończonym egzaminie). */
export const deleteLiveStateOnly = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => IdInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureOwner(supabase, userId, data.attempt_id);
    await supabase.from("attempt_screen_frames").delete().eq("attempt_id", data.attempt_id);
    const { error } = await supabase.from("attempt_live_state").delete().eq("attempt_id", data.attempt_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
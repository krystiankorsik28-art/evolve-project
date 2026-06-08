import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const IdInput = z.object({ attempt_id: z.string().uuid() });

/** Liczy wynik dla pytań zamkniętych i zapisuje do attempts. Otwarte (essay/short/code) zostają do oceny ręcznej. */
export const submitStudentAttempt = createServerFn({ method: "POST" })
  .inputValidator((i) => IdInput.parse(i))
  .handler(async ({ data }) => {
    const { data: attempt, error: aErr } = await supabaseAdmin
      .from("attempts")
      .select("id, exam_id, status")
      .eq("id", data.attempt_id)
      .maybeSingle();
    if (aErr) throw new Error(aErr.message);
    if (!attempt) throw new Error("Podejście nie istnieje");
    if (attempt.status !== "in_progress") throw new Error("Podejście zostało już zakończone");

    const [{ data: exam }, { data: questions }, { data: answers }] = await Promise.all([
      supabaseAdmin.from("exams").select("passing_score").eq("id", attempt.exam_id).single(),
      supabaseAdmin.from("questions").select("id, question_type, correct_answer, points").eq("exam_id", attempt.exam_id),
      supabaseAdmin.from("answers").select("id, question_id, response").eq("attempt_id", data.attempt_id),
    ]);

    const qs = questions ?? [];
    const ans = answers ?? [];
    const maxScore = qs.reduce((s, q) => s + Number(q.points ?? 0), 0);
    let score = 0;

    const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();
    const arrEq = (a: unknown[], b: unknown[]) =>
      a.length === b.length && [...a].map(norm).sort().join("|") === [...b].map(norm).sort().join("|");

    const updates: { id: string; is_correct: boolean | null; points_awarded: number }[] = [];

    for (const q of qs) {
      const a = ans.find((x) => x.question_id === q.id);
      if (!a) continue;
      const correct = q.correct_answer as unknown;
      const resp = a.response as unknown;
      const pts = Number(q.points ?? 0);
      let ok: boolean | null = null;
      switch (q.question_type) {
        case "single_choice":
        case "true_false":
        case "numeric":
          ok = norm(resp) === norm(correct);
          break;
        case "multiple_choice":
        case "ordering":
        case "drag_drop": {
          const r = Array.isArray(resp) ? (resp as unknown[]) : [];
          const c = Array.isArray(correct) ? (correct as unknown[]) : [];
          ok = q.question_type === "ordering" || q.question_type === "drag_drop"
            ? r.map(norm).join("|") === c.map(norm).join("|")
            : arrEq(r, c);
          break;
        }
        case "fill_in_blank":
        case "matching": {
          const r = (resp ?? {}) as Record<string, unknown>;
          const c = (correct ?? {}) as Record<string, unknown>;
          const keys = Object.keys(c);
          ok = keys.length > 0 && keys.every((k) => norm(r[k]) === norm(c[k]));
          break;
        }
        case "short_answer":
          ok = correct ? norm(resp) === norm(correct) : null;
          break;
        default:
          ok = null; // essay/code – manual grading
      }
      if (ok === true) score += pts;
      updates.push({ id: a.id, is_correct: ok, points_awarded: ok === true ? pts : 0 });
    }

    // batch update answers
    for (const u of updates) {
      await supabaseAdmin.from("answers").update({ is_correct: u.is_correct, points_awarded: u.points_awarded }).eq("id", u.id);
    }

    const percent = maxScore > 0 ? Math.round((score / maxScore) * 1000) / 10 : 0;
    const passed = percent >= Number(exam?.passing_score ?? 50);

    await supabaseAdmin.from("attempts").update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      score,
      max_score: maxScore,
      percent,
      passed,
    }).eq("id", data.attempt_id);

    return { score, max_score: maxScore, percent, passed };
  });
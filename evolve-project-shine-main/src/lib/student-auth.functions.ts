import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PinSchema = z.object({
  first_name: z.string().trim().min(2).max(50),
  last_name: z.string().trim().min(2).max(50),
  pin: z.string().trim().regex(/^[0-9]{6}$/),
});

export const studentPinLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => PinSchema.parse(input))
  .handler(async ({ data }) => {
    const { first_name, last_name, pin } = data;

    const { data: pinRow, error: pinErr } = await supabaseAdmin
      .from("exam_pins")
      .select("id, exam_id, active, max_uses, used_count, expires_at")
      .eq("pin_code", pin)
      .eq("active", true)
      .maybeSingle();

    if (pinErr) throw new Error(pinErr.message);
    if (!pinRow) throw new Error("Nieprawidłowy lub nieaktywny PIN");
    if (pinRow.expires_at && new Date(pinRow.expires_at) < new Date()) {
      throw new Error("PIN wygasł");
    }
    if (pinRow.max_uses != null && pinRow.used_count >= pinRow.max_uses) {
      throw new Error("PIN został już w pełni wykorzystany");
    }

    const { data: exam, error: examErr } = await supabaseAdmin
      .from("exams")
      .select("id, status, title, duration_minutes")
      .eq("id", pinRow.exam_id)
      .maybeSingle();

    if (examErr) throw new Error(examErr.message);
    if (!exam || exam.status !== "published") {
      throw new Error("Egzamin nie jest jeszcze opublikowany");
    }

    const student_name = `${first_name} ${last_name}`;

    const { data: attempt, error: attErr } = await supabaseAdmin
      .from("attempts")
      .insert({
        exam_id: pinRow.exam_id,
        pin_id: pinRow.id,
        student_name,
        status: "in_progress",
      })
      .select("id, exam_id")
      .single();

    if (attErr) throw new Error(attErr.message);

    await supabaseAdmin
      .from("exam_pins")
      .update({ used_count: pinRow.used_count + 1 })
      .eq("id", pinRow.id);

    return {
      attempt_id: attempt.id,
      exam_id: attempt.exam_id,
      student_name,
      exam_title: exam.title,
      duration_minutes: exam.duration_minutes,
    };
  });

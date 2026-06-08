import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendEmail, otpEmailHtml } from "@/lib/email";

// In-memory OTP store (per-instance; ok for demo, use Redis/DB in production)
const otpStore = new Map<string, { code: string; expires: number; email: string }>();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/** Generuje i wysyła 6-cyfrowy kod OTP na e-mail administratora. */
export const sendAdminOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: user } = await context.supabase.auth.getUser();
    const email = user.user?.email;
    if (!email) throw new Error("Nie znaleziono adresu e-mail");

    const code = generateCode();
    const key = sanitizeEmail(email);
    otpStore.set(key, { code, expires: Date.now() + 10 * 60 * 1000, email });

    const { error } = await sendEmail({
      to: email,
      subject: "Twój kod dostępu — EduNex",
      html: otpEmailHtml(code),
    });

    if (error) {
      // Fallback: log code for development
      console.log(`[OTP] Code for ${email}: ${code}`);
    }

    return { ok: true };
  });

/** Weryfikuje 6-cyfrowy kod OTP. */
export const verifyAdminOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ code: z.string().regex(/^\d{6}$/) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: user } = await context.supabase.auth.getUser();
    const email = user.user?.email;
    if (!email) throw new Error("Nie znaleziono adresu e-mail");

    const key = sanitizeEmail(email);
    const stored = otpStore.get(key);
    if (!stored) throw new Error("Nie wygenerowano kodu. Zażądaj nowego.");
    if (Date.now() > stored.expires) {
      otpStore.delete(key);
      throw new Error("Kod wygasł. Zażądaj nowego.");
    }
    if (stored.code !== data.code) throw new Error("Nieprawidłowy kod");

    otpStore.delete(key);
    return { ok: true };
  });

/** Legacy: statyczny kod dostępu z env (wsparcie wsteczne). */
export const verifyAdminAccessCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ code: z.string().regex(/^\d{6}$/) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_ACCESS_CODE ?? "482913";
    const a = data.code;
    if (a.length !== expected.length) throw new Error("Nieprawidłowy kod dostępu");
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) throw new Error("Nieprawidłowy kod dostępu");
    return { ok: true };
  });

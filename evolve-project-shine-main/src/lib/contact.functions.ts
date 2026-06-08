import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  topic: z.string().min(1).max(120),
  message: z.string().min(5).max(4000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    // Best-effort: try storing in a 'contact_messages' table; ignore if table doesn't exist.
    try {
      const client = supabaseAdmin as unknown as {
        from: (t: string) => { insert: (row: Record<string, unknown>) => Promise<{ error: unknown }> };
      };
      await client.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        topic: data.topic,
        message: data.message,
      });
    } catch (e) {
      console.warn("contact_messages insert skipped:", (e as Error).message);
    }
    return { ok: true };
  });

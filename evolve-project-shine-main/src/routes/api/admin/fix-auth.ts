import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/admin/fix-auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = request.headers.get("x-fix-secret");
        if (secret !== "evolvenex2024") {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const url = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY;
        if (!url || !serviceKey) {
          return new Response(JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const admin = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const results: Record<string, unknown> = {};

        try {
          const { data, error } = await admin.auth.admin.listUsers();
          if (error) {
            results.users = { error: error.message };
          } else {
            const users = data.users.map((u) => ({
              id: u.id,
              email: u.email,
              confirmed: !!u.email_confirmed_at,
              display_name: u.user_metadata?.display_name ?? u.user_metadata?.full_name ?? null,
              created_at: u.created_at,
            }));
            results.users = users;

            const unconfirmed = users.filter((u) => !u.confirmed);
            const confirmResults: Record<string, unknown>[] = [];
            for (const u of unconfirmed) {
              try {
                const { error: confErr } = await admin.auth.admin.updateUserById(u.id, { email_confirm: true });
                confirmResults.push({ email: u.email, ok: !confErr, error: confErr?.message });
              } catch (e) {
                confirmResults.push({ email: u.email, ok: false, error: String(e) });
              }
            }
            results.confirmed = confirmResults;
          }
        } catch (e) {
          results.error = String(e);
        }

        return new Response(JSON.stringify(results, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

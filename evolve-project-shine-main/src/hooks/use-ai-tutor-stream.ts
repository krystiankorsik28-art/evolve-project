import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/* =========================================================================
   useAiTutorStream — hook do strumieniowania odpowiedzi AI Tutora
   po stronie klienta (token po tokenie, SSE).

   Użycie:
     const { send, streaming, partial, error, abort } = useAiTutorStream();
     await send({ thread_id, message, subject, onDelta: (t) => ... });
   ========================================================================= */

type SendArgs = {
  thread_id: string;
  message: string;
  subject?: string | null;
  onDelta?: (chunk: string) => void;
  onDone?: (full: string) => void;
};

export function useAiTutorStream() {
  const [streaming, setStreaming] = useState(false);
  const [partial, setPartial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, []);

  const send = useCallback(async (args: SendArgs) => {
    setError(null);
    setPartial("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let full = "";
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Niezalogowany");

      const res = await fetch("/api/ai-tutor-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread_id: args.thread_id,
          message: args.message,
          subject: args.subject ?? null,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch { /* noop */ }
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const r = await reader.read();
        if (r.done) break;
        buffer += decoder.decode(r.value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const piece = parsed.choices?.[0]?.delta?.content;
            if (piece) {
              full += piece;
              setPartial(full);
              args.onDelta?.(piece);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      args.onDone?.(full);
      return full;
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return full;
      const msg = e instanceof Error ? e.message : "Nieznany błąd";
      setError(msg);
      throw e;
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, []);

  return { send, abort, streaming, partial, error };
}

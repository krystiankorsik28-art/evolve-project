import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Weryfikacja logowania...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get("access_token");
          if (!accessToken) throw new Error("No session found");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const role = user.user_metadata?.role || "student";
        setStatus("success");
        setMessage("Zalogowano pomyślnie!");

        setTimeout(() => {
          switch (role) {
            case "teacher": navigate({ to: "/teacher" }); break;
            case "admin": navigate({ to: "/admin" }); break;
            case "parent": navigate({ to: "/student/dashboard" }); break;
            default: navigate({ to: "/student/dashboard" }); break;
          }
        }, 1500);
      } catch (e: any) {
        setStatus("error");
        setMessage(e.message || "Authentication failed");
        setTimeout(() => navigate({ to: "/auth/student" }), 3000);
      }
    };
    handleCallback();
  }, [navigate]);

  return (
    <div className="auth-bg">
      <div className="auth-form items-center justify-center text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto" />
            <p className="text-white/60 text-sm">{message}</p>
          </div>
        )}
        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <p className="text-white text-lg font-semibold">Zalogowano!</p>
            <p className="text-white/40 text-sm">Za chwilę zostaniesz przekierowany...</p>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-14 h-14 text-red-400 mx-auto" />
            <p className="text-white/60 text-sm">{message}</p>
            <p className="text-white/30 text-xs">Powrót do logowania...</p>
          </div>
        )}
      </div>
    </div>
  );
}

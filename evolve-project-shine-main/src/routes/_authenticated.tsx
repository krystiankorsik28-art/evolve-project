import { useEffect, useState } from "react";
import { Outlet, createRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const redirectToLogin = async () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin")) {
        await navigate({ to: "/auth/admin", replace: true });
        return;
      }
      if (pathname.startsWith("/student")) {
        await navigate({ to: "/auth/student", replace: true });
        return;
      }
      await navigate({ to: "/auth/teacher", replace: true });
    };

    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;

      if (error || !data.user) {
        setReady(false);
        await redirectToLogin();
        return;
      }

      setReady(true);
    };

    void checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session?.user) {
        setReady(true);
        return;
      }
      setReady(false);
      await redirectToLogin();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Sprawdzanie sesji…</div>
      </div>
    );
  }

  return <Outlet />;
}

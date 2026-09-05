"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Sends the visitor home once their session ends.
 *
 * Without this, signing out leaves the account shell on screen with nothing to
 * fill it: skeletons that never resolve and panels asking you to sign in, on
 * top of the menu of an account that is no longer there. Pages keep their own
 * signed-out state for people who arrive here directly, so this only reacts to
 * a session that existed and then disappeared.
 */
export default function RequireSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hadSession = useRef(false);

  useEffect(() => {
    if (user) {
      hadSession.current = true;
      return;
    }
    if (!loading && hadSession.current) {
      router.replace("/");
    }
  }, [user, loading, router]);

  return <>{children}</>;
}

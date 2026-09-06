"use client";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

/**
 * Stops an action that needs an account and offers the way in.
 *
 * The database already refuses these writes without a valid token — this is
 * about the interface not pretending the click worked, and not dumping
 * "Auth session missing!" in the console when someone taps a heart.
 */
export default function useAuthGate() {
  const { user } = useAuth();

  const openLogin = useCallback(() => {
    const trigger = document.querySelector<HTMLElement>(
      'a[href="#log"], [data-bs-target="#log"]',
    );
    trigger?.click();
  }, []);

  /** Returns true when the caller may proceed. */
  const requireAuth = useCallback(
    (message = "Inicia sesión para continuar") => {
      if (user) return true;
      toast.info(message);
      openLogin();
      return false;
    },
    [user, openLogin],
  );

  return { requireAuth, isLoggedIn: Boolean(user) };
}

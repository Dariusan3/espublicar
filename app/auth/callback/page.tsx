"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, db, DB_ID, COLLECTIONS } from "@/lib/supabase";
import { toast } from "react-toastify";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      try {
        // Supabase (detectSessionInUrl) exchanges the OAuth `code` for a
        // session automatically once the client boots. Wait for it to land.
        let user = null;
        for (let attempt = 0; attempt < 10; attempt++) {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            user = data.user;
            break;
          }
          await new Promise((r) => setTimeout(r, 300));
        }

        if (!user) throw new Error("No se pudo obtener la sesión");

        // Ensure a profile row exists in the `user` table. A DB trigger also
        // creates it, so treat "already exists" as success.
        try {
          await db.getDocument(DB_ID, COLLECTIONS.USERS, user.id);
        } catch {
          try {
            await db.createDocument(DB_ID, COLLECTIONS.USERS, user.id, {
              name:
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Usuario",
              email: user.email,
            });
          } catch (e) {
            console.warn("Could not create user profile row:", e);
          }
        }

        toast.success("¡Sesión iniciada!");
        router.replace("/my-account");
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
        router.replace("/");
      }
    };
    finalize();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-2)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: 48, height: 48 }}
        />
        <p
          style={{
            marginTop: "var(--space-4)",
            font: "500 15px/1.4 'Inter', sans-serif",
            color: "var(--ink-3)",
          }}
        >
          Completando inicio de sesión…
        </p>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, db, DB_ID, COLLECTIONS, ID } from "@/lib/appwrite";
import { toast } from "react-toastify";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      try {
        const session = await account.get();

        // Ensure a user doc exists in the `user` collection
        try {
          await db.getDocument(DB_ID, COLLECTIONS.USERS, session.$id);
          // Already exists — nothing to do
        } catch {
          // Create it (first time they log in via OAuth)
          try {
            await db.createDocument(
              DB_ID,
              COLLECTIONS.USERS,
              session.$id,
              {
                name: session.name || session.email?.split("@")[0] || "Usuario",
                email: session.email,
              },
            );
          } catch (e) {
            // If permissions don't allow — just log and continue
            console.warn("Could not create user doc:", e);
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

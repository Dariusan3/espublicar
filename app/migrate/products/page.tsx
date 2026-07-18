"use client";
import React, { useState } from "react";
import { db, DB_ID, COLLECTIONS } from "@/lib/supabase";
import { toast } from "react-toastify";

export default function MigrateProducts() {
  const [status, setStatus] = useState("Idle");
  const TARGET_USER_ID = "696e4d03000424a33ee3";

  const runMigration = async () => {
    setStatus("Starting migration...");
    try {
      // 1. Fetch all products (limit 500 for now)
      const response = await db.listDocuments(DB_ID, COLLECTIONS.PRODUCTS, []);

      const total = response.total;
      setStatus(`Found ${total} products. Updating...`);

      let updatedCount = 0;
      let errors = 0;

      // 2. Loop and update each
      for (const doc of response.documents) {
        try {
          await db.updateDocument(DB_ID, COLLECTIONS.PRODUCTS, doc.id, {
            userId: TARGET_USER_ID,
          });
          updatedCount++;
          setStatus(`Updated ${updatedCount}/${total} products...`);
        } catch (err) {
          console.error(`Failed to update product ${doc.id}`, err);
          errors++;
        }
      }

      setStatus(`Done! Updated: ${updatedCount}, Errors: ${errors}`);
      toast.success("Migration complete!");
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
      toast.error("Migration failed");
    }
  };

  return (
    <div className="container py-5">
      <h1>Data Migration: Assign Products to User</h1>
      <p>
        Target User ID: <strong>{TARGET_USER_ID}</strong>
      </p>

      <div className="card p-4 my-4 bg-light">
        <h5>Status: {status}</h5>
      </div>

      <button onClick={runMigration} className="btn btn-primary btn-lg">
        Start Migration
      </button>
    </div>
  );
}

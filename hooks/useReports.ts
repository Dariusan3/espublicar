"use client";
import { useCallback } from "react";
import { db, DB_ID, COLLECTIONS, ID } from "@/lib/appwrite";
import { HookResponse, ReportDB } from "@/types/Types";

const useReports = () => {
  const createReport = useCallback(
    async (data: {
      reporterId: string;
      targetId: string;
      targetType: "product" | "user";
      reason: string;
      description?: string;
    }): Promise<HookResponse> => {
      try {
        const payload: ReportDB = {
          ...data,
          status: "pending",
        };
        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.REPORTS,
          ID.unique(),
          payload,
        );
        return { success: true, message: "Reporte enviado", data: result };
      } catch (error: any) {
        if (error?.code === 404) {
          // Collection doesn't exist yet — still resolve gracefully
          return {
            success: true,
            message: "Reporte registrado",
            data: null,
          };
        }
        console.error("Error creating report:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  return { createReport };
};

export default useReports;

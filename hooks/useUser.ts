"use client";
import { useCallback } from "react";
import { account, db, DB_ID, USERS_COLLECTION_ID, id } from "../lib/appwrite";
import { UserDB, HookResponse } from "../types/Types";
import { useAppDispatch } from "store/store";
import {
  setUser,
  updateUser as updateUserSlice,
} from "../store/slices/userSlice";
import { toUser } from "helpers/dbHelpers";

const useUser = () => {
  const dispatch = useAppDispatch();

  const createUserInDB = useCallback(
    async (userData: UserDB, authUserId: string): Promise<HookResponse> => {
      try {
        const response = await db.createDocument(
          DB_ID,
          USERS_COLLECTION_ID,
          id.custom(authUserId),
          userData,
        );
        return { success: true, message: "User created successfully", data: response };
      } catch (error: any) {
        console.log("Error creating the User: ", error);
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const getMyUserData = useCallback(async (): Promise<HookResponse> => {
    try {
      const currentUser = await account.get();
      const response = await db.getDocument(
        DB_ID,
        USERS_COLLECTION_ID,
        currentUser.$id,
      );
      const user = toUser(response);
      dispatch(setUser(user));
      return { success: true, message: "Success", data: user };
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return { success: false, message: error.message, data: null };
    }
  }, []);

  const getUserById = useCallback(
    async (userId: string): Promise<HookResponse> => {
      try {
        const response = await db.getDocument(
          DB_ID,
          USERS_COLLECTION_ID,
          userId,
        );
        return { success: true, message: "Success!", data: toUser(response) };
      } catch (error: any) {
        console.log("Error getting user by id: ", error);
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const updateUser = useCallback(
    async (userId: string, updates: Partial<UserDB>): Promise<HookResponse> => {
      try {
        const response = await db.updateDocument(
          DB_ID,
          USERS_COLLECTION_ID,
          userId,
          updates,
        );
        const user = toUser(response);
        dispatch(setUser(user));
        return { success: true, message: "User updated successfully", data: response };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Failed to update user",
        };
      }
    },
    [],
  );

  return { createUserInDB, getMyUserData, updateUser, getUserById };
};

export default useUser;

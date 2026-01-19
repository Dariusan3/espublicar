"use client";
import { useCallback } from "react";
import { account, ID } from "@/lib/appwrite";
import { HookResponse } from "@/types/Types";
import { useAppDispatch } from "@/store/store";
import { setAuthState } from "@/store/slices/authSlice";

/**
 * Custom hook for authentication operations with Appwrite
 */
const useAuth = () => {
  const dispatch = useAppDispatch();

  /**
   * Sign up a new user
   */
  const signUserUp = useCallback(
    async (email: string, password: string): Promise<HookResponse> => {
      try {
        const response = await account.create({
          userId: ID.unique(),
          email: email,
          password: password,
        });

        return {
          success: true,
          message: "Account created successfully!",
          data: response.$id,
        };
      } catch (error: any) {
        console.error("Error signing up:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Send a verification email to the current user
   */
  const sendVerificationEmail = useCallback(async (): Promise<HookResponse> => {
    try {
      const origin = window.location.origin;
      const verificationUrl = `${origin}/verify-email`;
      await account.createVerification({ url: verificationUrl });

      return {
        success: true,
        message: "Verification email sent!",
        data: null,
      };
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Sign in an existing user
   */
  const signUserIn = useCallback(
    async (email: string, password: string): Promise<HookResponse> => {
      try {
        const response = await account.createEmailPasswordSession({
          email: email,
          password: password,
        });

        dispatch(setAuthState({ isAutheticated: true }));

        return {
          success: true,
          message: "Logged in successfully!",
          data: response.$id,
        };
      } catch (error: any) {
        console.error("Error signing in:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async (): Promise<HookResponse> => {
    try {
      await account.deleteSession({ sessionId: "current" });

      // dispatch(clearUser());
      dispatch(setAuthState({ isAutheticated: false }));

      return {
        success: true,
        message: "Logged out successfully!",
        data: null,
      };
    } catch (error: any) {
      console.error("Error signing out:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Check if a user is currently logged in
   */
  const checkUserPresence = useCallback(async (): Promise<HookResponse> => {
    try {
      const response = await account.get();

      dispatch(setAuthState({ isAutheticated: true }));

      return {
        success: true,
        message: "User is authenticated!",
        data: response,
      };
    } catch (error: any) {
      console.error("Error checking user presence:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Get current user data
   */
  const getCurrentUser = useCallback(async (): Promise<HookResponse> => {
    try {
      const response = await account.get();

      return {
        success: true,
        message: "Success!",
        data: response,
      };
    } catch (error: any) {
      console.error("Error getting current user:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Send a password reset email
   */
  const forgotPassword = useCallback(
    async (email: string): Promise<HookResponse> => {
      try {
        const origin = window.location.origin;
        const resetUrl = `${origin}/reset-password`;

        await account.createRecovery({ email: email, url: resetUrl });
        return {
          success: true,
          message: "Password reset email sent!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error resetting password:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Complete password reset with new password
   */
  const resetPassword = useCallback(
    async (
      userId: string,
      secret: string,
      newPassword: string,
    ): Promise<HookResponse> => {
      try {
        await account.updateRecovery({
          userId: userId,
          secret: secret,
          password: newPassword,
        });

        return {
          success: true,
          message: "Password updated successfully!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error updating password:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Verify email with userId and secret from URL
   */
  const verifyEmail = useCallback(
    async (userId: string, secret: string): Promise<HookResponse> => {
      try {
        await account.updateVerification({ userId: userId, secret: secret });

        return {
          success: true,
          message: "Email verified successfully!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error verifying email:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  const resendVerificationEmail =
    useCallback(async (): Promise<HookResponse> => {
      try {
        const origin = window.location.origin;
        const verificationUrl = `${origin}/verify-email`;
        await account.createVerification({ url: verificationUrl });
        return {
          success: true,
          message: "Success!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error sending verification email:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    }, []);

  /**
   * Update user's name
   */
  const updateName = useCallback(
    async (name: string): Promise<HookResponse> => {
      try {
        await account.updateName({ name: name });

        return {
          success: true,
          message: "Name updated successfully!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error updating name:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Update user's email (requires password for verification)
   */
  const updateEmail = useCallback(
    async (email: string, password: string): Promise<HookResponse> => {
      try {
        await account.updateEmail({ email: email, password: password });

        return {
          success: true,
          message: "Email updated successfully!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error updating email:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Update user's password
   */
  const updatePassword = useCallback(
    async (newPassword: string, oldPassword: string): Promise<HookResponse> => {
      try {
        await account.updatePassword({
          password: newPassword,
          oldPassword: oldPassword,
        });

        return {
          success: true,
          message: "Password updated successfully!",
          data: null,
        };
      } catch (error: any) {
        console.error("Error updating password:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  return {
    signUserUp,
    signUserIn,
    signOut,
    forgotPassword,
    resetPassword,
    checkUserPresence,
    getCurrentUser,
    verifyEmail,
    sendVerificationEmail,
    updateName,
    updateEmail,
    updatePassword,
    resendVerificationEmail,
  };
};

export default useAuth;

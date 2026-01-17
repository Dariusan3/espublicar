"use client";
import { useCallback } from 'react';
import { account, ID } from '@/lib/appwrite';

/**
 * Custom hook for authentication operations with Appwrite
 */
const useAuth = () => {

  /**
   * Sign up a new user
   */
  const signUserUp = useCallback(async (email, password, name = '') => {
    try {
      const response = await account.create(
        ID.unique(), 
        email, 
        password,
        name
      );

      return {
        success: true,
        message: 'Account created successfully!',
        data: response.$id,
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Send a verification email to the current user
   */
  const sendVerificationEmail = useCallback(async () => {
    try {
      const origin = window.location.origin;
      const verificationUrl = `${origin}/verify-email`;
      await account.createVerification(verificationUrl);

      return {
        success: true,
        message: 'Verification email sent!',
        data: null,
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
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
  const signUserIn = useCallback(async (email, password) => {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );

      return {
        success: true,
        message: 'Logged in successfully!',
        data: response.$id,
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      await account.deleteSession('current');

      return {
        success: true,
        message: 'Logged out successfully!',
        data: null,
      };
    } catch (error) {
      console.error('Error signing out:', error);
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
  const checkUserPresence = useCallback(async () => {
    try {
      const response = await account.get();

      return {
        success: true,
        message: 'User is authenticated!',
        data: response,
      };
    } catch (error) {
      console.error('Error checking user presence:', error);
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
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await account.get();

      return {
        success: true,
        message: 'Success!',
        data: response,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
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
  const forgotPassword = useCallback(async (email) => {
    try {
      const origin = window.location.origin;
      const resetUrl = `${origin}/reset-password`;

      await account.createRecovery(email, resetUrl);
      return {
        success: true,
        message: 'Password reset email sent!',
        data: null,
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Complete password reset with new password
   */
  const resetPassword = useCallback(async (userId, secret, newPassword) => {
    try {
      await account.updateRecovery(userId, secret, newPassword);
      
      return {
        success: true,
        message: 'Password updated successfully!',
        data: null,
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Verify email with userId and secret from URL
   */
  const verifyEmail = useCallback(async (userId, secret) => {
    try {
      await account.updateVerification(userId, secret);

      return {
        success: true,
        message: 'Email verified successfully!',
        data: null,
      };
    } catch (error) {
      console.error('Error verifying email:', error);
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
  const updateName = useCallback(async (name) => {
    try {
      await account.updateName(name);
      
      return {
        success: true,
        message: 'Name updated successfully!',
        data: null,
      };
    } catch (error) {
      console.error('Error updating name:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Update user's email (requires password for verification)
   */
  const updateEmail = useCallback(async (email, password) => {
    try {
      await account.updateEmail(email, password);
      
      return {
        success: true,
        message: 'Email updated successfully!',
        data: null,
      };
    } catch (error) {
      console.error('Error updating email:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

  /**
   * Update user's password
   */
  const updatePassword = useCallback(async (newPassword, oldPassword) => {
    try {
      await account.updatePassword(newPassword, oldPassword);
      
      return {
        success: true,
        message: 'Password updated successfully!',
        data: null,
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, []);

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
  };
};

export default useAuth;

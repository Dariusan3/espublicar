"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { account, supabase } from '@/lib/supabase';

/**
 * Normalized user shape exposed to the app. Mirrors the fields the UI reads
 * from the old Appwrite user object ($id, name, emailVerification, ...).
 */
export interface AuthUser {
  $id: string;
  id: string;
  email: string;
  name: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: Record<string, any>;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  updatePhone: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  sendPhoneVerification: () => Promise<{ success: boolean; error?: string }>;
  confirmPhoneVerification: (secret: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (name: string) => Promise<{ success: boolean; error?: string }>;
  updateEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string, oldPassword: string) => Promise<{ success: boolean; error?: string }>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const session = (await account.get()) as AuthUser;
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check the session on mount and keep it in sync with Supabase auth events.
  useEffect(() => {
    checkUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = (await account.get()) as AuthUser;
      setUser(session);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await account.create(email, password, name);
      // Auto-login after registration (requires email confirmation to be off).
      await account.createEmailPasswordSession(email, password);
      const session = (await account.get()) as AuthUser;
      setUser(session);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = () => {
    const origin = window.location.origin;
    account.createOAuth2Session('google', `${origin}/auth/callback`);
  };

  const loginWithFacebook = () => {
    const origin = window.location.origin;
    account.createOAuth2Session('facebook', `${origin}/auth/callback`);
  };

  const updatePhone = async (phone: string, password: string) => {
    try {
      await account.updatePhone(phone);
      const updated = (await account.get()) as AuthUser;
      setUser(updated);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const sendPhoneVerification = async () => {
    try {
      await account.createPhoneVerification();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const confirmPhoneVerification = async (secret: string) => {
    try {
      if (!user) throw new Error("No user");
      await account.updatePhoneVerification(user.$id, secret);
      const updated = (await account.get()) as AuthUser;
      setUser(updated);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (name: string) => {
    try {
      await account.updateName(name);
      const updatedUser = (await account.get()) as AuthUser;
      setUser(updatedUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateEmail = async (email: string, password: string) => {
    try {
      await account.updateEmail(email);
      const updatedUser = (await account.get()) as AuthUser;
      setUser(updatedUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword: string, oldPassword: string) => {
    try {
      await account.updatePassword(newPassword);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    updatePhone,
    sendPhoneVerification,
    confirmPhoneVerification,
    logout,
    updateProfile,
    updateEmail,
    updatePassword,
    checkUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

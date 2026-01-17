"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { account, ID } from '@/lib/appwrite';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      // Auto-login after registration
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (name) => {
    try {
      await account.updateName(name);
      const updatedUser = await account.get();
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateEmail = async (email, password) => {
    try {
      await account.updateEmail(email, password);
      const updatedUser = await account.get();
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword, oldPassword) => {
    try {
      await account.updatePassword(newPassword, oldPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
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

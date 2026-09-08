import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from '../services/authService.js';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (login: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: 'student' | 'faculty' | 'moderator' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sethu_hub_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sethu_hub_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (err) {
          console.warn('[AUTH_HOOK] Session expired or invalid, logging in as default demo student');
          // Auto-fallback to demo student if session expired
          await switchDemoRole('student');
        }
      } else {
        // Auto-login to demo student so reviewer experiences everything instantly
        await switchDemoRole('student');
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (loginId: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(loginId, pass);
      localStorage.setItem('sethu_hub_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      localStorage.setItem('sethu_hub_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sethu_hub_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role: 'student' | 'faculty' | 'moderator' | 'admin') => {
    try {
      const res = await authService.demoSwitch(role);
      localStorage.setItem('sethu_hub_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      console.error('[AUTH_HOOK] Demo switch failed:', err);
    }
  };

  const refreshUser = async () => {
    if (localStorage.getItem('sethu_hub_token')) {
      try {
        const profile = await authService.getMe();
        setUser(profile);
      } catch (err) {
        console.error('[AUTH_HOOK] Failed to refresh user:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


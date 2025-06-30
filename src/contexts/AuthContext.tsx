"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/lib/api';
import { User, LoginForm, RegisterForm } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginForm) => Promise<void>;
  signup: (data: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
      if (!user && !isAuthPage) {
        router.push('/login');
      } else if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  /**
   * Verificar estado de autenticación al cargar la app
   */
  const checkAuthState = async () => {
    try {
      setLoading(true);
      
      // Verificar si hay datos de usuario en localStorage
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || !AuthService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      // Verificar token con el backend
      const verifiedUser = await AuthService.verifyToken();
      setUser(verifiedUser);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // Limpiar datos si el token no es válido
      AuthService.clearAuthData();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar sesión
   */
  const login = async (data: LoginForm): Promise<void> => {
    try {
      setLoading(true);
      const authResponse = await AuthService.login(data);
      setUser(authResponse.user);
      // Dar un pequeño delay para asegurar que el token se guarde
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registrar nuevo usuario
   */
  const signup = async (data: RegisterForm): Promise<void> => {
    try {
      setLoading(true);
      const authResponse = await AuthService.register(data);
      setUser(authResponse.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      // Incluso si hay error, limpiar estado local
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar datos del usuario
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const updatedUser = await AuthService.getProfile();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error refrescando usuario:', error);
      // Si hay error, cerrar sesión
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

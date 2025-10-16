import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';

type UserType = 'customer' | 'admin' | 'admin-2' | 'admin-3' | null;

interface AuthState {
  userType: UserType;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: { username: string; role: UserType }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    userType: null,
    userId: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Use ref to prevent multiple requests
  const authCheckStarted = useRef(false);

  useEffect(() => {
    // Only run auth check once
    if (authCheckStarted.current) return;
    authCheckStarted.current = true;

    console.log('🔄 Starting initial auth check...');

    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/verify', {
          timeout: 5000
        });

        console.log('✅ User is authenticated:', response.data);

        if (response.data.authenticated) {
          const { user } = response.data;

          setAuthState({
            userType: user.role,
            userId: user.username,
            role: user.role,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('userType', user.role || '');
          localStorage.setItem('userId', user.username);
          localStorage.setItem('role', user.role || '');
        }
      } catch (error: any) {
        // 401 is NORMAL - it means no user is logged in
        if (error.response?.status === 401) {
          console.log('👤 No user logged in (this is normal)');
          setAuthState({
            userType: null,
            userId: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } else if (error.code === 'ECONNABORTED') {
          console.log('⏱️ Request timeout (normal for cancelled requests)');
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }));
        } else {
          console.error('❌ Auth check error:', error);
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }));
        }

        // Clear any stale data
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
      }
    };

    checkAuth();
  }, []);

  const login = (data: { username: string; role: UserType }) => {
    console.log('🔐 User logging in:', data);
    const newState = {
      userType: data.role,
      userId: data.username,
      role: data.role,
      isAuthenticated: true,
      isLoading: false,
    };
    setAuthState(newState);
    localStorage.setItem('userType', data.role || '');
    localStorage.setItem('userId', data.username);
    localStorage.setItem('role', data.role || '');
  };

  const logout = async () => {
    console.log('🚪 User logging out');
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        userType: null,
        userId: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
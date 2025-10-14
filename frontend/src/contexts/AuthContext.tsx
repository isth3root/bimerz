import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type UserType = 'customer' | 'admin' | 'admin-2' | 'admin-3' | null;

interface AuthState {
  userType: UserType;
  token: string | null;
  userId: string | null;
  role: string | null;
}

interface AuthContextType extends AuthState {
  login: (data: { access_token: string; username: string; role: UserType }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
    token: null,
    userId: null,
    role: null,
  });

  useEffect(() => {
    // Load from localStorage on mount
    const userType = localStorage.getItem('userType') as UserType;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role') as UserType;

    // Validate data
    const validUserTypes: UserType[] = ['customer', 'admin', 'admin-2', 'admin-3', null];
    const isValidUserType = validUserTypes.includes(userType);
    const isValidRole = validUserTypes.includes(role);
    const isValidToken = typeof token === 'string' && token.length > 0;

    if (isValidUserType && isValidToken && isValidRole) {
      setAuthState({ userType, token, userId, role });
    } else {
      // Clear invalid data
      localStorage.removeItem('userType');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    }
  }, []);

  const login = (data: { access_token: string; username: string; role: UserType }) => {
    const newState = {
      userType: data.role,
      token: data.access_token,
      userId: data.username,
      role: data.role,
    };
    setAuthState(newState);
    localStorage.setItem('userType', data.role || '');
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', data.username);
    localStorage.setItem('role', data.role || '');
  };

  const logout = () => {
    setAuthState({
      userType: null,
      token: null,
      userId: null,
      role: null,
    });
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
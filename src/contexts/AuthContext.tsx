import React, { createContext, useContext, useState, ReactNode } from 'react';
import { adminLogin as apiAdminLogin } from '@/services/mockApi';

export type UserRole = 'super_admin' | 'finance_admin' | 'operations_admin' | 'manager' | 'read_only';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for role switching
const demoUsers: Record<UserRole, User> = {
  super_admin: {
    id: 'admin-1',
    name: 'Admin Super',
    email: 'admin@company.com',
    role: 'super_admin',
    permissions: ['all'],
  },
  finance_admin: {
    id: '2',
    name: 'Michael Torres',
    email: 'michael.torres@company.com',
    role: 'finance_admin',
  },
  operations_admin: {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.williams@company.com',
    role: 'operations_admin',
  },
  manager: {
    id: 'admin-2',
    name: 'Manager User',
    email: 'manager@company.com',
    role: 'manager',
  },
  read_only: {
    id: 'admin-3',
    name: 'Analyst User',
    email: 'analyst@company.com',
    role: 'read_only',
  },
};

export const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  finance_admin: 'Finance Admin',
  operations_admin: 'Operations Admin',
  manager: 'Manager',
  read_only: 'Read Only',
};

export const roleStyles: Record<UserRole, string> = {
  super_admin: 'role-super-admin',
  finance_admin: 'role-finance',
  operations_admin: 'role-operations',
  manager: 'role-manager',
  read_only: 'role-readonly',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('admin_token');
  });

  const login = async (email: string, password: string) => {
    const result = await apiAdminLogin(email, password);

    if (!result.success) {
      throw new Error(result.message);
    }

    const loggedInUser: User = {
      id: result.data.user.id,
      name: result.data.user.name,
      email: result.data.user.email,
      role: result.data.user.role as UserRole,
      permissions: result.data.user.permissions,
    };

    setUser(loggedInUser);
    setToken(result.data.token);
    localStorage.setItem('admin_user', JSON.stringify(loggedInUser));
    localStorage.setItem('admin_token', result.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  const setUserRole = (role: UserRole) => {
    const newUser = demoUsers[role];
    setUser(newUser);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setUserRole,
      token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

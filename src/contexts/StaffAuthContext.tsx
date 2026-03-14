import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '@/services/api';

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  classification: string;
  location: string;
  joinedDate: string;
  referralCode: string;
  pointsBalance: number;
  hourlyRate: number;
}

interface StaffAuthContextType {
  user: StaffUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);

  const login = async (email: string, password: string) => {
    const result = await authApi.staffLogin(email, password);
    const u = result.user;
    setUser({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      avatar: u.avatar,
      classification: u.classification,
      location: u.location,
      joinedDate: u.joinDate,
      referralCode: u.referralCode,
      pointsBalance: u.pointsBalance,
      hourlyRate: u.hourlyRate,
    });
    localStorage.setItem('staff_token', result.token);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <StaffAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (context === undefined) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}

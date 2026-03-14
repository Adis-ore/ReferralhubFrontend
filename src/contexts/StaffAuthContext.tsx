import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  classification: string;
  location: string;
  joinedDate: string;
  referralCode: string;
}

interface StaffAuthContextType {
  user: StaffUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

const demoStaffUser: StaffUser = {
  id: 'staff-1',
  name: 'Jessica Martinez',
  email: 'jessica.m@company.com',
  classification: 'Registered Nurse',
  location: 'Sydney',
  joinedDate: '2024-01-15',
  referralCode: 'JESS2024',
};

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(demoStaffUser);
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

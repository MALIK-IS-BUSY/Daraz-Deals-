import React, { createContext, useState, useEffect, useContext } from 'react';

// Mock user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'customer';
}

// Auth context type
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock login function
  const login = async (username: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    if ((username === 'malik' || username === 'malik@admin.com') && password === '888') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Malik Abdullah',
        email: username,
        role: 'admin',
      };
      
      // Store user info in localStorage
      localStorage.setItem('daraz_auth_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      return adminUser;
    } else if (username === 'user' && password === '888') {
      const regularUser: User = {
        id: 'user-1',
        name: 'Regular User',
        email: username,
        role: 'customer',
      };
      
      // Store user info in localStorage
      localStorage.setItem('daraz_auth_user', JSON.stringify(regularUser));
      setCurrentUser(regularUser);
      return regularUser;
    }
    
    throw new Error('Invalid credentials');
  };

  // Mock logout function
  const logout = async (): Promise<void> => {
    localStorage.removeItem('daraz_auth_user');
    setCurrentUser(null);
  };

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('daraz_auth_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
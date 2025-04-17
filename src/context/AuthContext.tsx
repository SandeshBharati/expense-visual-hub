
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => boolean;
  register: (userData: { name: string; email: string; password: string }) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const login = (credentials: { email: string; password: string }): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === credentials.email);
    
    if (!user || user.password !== credentials.password) {
      return false;
    }
    
    // Update user authentication status
    user.isAuthenticated = true;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Save to session storage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update state
    setUser(user);
    return true;
  };

  const register = (userData: { name: string; email: string; password: string }): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find((u: User) => u.email === userData.email)) {
      return false;
    }
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isAuthenticated: true
    };
    
    // Add new user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Update state
    setUser(newUser);
    return true;
  };

  const logout = () => {
    // Remove from session storage
    sessionStorage.removeItem('currentUser');
    
    // Update state
    setUser(null);
  };

  const checkAuth = (): boolean => {
    const currentUser = sessionStorage.getItem('currentUser');
    return !!currentUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

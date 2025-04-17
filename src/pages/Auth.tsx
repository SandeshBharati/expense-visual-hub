
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { toast } from "sonner";

const Auth = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === credentials.email);
    
    if (!user || user.password !== credentials.password) {
      toast.error('Invalid email or password');
      return;
    }
    
    // Mark user as authenticated
    user.isAuthenticated = true;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store current user in session storage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Navigate to dashboard
    toast.success('Login successful');
    navigate('/dashboard');
  };

  const handleRegister = (userData: { name: string; email: string; password: string }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find((user: any) => user.email === userData.email)) {
      toast.error('Email already registered');
      return;
    }
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isAuthenticated: true
    };
    
    // Add new user to list
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Navigate to dashboard
    toast.success('Registration successful');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {isLoginView ? (
          <LoginForm 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setIsLoginView(false)}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setIsLoginView(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;

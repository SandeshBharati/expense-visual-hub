
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (userData: { email: string; password: string }) => {
    // In a real app, you would make an API call to authenticate
    // For demo, we'll just store in localStorage and redirect
    localStorage.setItem("user", JSON.stringify({
      name: "Demo User",
      email: userData.email,
      isAuthenticated: true,
    }));
    
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  const handleRegister = (userData: { name: string; email: string; password: string }) => {
    // In a real app, you would make an API call to register
    // For demo, we'll just store in localStorage and redirect
    localStorage.setItem("user", JSON.stringify({
      name: userData.name,
      email: userData.email,
      isAuthenticated: true,
    }));
    
    toast.success("Registration successful!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Expense Visual Hub</h1>
          <p className="text-muted-foreground mt-2">Track, manage, and visualize your finances</p>
        </div>
        
        {showLoginForm ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowLoginForm(false)}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowLoginForm(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;

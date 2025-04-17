import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = sessionStorage.getItem('currentUser');
    
    // Wait a bit to show the loading animation
    setTimeout(() => {
      if (currentUser) {
        // If authenticated, go to dashboard
        navigate("/dashboard");
      } else {
        // Otherwise, go to auth page
        navigate("/auth");
      }
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Here you would typically make an API call to verify credentials
      toast({
        title: "Logging in...",
        description: "This is a demo. In a real app, this would verify your credentials.",
      });
    } else {
      // For demo purposes, let's hardcode the admin code
      const CORRECT_ADMIN_CODE = "secret123";
      
      if (adminCode !== CORRECT_ADMIN_CODE) {
        toast({
          variant: "destructive",
          title: "Invalid admin code",
          description: "Please enter the correct admin code to create an account.",
        });
        return;
      }
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 bg-card/50 backdrop-blur-sm animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-8">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-background/50 border-accent"
            placeholder="Username"
          />
        </div>

        <div className="relative">
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background/50 border-accent"
            placeholder="Password"
          />
        </div>

        {!isLogin && (
          <div className="relative animate-slideUp">
            <Input
              type="password"
              id="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full bg-background/50 border-accent"
              placeholder="Admin Code"
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          {isLogin ? "Login" : "Create Account"}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </Card>
  );
};

export default AuthForm;
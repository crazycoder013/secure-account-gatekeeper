import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login with username
        const { error } = await supabase.auth.signInWithPassword({
          email: `${username}@virtual.com`,
          password: password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        // Verify admin code first
        const { data: adminCodes, error: adminCodeError } = await supabase
          .from('admin_codes')
          .select('code')
          .eq('code', adminCode)
          .single();

        if (adminCodeError || !adminCodes) {
          toast({
            variant: "destructive",
            title: "Invalid admin code",
            description: "Please enter a valid admin code to create an account.",
          });
          return;
        }

        // Create account using the custom function
        const { data, error: fnError } = await supabase.rpc('handle_username_auth', {
          username: username,
          password: password
        });

        if (fnError) throw fnError;

        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            required
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
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>

        {!isLogin && (
          <div className="relative animate-slideUp">
            <Input
              type="text"
              id="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full bg-background/50 border-accent"
              placeholder="Admin Code"
              disabled={isLoading}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : (isLogin ? "Login" : "Create Account")}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
          disabled={isLoading}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </Card>
  );
};

export default AuthForm;
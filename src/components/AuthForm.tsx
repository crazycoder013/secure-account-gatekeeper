import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: `${username}@virtual.com`,
          password,
        });

        if (error) throw error;
        if (!user) throw new Error('Login failed');

        toast({
          title: "Logged in successfully!",
          description: "Redirecting to chat...",
        });

        window.location.href = "http://jeremy.resnak.com/chat/index.php";
      } else {
        // Sign up logic
        const { data, error } = await supabase.functions.invoke("create-user", {
          body: { username, password }
        });

        if (error) {
          const errorMessage = error.message || 'Failed to create user account';
          try {
            const parsedError = JSON.parse(error.message);
            if (parsedError.error) {
              throw new Error(parsedError.error);
            }
          } catch {
            throw new Error(errorMessage);
          }
        }

        if (!data?.user) throw new Error('Failed to create user account');

        toast({
          title: "Account created successfully!",
          description: "Please log in with your new account.",
        });

        setIsLogin(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Create Account"}</h2>
        <p className="text-gray-600">Enter your details below</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (isLogin ? "Logging in..." : "Creating Account...") : (isLogin ? "Login" : "Create Account")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
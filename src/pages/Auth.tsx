
import { useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

const Auth = () => {
  const { session, user, profile, loading, checkAuthStatus } = useAuthSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If logged in AND profile exists and username set, redirect to dashboard
  if (!loading && session && profile?.username) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const response = await apiService.login(username, password);
      apiService.storeTokens(response.access, response.refresh);
      
      toast({
        title: "Login successful!",
        description: "Welcome back to your account.",
      });
      
      // Refresh auth status and redirect to dashboard
      await checkAuthStatus();
      navigate("/dashboard");
      
    } catch (error: any) {
      let errorMessage = "Please check your credentials and try again.";
      
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(", ");
        }
      } catch {
        // Use default message if parsing fails
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      await apiService.signup(username, email, password, password);
      
      toast({
        title: "Account created!",
        description: "Please log in with your new credentials.",
      });
      
      // Switch to login mode after successful signup
      setMode("login");
      setUsername("");
      setPassword("");
      
    } catch (error: any) {
      let errorMessage = "Please try again with different credentials.";
      
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.username) {
          errorMessage = `Username: ${errorData.username.join(", ")}`;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email.join(", ")}`;
        } else if (errorData.password) {
          errorMessage = `Password: ${errorData.password.join(", ")}`;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(", ");
        }
      } catch {
        // Use default message if parsing fails
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Log in with your username and password."
              : "Create a new account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex justify-center mb-6 gap-2">
              <Button
                type="button"
                variant={mode === "login" ? "default" : "outline"}
                className={`w-1/2 ${mode === "login" ? "bg-skyBlue text-white hover:bg-skyBlue/90" : ""}`}
                onClick={() => setMode("login")}
                disabled={mode === "login"}
              >
                Log in
              </Button>
              <Button
                type="button"
                variant={mode === "signup" ? "default" : "outline"}
                className={`w-1/2 ${mode === "signup" ? "bg-skyBlue text-white hover:bg-skyBlue/90" : ""}`}
                onClick={() => setMode("signup")}
                disabled={mode === "signup"}
              >
                Sign up
              </Button>
            </div>
            <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
              {mode === "signup" && (
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  required
                  minLength={3}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              )}
              <Input
                type="text"
                placeholder="Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <Button
                type="submit"
                className="w-full bg-skyBlue"
                disabled={formLoading}
              >
                {formLoading
                  ? mode === "login"
                    ? "Logging in..."
                    : "Signing up..."
                  : mode === "login"
                  ? "Log in"
                  : "Sign up"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Auth;


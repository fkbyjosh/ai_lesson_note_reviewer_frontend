
import { useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { session, user, profile, loading } = useAuthSession();
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

  // If new signup with no username, prompt username
  const needsUsername = !!session && profile && !profile.username;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      // TODO: Replace with your custom backend API call
      // Example: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      
      // Mock success for now
      setTimeout(() => {
        toast({ title: "Login successful", description: "Please connect your custom backend API." });
        setFormLoading(false);
      }, 1000);
      
    } catch (error: any) {
      setFormLoading(false);
      toast({ title: "Login failed", description: error.message || "Please connect your custom backend API." });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      // TODO: Replace with your custom backend API call
      // Example: const response = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
      
      // Mock success for now
      setTimeout(() => {
        toast({ title: "Sign up successful", description: "Please connect your custom backend API." });
        setFormLoading(false);
      }, 1000);
      
    } catch (error: any) {
      setFormLoading(false);
      toast({ title: "Sign up failed", description: error.message || "Please connect your custom backend API." });
    }
  };

  const handleUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      // TODO: Replace with your custom backend API call
      // Example: const response = await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify({ username }) });
      
      if (!profile) return;
      
      // Mock success for now
      setTimeout(() => {
        toast({ title: "Username saved!", description: "Please connect your custom backend API." });
        setFormLoading(false);
        // window.location.reload(); // force reload so all pages see profile set
      }, 1000);
      
    } catch (error: any) {
      setFormLoading(false);
      toast({ title: "Username error", description: error.message || "Please connect your custom backend API." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle>{needsUsername ? "Set your Username" : mode === "login" ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {needsUsername
              ? "Choose a username to complete registration."
              : mode === "login"
              ? "Log in with your email and password."
              : "Create a new account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {needsUsername ? (
            <form onSubmit={handleUsername} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                required
                minLength={3}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button type="submit" className="w-full bg-skyBlue" disabled={formLoading}>
                {formLoading ? "Saving..." : "Save Username"}
              </Button>
            </form>
          ) : (
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
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Auth;


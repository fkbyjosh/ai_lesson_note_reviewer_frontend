
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useLogout } from "@/hooks/useLogout";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, loading } = useAuthSession();
  const logout = useLogout();
  const navigate = useNavigate();

  // If loading (unknown auth), avoid flickering login/logout
  const isUser = !loading && !!session;

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-8" />
          <span className="font-semibold text-lg text-gray-800">Family Care Schools</span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-skyBlue transition-colors">Home</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-skyBlue transition-colors">Dashboard</Link>
          <Link to="/lesson-notes" className="text-gray-700 hover:text-skyBlue transition-colors">Review Notes</Link>
          <Separator orientation="vertical" className="h-6" />
          {isUser ? (
            <Button
              variant="outline"
              className="border-skyBlue text-skyBlue hover:bg-skyBlue hover:text-white"
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="border-skyBlue text-skyBlue hover:bg-skyBlue hover:text-white">
                Login/Signup
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 rounded-md focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link to="/lesson-notes" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setIsOpen(false)}>
              Review Notes
            </Link>
            {isUser ? (
              <Button
                className="w-full bg-skyBlue hover:bg-skyBlue/90"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
              >
                Logout
              </Button>
            ) : (
              <Link to="/auth" className="block py-2 px-4" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-skyBlue hover:bg-skyBlue/90">Login/Signup</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

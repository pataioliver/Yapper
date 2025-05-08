import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-base-100/10 backdrop-blur-2xl border-b border-quaternary/20 fixed w-full top-0 z-40 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 animate-glassMorph">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group transition-all duration-300 hover:opacity-90 animate-glassMorph">
          <div className="size-9 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 animate-subtleScale">
            <MessageSquare className="size-5 text-primary-content" strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-bold text-base-content relative">
            Yapper
            <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-secondary to-tertiary animate-underlineGrow group-hover:animate-underlineGrow" />
          </h1>
        </Link>
        <nav className="hidden sm:flex items-center gap-2">
          <Link
            to="/settings"
            className="btn btn-sm bg-primary/15 backdrop-blur-2xl text-primary-content gap-2 hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
          >
            <Settings className="size-4 text-primary-content" />
            <span className="hidden sm:inline text-primary-content">Settings</span>
          </Link>
          {authUser && (
            <>
              <Link
                to="/profile"
                className="btn btn-sm bg-primary/15 backdrop-blur-2xl text-primary-content gap-2 hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
              >
                <User className="size-4 text-primary-content" />
                <span className="hidden sm:inline text-primary-content">Profile</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-sm bg-secondary/15 backdrop-blur-2xl text-secondary-content gap-2 hover:bg-secondary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
              >
                <LogOut className="size-4 text-secondary-content" />
                <span className="hidden sm:inline text-secondary-content">Logout</span>
              </button>
            </>
          )}
        </nav>
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="btn btn-sm bg-tertiary/15 backdrop-blur-2xl text-tertiary-content hover:bg-tertiary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
            aria-label="Toggle menu"
          >
            <svg className="size-5 text-tertiary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <nav className="sm:hidden absolute top-16 left-0 w-full bg-base-100/10 backdrop-blur-2xl border-b border-quaternary/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-slideDown">
            <div className="flex flex-col items-center gap-2 py-4">
              <Link
                to="/settings"
                onClick={toggleMenu}
                className="btn btn-sm bg-primary/15 backdrop-blur-2xl text-primary-content w-full max-w-xs gap-2 hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
              >
                <Settings className="size-4 text-primary-content" />
                Settings
              </Link>
              {authUser && (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="btn btn-sm bg-primary/15 backdrop-blur-2xl text-primary-content w-full max-w-xs gap-2 hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
                  >
                    <User className="size-4 text-primary-content" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="btn btn-sm bg-secondary/15 backdrop-blur-2xl text-secondary-content w-full max-w-xs gap-2 hover:bg-secondary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
                  >
                    <LogOut className="size-4 text-secondary-content" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
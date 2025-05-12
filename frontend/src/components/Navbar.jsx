import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 w-full bg-base-100/85 backdrop-blur-2xl border-b border-base-content/20 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <MessageSquare className="size-5 text-secondary-content" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-base-content">Yapper</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-2">
          <Link
            to="/settings"
            className="group px-3 py-1.5 rounded-xl bg-secondary border-2 border-secondary-content shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Settings className="size-4 text-secondary-content" />
              <span className="hidden sm:inline text-secondary-content font-medium">Settings</span>
            </div>
          </Link>
          {authUser && (
            <>
              <Link
                to="/profile"
                className="group px-3 py-1.5 rounded-xl bg-tertiary border-2 border-tertiary-content shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <User className="size-4 text-tertiary-content" />
                  <span className="hidden sm:inline text-tertiary-content font-medium">Profile</span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="group px-3 py-1.5 rounded-xl bg-quaternary border-2 border-quaternary-content shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="size-4 text-quaternary-content" />
                  <span className="hidden sm:inline text-quaternary-content font-medium">Logout</span>
                </div>
              </button>
            </>
          )}
        </nav>

        <button
          onClick={toggleMenu}
          className="sm:hidden btn btn-square btn-ghost btn-sm"
        >
          <div className="space-y-1.5">
            <div className={`h-0.5 w-6 bg-base-content transform transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`h-0.5 w-6 bg-base-content transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <div className={`h-0.5 w-6 bg-base-content transform transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>

        {isMenuOpen && (
          <nav className="sm:hidden absolute top-16 left-0 w-full bg-base-100/85 backdrop-blur-2xl border-b border-base-content/20 shadow-lg animate-slideDown">
            <div className="flex flex-col items-center gap-3 p-4 max-w-xs mx-auto">
              <Link
                to="/settings"
                onClick={toggleMenu}
                className="group flex items-center justify-center w-full gap-3 px-4 py-2.5 rounded-xl bg-secondary border-2 border-secondary-content shadow-md hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-98 transition-all duration-300"
              >
                <Settings className="size-5 text-secondary-content" />
                <span className="text-secondary-content font-medium">Settings</span>
              </Link>
              {authUser && (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="group flex items-center justify-center w-full gap-3 px-4 py-2.5 rounded-xl bg-tertiary border-2 border-tertiary-content shadow-md hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-98 transition-all duration-300"
                  >
                    <User className="size-5 text-tertiary-content" />
                    <span className="text-tertiary-content font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="group flex items-center justify-center w-full gap-3 px-4 py-2.5 rounded-xl bg-quaternary border-2 border-quaternary-content shadow-md hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-98 transition-all duration-300"
                  >
                    <LogOut className="size-5 text-quaternary-content" />
                    <span className="text-quaternary-content font-medium">Logout</span>
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
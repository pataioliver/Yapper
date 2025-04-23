import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-gradient-to-r from-base-100/95 to-base-200/30 animate-in fade-in duration-600 shadow-sm"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-all duration-300 hover:opacity-90 hover:scale-105"
            >
              <div
                className="size-9 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Yapper
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm gap-2 transition-all duration-300 hover:bg-base-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20"
            >
              <Settings className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
              <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Settings
              </span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 transition-all duration-300 hover:bg-base-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20"
                >
                  <User className="size-5 transition-transform duration-300 hover:scale-110" />
                  <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Profile
                  </span>
                </Link>

                <button
                  className="flex gap-2 items-center btn btn-sm transition-all duration-300 hover:bg-base-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20"
                  onClick={logout}
                >
                  <LogOut className="size-5 transition-transform duration-300 hover:scale-110" />
                  <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
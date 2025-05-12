import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/50 backdrop-blur-xl px-2">
      <div className="w-full max-w-md mx-auto bg-base-100/85 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-lg border border-tertiary/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-tertiary/40 animate-glassMorph">
        <div className="text-center mb-8 sm:mb-10 animate-bounceInScale">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 sm:size-16 rounded-2xl bg-secondary backdrop-blur-md flex items-center justify-center border border-secondary/40 shadow-lg">
              <MessageSquare className="w-6 h-6 text-base-100" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4">
              Welcome Back
            </h1>
            <p className="text-base-content/80">
              Sign in to your account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <input
                type="email"
                className="w-full pl-12 pr-5 py-3 sm:py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-tertiary/30 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 text-base-content placeholder-base-content/60"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="username"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-quaternary group-hover:text-secondary transition-all duration-300" />
            </div>
          </div>

          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.4s" }}>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 sm:py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-quaternary/30 focus:border-quaternary focus:ring-2 focus:ring-quaternary/20 text-base-content placeholder-base-content/60"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="current-password"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-quaternary group-hover:text-secondary transition-all duration-300" />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-quaternary hover:text-secondary transition-all duration-300"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-secondary-content py-3 sm:py-4 px-6 rounded-xl font-semibold shadow-md border-2 border-tertiary hover:border-quaternary hover:bg-tertiary/90 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-base"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center mt-6 sm:mt-8 animate-glassMorph" style={{ animationDelay: "0.6s" }}>
          <p className="text-base-content/80 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:text-tertiary transition-colors duration-300 underline underline-offset-2 decoration-primary decoration-2 focus:underline focus:outline-none"
              style={{ textDecoration: "underline", color: "var(--fallback-bc, #222)" }}
            >
              Create account
            </Link>
          </p>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
            <Link
              to="/forgot-password"
              className="text-error/90 font-semibold hover:text-error transition-all duration-300 relative group"
            >
              Forgot your password?
              <span className="absolute bottom-0 left-0 w-0 h-px bg-quaternary group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
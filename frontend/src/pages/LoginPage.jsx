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
    <div className="min-h-screen flex items-center justify-center backdrop-blur-xl animate-glassMorphPulse">
      <div className="w-full max-w-lg bg-base-100/85 backdrop-blur-xl rounded-3xl p-10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)] animate-glassMorph">
        <div className="text-center mb-10 animate-bounceInScale">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 rounded-2xl bg-gradient-to-r from-primary to-secondary backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-500 hover:scale-110 animate-pulseGlow border border-white/30">
              <MessageSquare className="size-7 text-primary-content" />
            </div>
            <h1 className="text-3xl font-bold mt-3 text-base-content font-poppins animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              Welcome Back
            </h1>
            <p className="text-quaternary-content/80 font-quicksand animate-slideIn" style={{ animationDelay: "0.4s" }}>
              Sign in to your account
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-control animate-slideIn" style={{ animationDelay: "0.6s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content font-roboto">Email</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-focus-within:scale-110">
                <Mail className="h-5 w-5 text-quaternary-content/70 group-focus-within:text-quaternary" />
              </div>
              <input
                type="email"
                className="input w-full pl-12 pr-4 py-3 bg-base-100/5 border border-base-content/10 rounded-xl focus:ring-2 focus:ring-quaternary/50 focus:border-quaternary/50 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 hover:bg-base-100/10 focus:bg-base-100/15 placeholder-quaternary-content/50 font-nunito animate-subtleScale"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control animate-slideIn" style={{ animationDelay: "0.8s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content font-roboto">Password</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 group-focus-within:scale-110">
                <Lock className="h-5 w-5 text-quaternary-content/70 group-focus-within:text-quaternary" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full pl-12 pr-12 py-3 bg-base-100/5 border border-base-content/10 rounded-xl focus:ring-2 focus:ring-quaternary/50 focus:border-quaternary/50 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 hover:bg-base-100/10 focus:bg-base-100/15 placeholder-quaternary-content/50 font-nunito animate-subtleScale"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 hover:scale-110 animate-fadeIn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-quaternary-content/70 hover:text-quaternary" />
                ) : (
                  <Eye className="h-5 w-5 text-quaternary-content/70 hover:text-quaternary" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="relative w-full bg-secondary/90 backdrop-blur-md text-secondary-content rounded-xl py-3 px-4 font-semibold font-poppins shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500 hover:scale-105 active:scale-95 animate-dynamicScale border border-white/20 overflow-hidden group"
            disabled={isLoggingIn}
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100 origin-center rounded-full" />
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-secondary-content inline-block mr-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="text-center mt-6 animate-fadeIn" style={{ animationDelay: "1.2s" }}>
          <p className="text-quaternary-content/80 font-quicksand">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="relative text-tertiary-content font-semibold font-nunito transition-all duration-500 hover:text-tertiary/80 group"
            >
              Create account
              <span className="absolute bottom-0 left-0 h-0.5 bg-tertiary/80 w-0 group-hover:w-full transition-all duration-500" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
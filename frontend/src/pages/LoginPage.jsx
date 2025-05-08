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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200/85 to-quaternary/20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="w-full max-w-md bg-base-100/85 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500 animate-glassMorphPulse border border-base-content/20">
        <div className="text-center mb-8 animate-popIn">
          <div className="flex flex-col items-center gap-2">
            <div className="size-12 rounded-xl bg-secondary/85 backdrop-blur-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-softPulse border border-base-content/20">
              <MessageSquare className="size-6 text-secondary-content" />
            </div>
            <h1 className="text-2xl font-bold mt-2 text-base-content animate-popIn" style={{ animationDelay: "0.2s" }}>
              Welcome Back
            </h1>
            <p className="text-quaternary-content animate-popIn" style={{ animationDelay: "0.4s" }}>
              Sign in to your account
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control animate-popIn" style={{ animationDelay: "0.6s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-quaternary-content" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-quaternary bg-base-100/85 border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control animate-popIn" style={{ animationDelay: "0.8s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-quaternary-content" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-quaternary bg-base-100/85 border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-500 animate-popIn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-quaternary-content" /> : <Eye className="h-5 w-5 text-quaternary-content" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary/85 backdrop-blur-sm text-secondary-content rounded-lg p-3 shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-500 animate-popIn border border-base-content/20"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-secondary-content inline-block mr-2" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="text-center mt-4 animate-popIn" style={{ animationDelay: "1s" }}>
          <p className="text-quaternary-content">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-tertiary text-tertiary-content transition-all duration-500">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
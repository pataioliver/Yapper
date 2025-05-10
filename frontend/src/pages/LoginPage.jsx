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
    <div className="min-h-screen flex items-center justify-center bg-base-200/50 backdrop-blur-xl">
      {/* Main card with glass effect */}
      <div className="w-full max-w-md mx-4 bg-base-100/85 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-white/30 animate-glassMorph">
        {/* App icon with larger size */}
        <div className="text-center mb-10 animate-bounceInScale">
          <div className="flex flex-col items-center gap-3">
            <div className="size-16 rounded-2xl bg-secondary/85 backdrop-blur-md flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300">
              <MessageSquare className="w-6 h-6 text-secondary-content" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold mt-4 text-base-content font-sanfrancisco">
              Welcome Back
            </h1>
            <p className="text-base-content/70 font-sanfrancisco">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <input
                type="email"
                className="w-full pl-14 pr-5 py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base-content placeholder-base-content/50 font-sanfrancisco transition-all duration-300 hover:bg-base-100/90 focus:bg-base-100"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/70 group-hover:text-primary group-focus-within:scale-110 transition-all duration-300" />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.4s" }}>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-14 pr-12 py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base-content placeholder-base-content/50 font-sanfrancisco transition-all duration-300 hover:bg-base-100/90 focus:bg-base-100"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/70 group-hover:text-primary group-focus-within:scale-110 transition-all duration-300" />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-primary group-focus-within:scale-110 transition-all duration-300"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-secondary text-secondary-content py-4 px-6 rounded-xl font-semibold font-sanfrancisco shadow-md hover:shadow-lg transition-all duration-300 hover:dynamicScale active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
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

        {/* Footer with improved link visibility */}
        <div className="text-center mt-8 animate-glassMorph" style={{ animationDelay: "0.6s" }}>
          <p className="text-base-content/70 font-sanfrancisco">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent font-semibold hover:text-accent-focus transition-colors duration-300 relative group"
            >
              Create account
              <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:animate-underlineGrow" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
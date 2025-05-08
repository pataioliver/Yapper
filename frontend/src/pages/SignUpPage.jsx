import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
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
    const res = await signup(formData);
    if (res && res.token) {
      navigate("/verify-email", { state: { token: res.token, fullName: formData.fullName, email: formData.email, password: formData.password } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200/85 to-quaternary/20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="w-full max-w-lg bg-base-100/85 backdrop-blur-xl rounded-2xl p-10 shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500 animate-glassMorphPulse border border-base-content/20">
        <div className="text-center mb-10 animate-popIn">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 rounded-lg bg-secondary/85 backdrop-blur-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-softPulse border border-base-content/20">
              <MessageSquare className="size-7 text-secondary-content" />
            </div>
            <h1 className="text-3xl font-bold mt-3 text-base-content animate-popIn" style={{ animationDelay: "0.2s" }}>
              Create Account
            </h1>
            <p className="text-quaternary-content text-base animate-popIn" style={{ animationDelay: "0.4s" }}>
              Join Yapper today
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-control animate-popIn" style={{ animationDelay: "0.6s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-6 w-6 text-quaternary-content" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-quaternary bg-base-100/85 backdrop-blur-sm border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control animate-popIn" style={{ animationDelay: "0.8s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-quaternary-content" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-quaternary bg-base-100/85 backdrop-blur-sm border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control animate-popIn" style={{ animationDelay: "1s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-quaternary-content" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-quaternary bg-base-100/85 backdrop-blur-sm border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
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
                {showPassword ? <EyeOff className="h-6 w-6 text-quaternary-content" /> : <Eye className="h-6 w-6 text-quaternary-content" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary/85 backdrop-blur-sm text-secondary-content rounded-lg p-3.5 shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-500 animate-popIn border border-base-content/20"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-secondary-content inline-block mr-2" />
                Loading...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
        <div className="text-center mt-6 animate-popIn" style={{ animationDelay: "1.2s" }}>
          <p className="text-quaternary-content text-base">
            Already have an account?{" "}
            <Link to="/login" className="link link-tertiary text-tertiary-content transition-all duration-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-b from-base-200 to-base-300/70 animate-in fade-in duration-600">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-base-100 rounded-lg p-8 shadow-lg shadow-primary/20 transition-all duration-400 hover:shadow-xl">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/20"
              >
                <MessageSquare className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h1 className="text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Create Account
              </h1>
              <p className="text-base-content/60 transition-opacity duration-300 group-hover:opacity-80">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40 transition-opacity duration-300 hover:opacity-80" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:bg-base-100/90 hover:shadow-md hover:shadow-primary/20"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40 transition-opacity duration-300 hover:opacity-80" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:bg-base-100/90 hover:shadow-md hover:shadow-primary/20"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40 transition-opacity duration-300 hover:opacity-80" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:bg-base-100/90 hover:shadow-md hover:shadow-primary/20"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-primary/20"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60 transition-opacity duration-300 hover:opacity-80">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary transition-all duration-300 hover:underline hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
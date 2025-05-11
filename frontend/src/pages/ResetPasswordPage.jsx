import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Loader2, MessageSquare } from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return toast.error("Both password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/50 backdrop-blur-xl px-2">
      <div className="w-full max-w-md mx-auto bg-base-100/85 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-lg border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-white/30 animate-glassMorph">
        <div className="text-center mb-8 sm:mb-10 animate-bounceInScale">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 sm:size-16 rounded-2xl bg-secondary/85 backdrop-blur-md flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300">
              <MessageSquare className="w-6 h-6 text-secondary-content" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-content">
              Reset Password
            </h1>
            <p className="text-base-content/70">
              Enter your new password below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 sm:py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base-content placeholder-base-content/50 transition-all duration-300 hover:bg-base-100/90 focus:bg-base-100 text-sm sm:text-base"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/70 group-hover:text-secondary group-focus-within:scale-110 transition-all duration-300" />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-secondary group-focus-within:scale-110 transition-all duration-300"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.4s" }}>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 sm:py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base-content placeholder-base-content/50 transition-all duration-300 hover:bg-base-100/90 focus:bg-base-100 text-sm sm:text-base"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/70 group-hover:text-secondary group-focus-within:scale-110 transition-all duration-300" />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-secondary group-focus-within:scale-110 transition-all duration-300"
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
            className="w-full bg-secondary text-secondary-content py-3 sm:py-4 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:dynamicScale active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
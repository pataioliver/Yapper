import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Mail, Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Animation sequence control
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/api/auth/request-password-reset", { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/50 backdrop-blur-xl px-4 py-6 sm:py-0">
      <div className="w-full max-w-md mx-auto bg-base-100/85 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-lg border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-white/30 animate-glassMorph animation-gpu">
        <div className={`text-center mb-8 sm:mb-10 ${isMounted ? 'animate-bounceInScale' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 sm:size-16 rounded-2xl bg-secondary/85 backdrop-blur-md flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300">
              <MessageSquare className="w-6 h-6 text-secondary-content" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-content">
              Forgot Password
            </h1>
            <p className="text-base-content/70">
              Enter your email to reset your password
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className={`form-control ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`} style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <input
                type="email"
                className="w-full pl-12 pr-5 py-3 sm:py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base-content placeholder-base-content/50 transition-all duration-300 hover:bg-base-100/90 focus:bg-base-100 text-sm sm:text-base"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/70 group-hover:text-secondary group-focus-within:scale-110 transition-all duration-300" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-secondary-content py-3 sm:py-4 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              "Send Reset Email"
            )}
          </button>
        </form>
        <div className={`text-center mt-6 sm:mt-8 ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`} style={{ animationDelay: "0.4s" }}>
          <Link
            to="/login"
            className="text-base-content font-semibold hover:text-tertiary transition-colors duration-300 text-sm sm:text-base"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, Mail, Key } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, fullName, email, password } = location.state || {};
  const { setAuthUser } = useAuthStore();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.error("Verification code is required");
      return;
    }
    try {
      setIsVerifying(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, verificationCode, fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setAuthUser(data.user);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      if (error.message.includes("already verified")) navigate("/login");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/50 backdrop-blur-xl px-2">
      <div className="w-full max-w-md mx-auto bg-base-100/85 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-lg border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-white/30 animate-glassMorph">
        <div className="text-center mb-8 sm:mb-10 animate-bounceInScale">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 sm:size-16 rounded-2xl bg-secondary/85 backdrop-blur-md flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300">
              <Mail className="w-6 h-6 text-secondary-content" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-content">
              Verify Your Email
            </h1>
            <p className="text-base-content/70">
              Enter the verification code sent to your email
            </p>
          </div>
        </div>
        <form onSubmit={handleVerify} className="space-y-5 sm:space-y-6">
          <div className="form-control animate-glassMorph" style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <input
                type="number"
                className="w-full pl-12 pr-5 py-3 sm:py-4 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base-content placeholder-base-content/50 transition-all duration-300 hover:bg-base-100/90 focus:bg-base-100 text-sm sm:text-base"
                placeholder="Enter your code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                autoComplete="one-time-code"
              />
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/70 group-hover:text-primary group-focus-within:scale-110 transition-all duration-300" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-secondary-content py-3 sm:py-4 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:dynamicScale active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-base"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
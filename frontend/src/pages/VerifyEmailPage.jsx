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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200/85 to-quaternary/20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="w-full max-w-lg bg-base-100/85 backdrop-blur-xl rounded-2xl p-10 shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500 animate-glassMorphPulse border border-base-content/20">
        <div className="text-center mb-10 animate-popIn">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-softPulse border border-base-content/20">
              <Mail className="size-7 text-primary-content" />
            </div>
            <h1 className="text-3xl font-bold mt-3 text-base-content animate-popIn" style={{ animationDelay: "0.2s" }}>
              Verify Your Email
            </h1>
            <p className="text-quaternary-content text-base animate-popIn" style={{ animationDelay: "0.4s" }}>
              Enter the verification code sent to your email
            </p>
          </div>
        </div>
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="form-control animate-popIn" style={{ animationDelay: "0.6s" }}>
            <label className="label">
              <span className="label-text font-medium text-base-content">Verification Code</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-6 w-6 text-quaternary-content" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-quaternary bg-base-100/85 backdrop-blur-sm border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
                placeholder="Enter your code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary/85 backdrop-blur-sm text-primary-content rounded-lg p-3.5 shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-500 animate-popIn border border-base-content/20"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-primary-content inline-block mr-2" />
                Verifying...
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
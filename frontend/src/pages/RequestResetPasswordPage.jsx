import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200 to-base-300/70">
      <div className="w-full max-w-md bg-base-100 rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="mb-4 text-sm text-gray-600">
          Enter your email address below, and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200 to-base-300/70">
            <div className="w-full max-w-md bg-base-100 rounded-lg p-8 shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <p className="mb-4 text-sm text-gray-600">
                    Enter your new password below to reset your account password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="input input-bordered w-full"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="input input-bordered w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
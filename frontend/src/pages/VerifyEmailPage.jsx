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

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!verificationCode.trim()) {
            return toast.error("Verification code is required");
        }

        try {
            setIsVerifying(true);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    verificationCode,
                    fullName,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Verification failed");
            }

            // Set the authUser state after successful verification
            useAuthStore.setState({ authUser: data.user });

            toast.success(data.message);
            navigate("/"); // Redirect to login after successful verification
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200 to-base-300/70 animate-in fade-in duration-600">
            <div className="w-full max-w-md bg-base-100 rounded-lg p-8 shadow-lg shadow-primary/20 transition-all duration-400 hover:shadow-xl">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div
                            className="size-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/20"
                        >
                            <Mail className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            Verify Your Email
                        </h1>
                        <p className="text-base-content/60 transition-opacity duration-300 group-hover:opacity-80">
                            Enter the verification code sent to your email
                        </p>
                    </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Verification Code
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Key className="size-5 text-base-content/40 transition-opacity duration-300 hover:opacity-80" />
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:bg-base-100/90 hover:shadow-md hover:shadow-primary/20"
                                placeholder="Enter your code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-primary/20"
                        disabled={isVerifying}
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
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
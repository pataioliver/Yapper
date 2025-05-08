import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-base-200/85 to-quaternary/20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100/85 backdrop-blur-xl rounded-2xl p-6 space-y-8 shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500 animate-glassMorphPulse border border-base-content/20">
          <div className="text-center animate-popIn">
            <h1 className="text-2xl font-semibold text-base-content">Profile</h1>
            <p className="mt-2 text-quaternary-content animate-popIn" style={{ animationDelay: "0.2s" }}>
              Your profile information
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 animate-popIn" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 animate-popIn"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-tertiary/85 backdrop-blur-sm p-2 rounded-full cursor-pointer ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} transition-all duration-500 animate-popIn border border-base-content/20`}
              >
                <Camera className="w-5 h-5 text-tertiary-content" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-sm text-quaternary-content animate-popIn" style={{ animationDelay: "0.6s" }}>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5 animate-popIn" style={{ animationDelay: "0.8s" }}>
              <div className="text-sm text-quaternary-content flex items-center gap-2">
                <User className="w-4 h-4 text-tertiary" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-100/85 backdrop-blur-sm rounded-lg border border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500">
                {authUser?.fullName}
              </p>
            </div>
            <div className="space-y-1.5 animate-popIn" style={{ animationDelay: "1s" }}>
              <div className="text-sm text-quaternary-content flex items-center gap-2">
                <Mail className="w-4 h-4 text-tertiary" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-100/85 backdrop-blur-sm rounded-lg border border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500">
                {authUser?.email}
              </p>
            </div>
          </div>
          <div className="mt-6 bg-base-100/85 backdrop-blur-sm rounded-xl p-6 shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-popIn border border-base-content/20" style={{ animationDelay: "1.2s" }}>
            <h2 className="text-lg font-medium text-base-content">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-content/20">
                <span className="text-quaternary-content">Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-quaternary-content">Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
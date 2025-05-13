import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

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
      await updateProfile({ profilePicture: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100/85 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-white/30 animate-glassMorph">
          <div className="text-center mb-8 animate-bounceInScale">
            <h1 className="text-3xl font-bold text-base-content font-sanfrancisco">Profile</h1>
            <p className="mt-2 text-base-content/70 font-sanfrancisco">
              Your profile information
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 animate-glassMorph" style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePicture || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-tertiary/85 backdrop-blur-sm p-2 rounded-full cursor-pointer ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} transition-all duration-300 hover:scale-110 border border-base-content/20`}
              >
                <Camera className="w-5 h-5 text-tertiary-content" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-sm text-base-content/70 font-sanfrancisco">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6 mt-8">
            <div className="space-y-1.5 animate-glassMorph" style={{ animationDelay: "0.4s" }}>
              <div className="text-sm text-base-content/70 flex items-center gap-2 group">
                <User className="w-4 h-4 text-tertiary group-hover:scale-110 transition-all duration-300" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 text-base-content font-sanfrancisco transition-all duration-300 hover:bg-base-100/90">
                {authUser?.fullName}
              </p>
            </div>
            <div className="space-y-1.5 animate-glassMorph" style={{ animationDelay: "0.6s" }}>
              <div className="text-sm text-base-content/70 flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-tertiary group-hover:scale-110 transition-all duration-300" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 text-base-content font-sanfrancisco transition-all duration-300 hover:bg-base-100/90">
                {authUser?.email}
              </p>
            </div>
          </div>
          <div className="mt-8 bg-base-100/70 backdrop-blur-sm rounded-xl p-6 border border-base-content/10 animate-glassMorph" style={{ animationDelay: "0.8s" }}>
            <h2 className="text-lg font-medium text-base-content font-sanfrancisco">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/70 font-sanfrancisco">Member Since</span>
                <span className="font-sanfrancisco">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/70 font-sanfrancisco">Account Status</span>
                <span className="text-green-500 font-sanfrancisco">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
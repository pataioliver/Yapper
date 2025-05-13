import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePicture: base64Image });
        toast.success("Profile picture updated successfully");
      } catch (error) {
        toast.error("Failed to update profile picture");
        setSelectedImg(null);
      }
    };
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="max-w-2xl mx-auto p-3 sm:p-4 py-6 sm:py-8">
        <div className="bg-base-100/85 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-[0_0_30px_rgba(255,255,255,0.4)] border border-base-content/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-white/30 animate-glassMorph">
          <div className={`text-center mb-6 sm:mb-8 ${isMounted ? 'animate-bounceInScale' : 'opacity-0'}`}>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content font-sanfrancisco">Profile</h1>
            <p className="mt-2 text-sm sm:text-base text-base-content/70 font-sanfrancisco">
              Your profile information
            </p>
          </div>
          <div className={`flex flex-col items-center gap-4 ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`} style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <img
                src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="size-28 sm:size-32 rounded-full object-cover border-4 border-base-content/20 shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-tertiary/85 backdrop-blur-sm p-2 rounded-full cursor-pointer ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} transition-all duration-300 hover:scale-110 border border-base-content/20`}
              >
                <Camera className="w-5 h-5 text-tertiary-content" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-xs sm:text-sm text-base-content/70 font-sanfrancisco">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
            <div className={`space-y-1.5 ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`} style={{ animationDelay: "0.4s" }}>
              <div className="text-xs sm:text-sm text-base-content/70 flex items-center gap-2 group">
                <User className="w-4 h-4 text-tertiary group-hover:scale-110 transition-all duration-300" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 text-sm sm:text-base text-base-content font-sanfrancisco transition-all duration-300 hover:bg-base-100/90">
                {authUser?.fullName || "Not available"}
              </p>
            </div>
            <div className={`space-y-1.5 ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`} style={{ animationDelay: "0.6s" }}>
              <div className="text-xs sm:text-sm text-base-content/70 flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-tertiary group-hover:scale-110 transition-all duration-300" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-content/10 text-sm sm:text-base text-base-content font-sanfrancisco transition-all duration-300 hover:bg-base-100/90">
                {authUser?.email || "Not available"}
              </p>
            </div>
          </div>
          <div className={`mt-6 sm:mt-8 bg-base-100/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-base-content/10 ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`} style={{ animationDelay: "0.8s" }}>
            <h2 className="text-base sm:text-lg font-medium text-base-content font-sanfrancisco">Account Information</h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/70 font-sanfrancisco">Member Since</span>
                <span className="font-sanfrancisco">{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "Not available"}</span>
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
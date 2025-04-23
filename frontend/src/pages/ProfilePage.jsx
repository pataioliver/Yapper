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
    <div className="h-screen pt-20 bg-gradient-to-b from-base-200 to-base-300/70 animate-in fade-in duration-600">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-8 shadow-lg shadow-primary/20 transition-all duration-400 hover:shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Profile
            </h1>
            <p className="mt-2 text-base-content/60 transition-opacity duration-300 hover:opacity-80">
              Your profile information
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-primary/20 transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content p-2 rounded-full cursor-pointer 
                  transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400 transition-opacity duration-300 hover:opacity-80">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-100 rounded-lg border bg-gradient-to-r from-base-100 to-base-200/30 shadow-sm">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-100 rounded-lg border bg-gradient-to-r from-base-100 to-base-200/30 shadow-sm">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-100 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20">
            <h2 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
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
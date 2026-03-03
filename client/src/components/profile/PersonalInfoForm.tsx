import { useState, useContext } from "react";
import { Upload } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import { StatusModal } from "../ui/StatusModal";

export function PersonalInfoForm() {
  const { user } = useContext(AuthContext);
  const { updateProfile, updating } = useUser();

  const [status, setStatus] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const [profileImage, setProfileImage] = useState(
    user?.img || "../../../public/user-profile.png",
  );

  const [info, setInfo] = useState({
    firstName: user?.username?.split(" ")[0] || "",
    lastName: user?.username?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updatedData = {
      username: `${info.firstName} ${info.lastName}`.trim(),
      phone: info.phone,
      img: profileImage,
    };

    const result = await updateProfile(updatedData);

    if (result.success) {
      setStatus({
        isOpen: true,
        type: "success",
        message: "Profile updated successfully!",
      });
    } else {
      setStatus({
        isOpen: true,
        type: "error",
        message: result.message || "Failed to update profile.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Personal Information
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your personal details and profile picture
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
        {/* --- Custom Avatar Upload --- */}
        <div className="mb-8">
          <label className="block mb-4 font-semibold text-gray-900 dark:text-white">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-2xl shadow-md"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-[#6576cf] flex items-center justify-center text-white text-3xl font-bold">
                  {info.firstName[0]}
                  {info.lastName[0]}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("profile-upload")?.click()
                }
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* --- Input Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              value={info.firstName}
              onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6576cf] transition-all bg-transparent"
              placeholder="First name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              value={info.lastName}
              onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[##6576cf] transition-all bg-transparent"
              placeholder="Last name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={info.email}
              disabled
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6576cf] transition-all bg-transparent"
              placeholder="Phone number"
            />
          </div>
        </div>

        {/* --- Action Button --- */}
        <button
          onClick={handleSave}
          disabled={updating}
          className={`mt-8 px-8 py-3 text-white rounded-xl font-semibold transition-all active:scale-95 flex items-center gap-2 ${
            updating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none"
          }`}
        >
          {updating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
      <StatusModal
        isOpen={status.isOpen}
        onClose={() => setStatus((prev) => ({ ...prev, isOpen: false }))}
        type={status.type}
        message={status.message}
      />
    </div>
  );
}

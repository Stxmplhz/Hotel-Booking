    import { useState } from "react"
    import { useUser } from "../../hooks/useUser";
    import { StatusModal } from "../ui/StatusModal";

    export function SecuritySettingForm() {
    const { updateProfile, updating } = useUser();

    const [status, setStatus] = useState<{
        isOpen: boolean;
        type: "success" | "error";
        message: string;
    }>({ isOpen: false, type: "success", message: "" });

    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSave = async () => {
        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            return setStatus({
                isOpen: true,
                type: "error",
                message: "New passwords do not match!",
            });
        } 

        const result = await updateProfile({ 
            currentPassword: passwordInfo.currentPassword, 
            password: passwordInfo.newPassword 
        });

        if (result.success) {
            setStatus({
            isOpen: true,
            type: "success",
            message: "Password updated successfully!",
        });
        } else {
            setStatus({
            isOpen: true,
            type: "error",
            message: result.message || "Failed to update password.",
        });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
        {/* Title Section */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Security Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
            Manage your password and security preferences
            </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
        
            {/* --- Input Fields --- */}
            <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
                </label>
                <input
                type="password"
                value={passwordInfo.currentPassword}
                onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6576cf] transition-all bg-transparent"
                placeholder="Enter Current Password"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
                </label>
                <input
                type="password"
                value={passwordInfo.newPassword}
                onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6576cf] transition-all bg-transparent"
                placeholder="Enter New Password"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
                </label>
                <input
                type="password"
                value={passwordInfo.confirmPassword}
                onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6576cf] transition-all bg-transparent"
                placeholder="Confirm New Password"
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
                "Updates Password"
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

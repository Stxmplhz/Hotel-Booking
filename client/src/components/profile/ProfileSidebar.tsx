import { User, Calendar, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (id: any) => void;
  user: any;
}

export function ProfileSidebar({
  activeSection,
  onSectionChange,
  user,
}: ProfileSidebarProps) {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); 
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    //{ id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "bookings", label: "My Bookings", icon: Calendar },
  ];

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 min-h-screen sticky top-0 hidden md:block">
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {user?.img ? (
              <img
                src={user.img}
                alt="Profile"
                className="w-full h-full object-cover rounded-full shadow-sm"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#6576cf] flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.username || "Guest User"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email || "No email provided"}
          </p>
        </div>

        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() =>
                  item.id === "bookings"
                    ? navigate("/mybookings")
                    : onSectionChange(item.id)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400  hover:bg-gray-100 hover:dark:bg-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-600 border border-red-600  rounded-xl hover:bg-red-600 hover:text-white transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

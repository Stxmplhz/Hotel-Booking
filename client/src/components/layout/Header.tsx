import { MdSunny } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import type { User } from "../../types";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  theme: string;
  setTheme: (theme: string) => void;
  isLoggedIn: boolean;
  user: User | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
}

const Header = ({
  title,
  theme,
  setTheme,
  isLoggedIn,
  user,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}: HeaderProps) => {
  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  const navBtnClass =
    "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-colors";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-blue-950 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {title}
        </h1>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-2">
          <Link to="/" className={navBtnClass}>
            Home
          </Link>
          <Link to="/hotels" className={navBtnClass}>
            Hotels
          </Link>
          {isLoggedIn && (
            <Link to="/mybookings" className={navBtnClass}>
              My Bookings
            </Link>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          // Account & Logout Button
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:opacity-80 transition-opacity p-1 rounded-lg"
            >
              <div className="w-8 h-8 relative flex-shrink-0">
                {user?.img ? (
                  <img
                    src={user.img}
                    alt="profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#6576cf] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <span className="text-sm font-medium hidden md:block">
                {user?.username || "User"}
              </span>
            </Link>
            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>

            <button
              onClick={onLogoutClick}
              className="text-gray-500 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <RiLogoutBoxRLine size={20} />
            </button>
          </div>
        ) : (
          // Log In / Sign Up
          <div className="flex items-center gap-2">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onRegisterClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md"
            >
              Sign up
            </button>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white transition-all"
        >
          {theme === "light" ? (
            <MdSunny size={24} />
          ) : (
            <BsFillMoonStarsFill size={20} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;

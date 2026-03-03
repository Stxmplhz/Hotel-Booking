import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from "./services/api.ts";
import Header from "./components/layout/Header.tsx";
import { Footer } from "./components/layout/Footer.tsx";
import AuthModal from "./components/auth/AuthModal";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { Home } from "./pages/Home.tsx";
import { Hotels } from "./pages/Hotels.tsx";
import { Hotel } from "./pages/Hotel.tsx";
import { BookingCheckout } from "./pages/BookingCheckOut.tsx";
import { MyBookings } from "./pages/MyBookings.tsx";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("mode") || "light");
  const {
    user,
    dispatch,
    isAuthModalOpen,
    modalMode,
    openAuthModal,
    closeAuthModal,
  } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("mode", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLoginSuccess = (userData: any) => {
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    closeAuthModal();
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      alert("Logged out");
    } catch (err) {
      console.error(err);
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header
          title="Stayly"
          theme={theme}
          setTheme={setTheme}
          isLoggedIn={user !== null}
          user={user}
          onLoginClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onLogoutClick={handleLogout}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<Hotel />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/booking" element={<BookingCheckout />} />
              <Route path="/mybookings" element={<MyBookings />} />
            </Route>
          </Routes>
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onLoginSuccess={handleLoginSuccess}
          initialMode={modalMode}
        />
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

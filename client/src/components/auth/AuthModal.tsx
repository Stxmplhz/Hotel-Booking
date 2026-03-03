import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  initialMode: "login" | "register";
}

const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode,
}: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setInputs({ username: "", email: "", password: "" });
    }
  }, [isOpen, initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (mode === "login") {
        res = await api.post("/auth/login", {
          email: inputs.email,
          password: inputs.password,
        });
      } else {
        await api.post("/auth/register", inputs);
        res = await api.post("/auth/login", {
          email: inputs.email,
          password: inputs.password,
        });
      }

      onLoginSuccess(res.data.details);
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Welcome Back" : "Create Account"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={inputs.email}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Username */}
        {mode === "register" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="johndoe"
              value={inputs.username}
              onChange={handleChange}
              required
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={inputs.password}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? "Processing..." : mode === "login" ? "Login" : "Register"}
        </button>

        <div className="text-center text-sm text-gray-500 mt-2">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            onClick={toggleMode}
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </span>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;

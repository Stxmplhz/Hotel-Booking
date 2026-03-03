import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export const useUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [updating, setUpdating] = useState(false);

  const updateProfile = async (info: any) => {
    if (!user) return { success: false, message: "User not authenticated" };
    setUpdating(true);
    try {
      const res = await api.put(`/users/${user._id}`, info);

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating };
};

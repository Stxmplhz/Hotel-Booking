import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const useUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [updating, setUpdating] = useState(false);

  const updateProfile = async (info: any) => {
    if (!user) return { success: false, message: "User not authenticated" };
    setUpdating(true);
    try {
      const res = await axios.put(
        `http://localhost:8800/api/users/${user._id}`,
        info,
        {
          withCredentials: true,
        },
      );
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

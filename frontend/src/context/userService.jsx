// /context/userService.js
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/change-password`, {
      currentPassword,
      newPassword,
    });

    if (response.data.success) {
      toast.success("Password changed successfully!");
      return true;
    } else {
      toast.error(response.data.message || "Failed to change password.");
      return false;
    }
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error(error.response?.data?.message || "Server error while changing password.");
    return false;
  }
};
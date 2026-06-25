import axiosInstance from "@/services/axiosInstance";
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/utils/tokenUtils";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/api/v1/auth/login/", {
    email,
    password,
  });

  const { access, refresh } = response.data;

  setAccessToken(access);
  setRefreshToken(refresh);

  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get("/api/v1/auth/users/me/");
  return response.data;
};

export const logout = () => {
  clearTokens();
};

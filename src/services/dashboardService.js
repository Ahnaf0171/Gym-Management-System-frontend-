import axiosInstance from "@/services/axiosInstance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/api/v1/auth/dashboard/stats/");
  return response.data;
};

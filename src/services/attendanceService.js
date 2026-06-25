import axiosInstance from "@/services/axiosInstance";

export const getAttendance = async (page = 1) => {
  const response = await axiosInstance.get("/api/v1/attendance/", {
    params: { page },
  });
  return response.data;
};

export const checkIn = async () => {
  const response = await axiosInstance.post("/api/v1/attendance/", {});
  return response.data;
};

export const checkOut = async (id) => {
  const response = await axiosInstance.patch(`/api/v1/attendance/${id}/`, {});
  return response.data;
};

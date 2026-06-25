import axiosInstance from "@/services/axiosInstance";

export const getUsers = async (page = 1, role = null, search = "") => {
  const response = await axiosInstance.get("/api/v1/auth/users/", {
    params: {
      page,
      ...(role && { role }),
      ...(search && { search }),
    },
  });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post("/api/v1/auth/users/", userData);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/v1/auth/users/${id}/`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const isFormData = userData instanceof FormData;
  const response = await axiosInstance.patch(
    `/api/v1/auth/users/${id}/`,
    userData,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/auth/users/${id}/`);
  return response.data;
};

export const getPublicTrainers = async () => {
  const response = await axiosInstance.get("/api/v1/auth/public/trainers/");
  return response.data;
};

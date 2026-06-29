import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

export const getBranches = async (page = 1) => {
  const response = await axiosInstance.get("/api/v1/branches/", {
    params: { page },
  });
  return response.data;
};

export const createBranch = async (branchData) => {
  const response = await axiosInstance.post("/api/v1/branches/", branchData);
  return response.data;
};

export const getPublicBranches = async () => {
  const response = await axios.get("/api/v1/branches/public/");
  return response.data;
};

export const updateBranch = async (id, branchData) => {
  const response = await axiosInstance.patch(`/api/v1/branches/${id}/`, branchData);
  return response.data;
};

export const deleteBranch = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/branches/${id}/`);
  return response.data;
};

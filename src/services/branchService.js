import axiosInstance from "@/services/axiosInstance";

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

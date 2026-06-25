import axiosInstance from "@/services/axiosInstance";

export const getWorkoutPlans = async (page = 1) => {
  const response = await axiosInstance.get("/api/v1/workouts/workout-plans/", {
    params: { page },
  });
  return response.data;
};

export const createWorkoutPlan = async (planData) => {
  const response = await axiosInstance.post(
    "/api/v1/workouts/workout-plans/",
    planData,
  );
  return response.data;
};

export const updateWorkoutPlan = async (id, planData) => {
  const response = await axiosInstance.patch(
    `/api/v1/workouts/workout-plans/${id}/`,
    planData,
  );
  return response.data;
};

export const deleteWorkoutPlan = async (id) => {
  const response = await axiosInstance.delete(
    `/api/v1/workouts/workout-plans/${id}/`,
  );
  return response.data;
};

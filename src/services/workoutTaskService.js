import axiosInstance from "@/services/axiosInstance";

export const getWorkoutTasks = async (page = 1) => {
  const response = await axiosInstance.get("/api/v1/workouts/workout-tasks/", {
    params: { page },
  });
  return response.data;
};

export const createWorkoutTask = async (taskData) => {
  const response = await axiosInstance.post(
    "/api/v1/workouts/workout-tasks/",
    taskData,
  );
  return response.data;
};

export const updateWorkoutTask = async (id, data) => {
  const response = await axiosInstance.patch(
    `/api/v1/workouts/workout-tasks/${id}/`,
    data,
  );
  return response.data;
};

export const deleteWorkoutTask = async (id) => {
  const response = await axiosInstance.delete(
    `/api/v1/workouts/workout-tasks/${id}/`,
  );
  return response.data;
};

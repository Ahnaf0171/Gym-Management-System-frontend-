export const ROLES = {
  ADMIN: "super_admin",
  MANAGER: "gym_manager",
  TRAINER: "trainer",
  MEMBER: "member",
};

export const PUBLIC_NAV_LINKS = [
  { id: 1, path: "/", label: "Home" },
  { id: 2, path: "/about", label: "About" },
  { id: 3, path: "/why-join", label: "Why Join" },
  { id: 4, path: "/plans", label: "Plans" },
  { id: 5, path: "/coaches", label: "Coaches" },
  { id: 6, path: "/visit", label: "Visit Our Gym" },
];

export const ROUTES = {
  LOGIN: "/login",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_BRANCHES: "/admin/branches",
  ADMIN_USERS: "/admin/users",

  MANAGER_DASHBOARD: "/manager/dashboard",
  MANAGER_USERS: "/manager/users",
  MANAGER_PLANS: "/manager/workout-plans",
  MANAGER_ATTENDANCE: "/manager/attendance",

  TRAINER_DASHBOARD: "/trainer/dashboard",
  TRAINER_USERS: "/trainer/members",
  TRAINER_PLANS: "/trainer/workout-plans",
  TRAINER_TASKS: "/trainer/workout-tasks",
  TRAINER_ATTENDANCE: "/trainer/attendance",

  MEMBER_DASHBOARD: "/member/dashboard",
  MEMBER_TASKS: "/member/my-tasks",

  PROFILE: "/profile",
  NOT_FOUND: "*",
  UNAUTHORIZED: "/unauthorized",
};

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "var(--color-warning)",
  },
  in_progress: {
    label: "In Progress",
    color: "var(--color-info)",
  },
  completed: {
    label: "Completed",
    color: "var(--color-success)",
  },
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const PAGE_SIZE = 10;

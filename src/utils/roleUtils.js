import { ROLES, ROUTES } from "@/utils/constants";

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case ROLES.MANAGER:
      return ROUTES.MANAGER_DASHBOARD;
    case ROLES.TRAINER:
      return ROUTES.TRAINER_DASHBOARD;
    case ROLES.MEMBER:
      return ROUTES.MEMBER_DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
};

export const hasPermission = (userRole, allowedRoles = []) => {
  return allowedRoles.includes(userRole);
};

export const getNavLinks = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return [
        { label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD, icon: "grid" },
        { label: "Branches", path: ROUTES.ADMIN_BRANCHES, icon: "building" },
        { label: "Managers", path: ROUTES.ADMIN_USERS, icon: "users" },
      ];

    case ROLES.MANAGER:
      return [
        { label: "Dashboard", path: ROUTES.MANAGER_DASHBOARD, icon: "grid" },
        { label: "Users", path: ROUTES.MANAGER_USERS, icon: "users" },
        {
          label: "Workout Plans",
          path: ROUTES.MANAGER_PLANS,
          icon: "clipboard",
        },
        {
          label: "Attendance",
          path: ROUTES.MANAGER_ATTENDANCE,
          icon: "calendar",
        },
      ];

    case ROLES.TRAINER:
      return [
        { label: "Dashboard", path: ROUTES.TRAINER_DASHBOARD, icon: "grid" },
        { label: "My Members", path: ROUTES.TRAINER_USERS, icon: "users" },
        {
          label: "Workout Plans",
          path: ROUTES.TRAINER_PLANS,
          icon: "clipboard",
        },
        { label: "Tasks", path: ROUTES.TRAINER_TASKS, icon: "check-square" },
      ];

    case ROLES.MEMBER:
      return [
        { label: "Dashboard", path: ROUTES.MEMBER_DASHBOARD, icon: "grid" },
        { label: "My Tasks", path: ROUTES.MEMBER_TASKS, icon: "check-square" },
      ];

    default:
      return [];
  }
};

export const getRoleLabel = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "Super Admin";
    case ROLES.MANAGER:
      return "Gym Manager";
    case ROLES.TRAINER:
      return "Trainer";
    case ROLES.MEMBER:
      return "Member";
    default:
      return "Unknown";
  }
};

export const getRoleColor = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "var(--color-danger)";
    case ROLES.MANAGER:
      return "var(--color-info)";
    case ROLES.TRAINER:
      return "var(--color-warning)";
    case ROLES.MEMBER:
      return "var(--color-success)";
    default:
      return "var(--color-text-muted)";
  }
};

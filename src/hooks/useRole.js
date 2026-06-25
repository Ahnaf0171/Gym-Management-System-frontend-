import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/utils/constants";
import { getNavLinks, getRoleLabel, getRoleColor } from "@/utils/roleUtils";

const useRole = () => {
  const { user } = useAuth();

  const role = user?.role ?? null;

  return {
    role,
    isAdmin: role === ROLES.ADMIN,
    isManager: role === ROLES.MANAGER,
    isTrainer: role === ROLES.TRAINER,
    isMember: role === ROLES.MEMBER,
    navLinks: getNavLinks(role),
    roleLabel: getRoleLabel(role),
    roleColor: getRoleColor(role),
  };
};

export default useRole;

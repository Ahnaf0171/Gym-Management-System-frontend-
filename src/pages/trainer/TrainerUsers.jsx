import { UserTable } from "@/components/shared/UserTable";
import { ROLES } from "@/utils/constants";

export default function TrainerUsers() {
  return <UserTable tabs={[ROLES.MEMBER]} canCreate={false} />;
}

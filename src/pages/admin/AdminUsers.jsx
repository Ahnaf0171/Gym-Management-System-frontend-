import { useSearchParams } from "react-router-dom";
import { UserTable } from "@/components/shared/UserTable";
import { ROLES } from "@/utils/constants";

export default function AdminUsers() {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role");

  return (
    <UserTable
      tabs={[ROLES.MANAGER, ROLES.TRAINER, ROLES.MEMBER]}
      canCreate={true}
      createTabs={[ROLES.MANAGER]}
      defaultTab={roleFromUrl}
    />
  );
}
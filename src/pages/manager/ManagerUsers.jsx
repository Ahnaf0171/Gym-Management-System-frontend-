import { useSearchParams } from "react-router-dom";
import { UserTable } from "@/components/shared/UserTable";
import { ROLES } from "@/utils/constants";

export default function ManagerUsers() {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role");

  return (
    <UserTable
      tabs={[ROLES.TRAINER, ROLES.MEMBER]}
      canCreate={true}
      canEdit={true}
      defaultTab={roleFromUrl}
    />
  );
}

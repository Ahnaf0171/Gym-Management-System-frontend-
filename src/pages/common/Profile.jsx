import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleLabel } from "@/utils/roleUtils";
import useRole from "@/hooks/useRole";
import EditProfileModal from "@/components/shared/EditProfileModal";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/utils/constants";
import {
  Mail,
  Building2,
  Calendar,
  Shield,
  User,
  Cake,
  Phone,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { roleColor } = useRole();
  const [showEditModal, setShowEditModal] = useState(false);

  const infoItems = [
    {
      id: 1,
      icon: <User size={16} />,
      label: "Username",
      value: user?.username,
    },
    { id: 2, icon: <Mail size={16} />, label: "Email", value: user?.email },
    {
      id: 3,
      icon: <Shield size={16} />,
      label: "Role",
      value: getRoleLabel(user?.role),
      color: roleColor,
    },
    {
      id: 4,
      icon: <User size={16} />,
      label: "Gender",
      value: user?.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
        : "—",
    },
    { id: 5, icon: <Cake size={16} />, label: "Age", value: user?.age },
    {
      id: 6,
      icon: <Phone size={16} />,
      label: "Mobile",
      value: user?.mobile_number,
    },
    {
      id: 7,
      icon: <Building2 size={16} />,
      label: "Branch",
      value: user?.gym_branch_name ?? "All Branches",
    },
    {
      id: 8,
      icon: <Calendar size={16} />,
      label: "Joined",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="max-w-lg mx-auto py-2 px-4 flex flex-col gap-3">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Profile
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Your account information
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 flex items-center gap-4">
        {user?.profile_picture ? (
          <img
            src={`${API_BASE_URL}${user.profile_picture}`}
            alt={user?.username || "Profile"}
            className="w-14 h-14 rounded-full object-cover shrink-0 border border-[var(--color-border)]"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ backgroundColor: roleColor }}
          >
            {(user?.username || user?.email)?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-[var(--color-text-primary)] truncate">
            {user?.username || user?.email}
          </p>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full mt-1 inline-block"
            style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
          >
            {getRoleLabel(user?.role)}
          </span>
        </div>

        <Button
          onClick={() => setShowEditModal(true)}
          className="text-xs px-3 py-1.5 shrink-0"
        >
          Edit
        </Button>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] divide-y divide-[var(--color-border)]">
        {infoItems.map(({ id, icon, label, value, color }) => (
          <div key={id} className="flex items-center gap-3 px-6 py-4">
            <span style={{ color: color ?? "var(--color-primary)" }}>
              {icon}
            </span>
            <span className="text-xs md:text-sm text-[var(--color-text-secondary)] w-20 shrink-0">
              {label}
            </span>
            <span className="text-xs md:text-sm font-medium text-[var(--color-text-primary)]">
              {value ?? "—"}
            </span>
          </div>
        ))}
      </div>
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}

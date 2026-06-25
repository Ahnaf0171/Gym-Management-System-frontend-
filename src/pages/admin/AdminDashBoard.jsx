// pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats } from "@/components/shared/DashboardStats";
import { Building2, Users, UserCog, UserCheck } from "lucide-react";
import { ROUTES, ROLES } from "@/utils/constants";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setStats({
          total_branches: 0,
          total_managers: 0,
          total_trainers: 0,
          total_members: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      id: 1,
      label: "Total Branches",
      value: stats?.total_branches ?? 0,
      icon: <Building2 size={22} />,
      color: "var(--color-info)",
      to: ROUTES.ADMIN_BRANCHES,
    },
    {
      id: 2,
      label: "Total Managers",
      value: stats?.total_managers ?? 0,
      icon: <UserCog size={22} />,
      color: "var(--color-success)",
      to: `${ROUTES.ADMIN_USERS}?role=${ROLES.MANAGER}`,
    },
    {
      id: 3,
      label: "Total Trainers",
      value: stats?.total_trainers ?? 0,
      icon: <UserCheck size={22} />,
      color: "var(--color-warning)",
      to: `${ROUTES.ADMIN_USERS}?role=${ROLES.TRAINER}`,
    },
    {
      id: 4,
      label: "Total Members",
      value: stats?.total_members ?? 0,
      icon: <Users size={22} />,
      color: "var(--color-primary)",
      to: `${ROUTES.ADMIN_USERS}?role=${ROLES.MEMBER}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome, Admin
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {user?.email}
        </p>
      </div>
      <DashboardStats stats={statCards} loading={loading} />
    </div>
  );
}

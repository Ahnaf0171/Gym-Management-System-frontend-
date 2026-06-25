import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats } from "@/components/shared/DashboardStats";
import { Users, UserCheck, ClipboardList } from "lucide-react";
import { ROUTES, ROLES } from "@/utils/constants";

export default function ManagerDashboard() {
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
          total_trainers: 0,
          total_members: 0,
          total_workout_plans: 0,
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
      label: "Total Trainers",
      value: stats?.total_trainers ?? 0,
      icon: <UserCheck size={22} />,
      color: "var(--color-warning)",
      to: `${ROUTES.MANAGER_USERS}?role=${ROLES.TRAINER}`,
    },
    {
      id: 2,
      label: "Total Members",
      value: stats?.total_members ?? 0,
      icon: <Users size={22} />,
      color: "var(--color-success)",
      to: `${ROUTES.MANAGER_USERS}?role=${ROLES.MEMBER}`,
    },
    {
      id: 3,
      label: "Workout Plans",
      value: stats?.total_workout_plans ?? 0,
      icon: <ClipboardList size={22} />,
      color: "var(--color-info)",
      to: ROUTES.MANAGER_PLANS,
    },
  ];
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome, Manager
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {user?.email}
        </p>
      </div>
      <DashboardStats stats={statCards} loading={loading} />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats } from "@/components/shared/DashboardStats";
import {
  ClipboardList,
  CheckSquare,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";

export default function TrainerDashboard() {
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
          total_workout_plans: 0,
          pending_tasks: 0,
          in_progress_tasks: 0,
          completed_tasks: 0,
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
      label: "Workout Plans",
      value: stats?.total_workout_plans ?? 0,
      icon: <ClipboardList size={22} />,
      color: "var(--color-info)",
      to: "/trainer/workout-plans",
    },
    {
      id: 2,
      label: "Pending Tasks",
      value: stats?.pending_tasks ?? 0,
      icon: <Clock size={22} />,
      color: "var(--color-warning)",
      to: "/trainer/workout-tasks",
    },
    {
      id: 3,
      label: "In Progress",
      value: stats?.in_progress_tasks ?? 0,
      icon: <CheckSquare size={22} />,
      color: "var(--color-primary)",
      to: "/trainer/workout-tasks",
    },
    {
      id: 4,
      label: "Completed",
      value: stats?.completed_tasks ?? 0,
      icon: <CheckCircle size={22} />,
      color: "var(--color-success)",
      to: "/trainer/workout-tasks",
    },
    {
      id: 5,
      label: "Members",
      value: stats?.total_members ?? 0,
      icon: <Users size={22} />,
      color: "var(--color-secondary, var(--color-primary))",
      to: ROUTES.TRAINER_USERS,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome, Trainer
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {user?.email}
        </p>
      </div>
      <DashboardStats stats={statCards} loading={loading} />
    </div>
  );
}

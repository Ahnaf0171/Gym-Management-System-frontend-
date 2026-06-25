import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats } from "@/components/shared/DashboardStats";
import { checkIn, checkOut, getAttendance } from "@/services/attendanceService";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ClipboardList, Clock, CheckSquare, CheckCircle } from "lucide-react";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Stats ────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setStats({
          total_tasks: 0,
          pending_tasks: 0,
          in_progress_tasks: 0,
          completed_tasks: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ── Attendance ───────────────────────────────────
  useEffect(() => {
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const data = await getAttendance();
        const records = data.results ?? data;
        const today = new Date().toDateString();
        const todayRecords = records.filter(
          (r) =>
            new Date(r.check_in).toDateString() === today &&
            Number(r.member) === Number(user?.id),
        );
        setAttendanceList(todayRecords);
        setActiveAttendance(todayRecords.find((r) => !r.check_out) ?? null);
      } catch {
        setAttendanceList([]);
        setActiveAttendance(null);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [user?.id]);

  // ── Handlers ─────────────────────────────────────
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const data = await checkIn();
      setAttendanceList((prev) => [data, ...prev]);
      setActiveAttendance(data);
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] || "Check in failed";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const data = await checkOut(activeAttendance.id);
      setAttendanceList((prev) =>
        prev.map((r) => (r.id === activeAttendance.id ? data : r)),
      );
      setActiveAttendance(null);
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  // ── Stat cards ───────────────────────────────────
  const statCards = [
    {
      id: 1,
      label: "Total Tasks",
      value: stats?.total_tasks ?? 0,
      icon: <ClipboardList size={22} />,
      color: "var(--color-info)",
      to: "/member/my-tasks",
    },
    {
      id: 2,
      label: "Pending",
      value: stats?.pending_tasks ?? 0,
      icon: <Clock size={22} />,
      color: "var(--color-warning)",
      to: "/member/my-tasks",
    },
    {
      id: 3,
      label: "In Progress",
      value: stats?.in_progress_tasks ?? 0,
      icon: <CheckSquare size={22} />,
      color: "var(--color-primary)",
      to: "/member/my-tasks",
    },
    {
      id: 4,
      label: "Completed",
      value: stats?.completed_tasks ?? 0,
      icon: <CheckCircle size={22} />,
      color: "var(--color-success)",
      to: "/member/my-tasks",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome, {user?.email}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Your fitness overview
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={statCards} loading={statsLoading} />

      {/* Attendance */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Attendance Today
          </p>

          {attendanceLoading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleCheckIn}
                disabled={actionLoading || !!activeAttendance}
              >
                {actionLoading && !activeAttendance ? (
                  <Spinner className="w-4 h-4 mx-auto" />
                ) : (
                  "Check In"
                )}
              </Button>
              <button
                onClick={handleCheckOut}
                disabled={actionLoading || !activeAttendance}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-all duration-200 disabled:opacity-40"
              >
                {actionLoading && !!activeAttendance ? (
                  <Spinner className="w-4 h-4 mx-auto" />
                ) : (
                  "Check Out"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Records */}
        {attendanceLoading ? null : attendanceList.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)]">
            Not checked in today
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {attendanceList.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between text-xs px-4 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              >
                <span className="text-[var(--color-text-secondary)]">
                  Check In:{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {new Date(r.check_in).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
                <span className="text-[var(--color-text-secondary)]">
                  Check Out:{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {r.check_out
                      ? new Date(r.check_out).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

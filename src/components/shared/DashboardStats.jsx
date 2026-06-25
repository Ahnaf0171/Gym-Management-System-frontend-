// components/shared/DashboardStats.jsx
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";

export function DashboardStats({ stats = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ id, label, value, icon, color, to }) => (
        <div
          key={id}
          onClick={to ? () => navigate(to) : undefined}
          className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 flex items-center gap-4 ${
            to
              ? "cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow duration-200"
              : ""
          }`}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ color, backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)]">
              {label}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

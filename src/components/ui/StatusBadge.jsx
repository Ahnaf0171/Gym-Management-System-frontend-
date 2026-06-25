import { STATUS_CONFIG } from "@/utils/constants";

export function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium ${className}`}
      style={{
        color: config.color,
        backgroundColor: `${config.color}20`,
      }}
    >
      {config.label}
    </span>
  );
}

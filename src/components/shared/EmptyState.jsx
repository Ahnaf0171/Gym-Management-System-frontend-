export function EmptyState({ message = "No data found", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 gap-3 ${className}`}
    >
      <div className="text-4xl">🏋️</div>
      <p className="text-sm md:text-base text-[var(--color-text-muted)]">
        {message}
      </p>
    </div>
  );
}

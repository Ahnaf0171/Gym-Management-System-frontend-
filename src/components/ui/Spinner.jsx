export function Spinner({ className = "" }) {
  return (
    <div
      className={`w-6 h-6 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin ${className}`}
    />
  );
}

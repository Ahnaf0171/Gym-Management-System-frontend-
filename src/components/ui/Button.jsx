export function Button({ children, className = "", ...rest }) {
  return (
    <button
      className={`cursor-pointer bg-[var(--color-primary)] text-white font-semibold rounded-full text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5 hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

import { useEffect } from "react";

export function Modal({ isOpen, onClose, title, children, className = "" }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-xl bg-[var(--color-surface-1)] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="text-base md:text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200 text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

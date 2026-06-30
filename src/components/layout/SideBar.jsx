import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useRole from "@/hooks/useRole";
import { X } from "lucide-react";

export function Sidebar({ isOpen, onClose, className = "" }) {
  const { logout } = useAuth();
  const { navLinks, roleLabel, roleColor } = useRole();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-[60] h-screen w-60
          flex flex-col
          bg-[var(--color-surface-1)]
          border-r border-[var(--color-border)]
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${className}
        `}
      >
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <h1
            className="text-xl md:text-2xl font-bold tracking-wide"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-primary)",
            }}
          >
            GYM PRO
          </h1>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors duration-150 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <span
            className="text-xs md:text-sm font-medium px-3 py-1 rounded-full"
            style={{
              color: roleColor,
              backgroundColor: `${roleColor}20`,
            }}
          >
            {roleLabel}
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm md:text-base font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm md:text-base font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-danger)] transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useRole from "@/hooks/useRole";
import { Button } from "@/components/ui/Button";
import Logo from "@/assets/images/Logo.svg";
import { ROUTES, PUBLIC_NAV_LINKS, API_BASE_URL } from "@/utils/constants";

const desktopLinkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide uppercase px-3 py-2 cursor-pointer transition-colors duration-150
  ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"}`;

const mobileLinkClass = ({ isActive }) =>
  `block text-sm font-semibold tracking-wide uppercase px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer
  ${
    isActive
      ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
      : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
  }`;

const HamburgerButton = ({
  onClick,
  isOpen = false,
  ariaLabel,
  className = "",
}) => (
  <button
    className={`flex flex-col justify-center gap-1.5 w-9 h-9 p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors duration-150 cursor-pointer ${className}`}
    onClick={onClick}
    aria-label={ariaLabel}
    aria-expanded={isOpen}
  >
    <span
      className={`block h-0.5 w-full rounded-full bg-[var(--color-text-primary)] transition-transform duration-300 origin-center ${isOpen ? "translate-y-2 rotate-45" : ""}`}
    />
    <span
      className={`block h-0.5 w-full rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`}
    />
    <span
      className={`block h-0.5 w-full rounded-full bg-[var(--color-text-primary)] transition-transform duration-300 origin-center ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
    />
  </button>
);

export function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { roleLabel, roleColor } = useRole();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onResize = () => window.innerWidth >= 1024 && setMobileOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center h-[var(--navbar-height)] bg-[var(--color-surface-1)] border-b border-[var(--color-border)] transition-shadow duration-300 ${scrolled ? "shadow-[var(--shadow-md)]" : ""}`}
      >
        <div className="flex items-center w-full max-w-[var(--container-max)] mx-auto px-[var(--container-pad)]">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={Logo}
              alt="Gym Logo"
              className="h-10 w-10 object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            {PUBLIC_NAV_LINKS.map(({ id, path, label }) => (
              <NavLink key={id} to={path} className={desktopLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          {user ? (
            <div className="flex items-center gap-2">
              {/* Sidebar button — relative z-10 so it stays above the mobile dropdown overlay */}
              <button
                onClick={onMenuClick}
                className="md:hidden relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-150 cursor-pointer"
              >
                ☰ Sidebar
              </button>

              {/* Hamburger — mobile navbar dropdown toggle */}
              <HamburgerButton
                onClick={() => setMobileOpen((p) => !p)}
                isOpen={mobileOpen}
                ariaLabel={mobileOpen ? "Close menu" : "Open menu"}
                className="md:hidden relative z-10"
              />

              {/* Desktop: role badge */}
              <span
                className="hidden md:inline-flex text-xs md:text-sm font-medium px-3 py-1 rounded-full"
                style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
              >
                {roleLabel}
              </span>

              {/* Desktop: username */}
              <span className="hidden md:block text-xs md:text-sm text-[var(--color-text-secondary)] truncate max-w-[160px]">
                {user.username}
              </span>

              {/* Desktop: profile */}
              <Link
                to={ROUTES.PROFILE}
                className="hidden md:flex items-center gap-2 text-xs md:text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
              >
                {user.profile_picture ? (
                  <img
                    src={`${API_BASE_URL}${user.profile_picture}`}
                    alt={user.username || "Profile"}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-xs font-semibold text-[var(--color-text-primary)]">
                    {(user.username || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span>Profile</span>
              </Link>

              {/* Desktop: logout */}
              <Button
                onClick={logout}
                className="hidden md:block text-xs px-3 py-1.5"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <Link to={ROUTES.LOGIN}>
                  <Button>Log In</Button>
                </Link>
              </div>
              <div className="lg:hidden">
                <HamburgerButton
                  onClick={() => setMobileOpen((p) => !p)}
                  isOpen={mobileOpen}
                  ariaLabel={mobileOpen ? "Close menu" : "Open menu"}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile dropdown — z-30 so sidebar button (z-10 inside z-50 header) stays on top */}
      <div
        className={`lg:hidden fixed top-[var(--navbar-height)] left-0 right-0 bottom-0 z-30 bg-[var(--color-surface-1)] overflow-y-auto px-[var(--container-pad)] py-6 transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Nav links */}
        <nav className="flex flex-col gap-1 mb-6">
          {PUBLIC_NAV_LINKS.map(({ id, path, label }) => (
            <NavLink
              key={id}
              to={path}
              onClick={close}
              className={mobileLinkClass}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <>
            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-[var(--color-surface-2)]">
              <div className="w-9 h-9 rounded-full bg-[var(--color-surface-1)] flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)]">
                {(user.username || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {user.username}
                </p>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: roleColor,
                    backgroundColor: `${roleColor}20`,
                  }}
                >
                  {roleLabel}
                </span>
              </div>
            </div>

            <Link to={ROUTES.PROFILE} onClick={close}>
              <Button className="w-full mb-2">Profile</Button>
            </Link>
            <Button
              onClick={() => {
                logout();
                close();
              }}
              className="w-full"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link to={ROUTES.LOGIN} onClick={close}>
            <Button className="w-full">Log In</Button>
          </Link>
        )}
      </div>
    </>
  );
}

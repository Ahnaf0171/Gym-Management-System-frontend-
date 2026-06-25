import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { PUBLIC_NAV_LINKS } from "@/utils/constants";

const linkClass =
  "text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200";

const SOCIAL_LINKS = [
  { href: "#", label: "Facebook" },
  { href: "#", label: "Instagram" },
  { href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-1)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)] py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <h2
              className="text-xl font-bold"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              GYM PRO
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Your ultimate fitness destination.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Khilgaon, Dhaka
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} /> +880 1617533221
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={12} /> info@gympro.com
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-primary)]">
              Links
            </h3>
            {PUBLIC_NAV_LINKS.map(({ id, path, label }) => (
              <Link key={id} to={path} className={linkClass}>
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-primary)]">
              Follow Us
            </h3>
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a key={label} href={href} className={linkClass}>
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} GYM PRO. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="#" className={linkClass}>
              Privacy Policy
            </Link>
            <Link to="#" className={linkClass}>
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

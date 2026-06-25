import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath } from "@/utils/roleUtils";
import { Button } from "@/components/ui/Button";

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
      <h1
        className="text-8xl md:text-9xl font-bold"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-danger)",
        }}
      >
        403
      </h1>

      <p className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mt-4">
        Access Denied
      </p>

      <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-2 max-w-sm">
        You do not have permission to access this page.
      </p>

      <Link to={getDashboardPath(user?.role)} className="mt-8">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}

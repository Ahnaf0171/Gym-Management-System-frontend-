import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath } from "@/utils/roleUtils";
import { ROUTES } from "@/utils/constants";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const { user } = useAuth();

  const backPath = user ? getDashboardPath(user.role) : ROUTES.LOGIN;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
      <h1
        className="text-8xl md:text-9xl font-bold"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-primary)",
        }}
      >
        404
      </h1>

      <p className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mt-4">
        Page Not Found
      </p>

      <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-2 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link to={backPath} className="mt-8">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  );
}

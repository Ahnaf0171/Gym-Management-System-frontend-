import { useState, useEffect } from "react";
import { TrainerCard } from "@/components/ui/TrainerCard";
import { Spinner } from "@/components/ui/Spinner";
import { getPublicTrainers } from "@/services/userService";

export function CoachesSection() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicTrainers()
      .then((data) => {
        const mapped = data
          .filter((b) => b.trainers.length > 0)
          .map((b) => ({
            id: b.branch_id,
            name: b.branch_name,
            coaches: b.trainers.map((t) => ({
              id: t.id,
              name: t.full_name || t.email,
              role: "Trainer",
              image:
                t.profile_picture ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(t.full_name || t.email) +
                  "&background=3b82f6&color=fff&size=200",
            })),
          }));

        if (mapped.length > 0) setBranches(mapped);
      })
      .catch((err) => {
        console.log("Error:", err);
        setBranches([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)]">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Coaches
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-3 max-w-xl mx-auto">
            Meet our expert trainers across all branches. Each coach is
            dedicated to helping you reach your fitness goals.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            {branches.map((branch) => (
              <div key={branch.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                  <h3
                    className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {branch.name}
                  </h3>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {branch.coaches.map((coach) => (
                    <TrainerCard
                      key={coach.id}
                      image={coach.image}
                      name={coach.name}
                      role={coach.role}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";

const getPublicBranches = async () => {
  const response = await axiosInstance.get("/api/v1/branches/public/");
  return response.data;
};

export function VisitSection() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicBranches()
      .then((data) =>
        setBranches(Array.isArray(data) ? data : (data.results ?? [])),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)]">
        <div className="text-center mb-14">
          <span
            className="text-xs md:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-primary-light)",
            }}
          >
            Find Us
          </span>

          <h2
            className="text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] mt-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Visit Our Gym
          </h2>

          <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-4 max-w-xl mx-auto leading-relaxed">
            We have multiple branches across Dhaka. Find the one closest to you
            and come visit us today.
          </p>
        </div>

        {loading && (
          <p className="text-center text-[var(--color-text-secondary)]">
            Loading branches...
          </p>
        )}

        {!loading && branches.length === 0 && (
          <p className="text-center text-[var(--color-text-secondary)]">
            No branches found.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] overflow-hidden"
            >
              <div
                className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-3"
                style={{ backgroundColor: "var(--color-surface-2)" }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <h3
                  className="text-lg md:text-xl font-bold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {branch.name}
                </h3>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
                  Contact
                </h4>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                    {branch.location}
                  </span>
                </div>

                {branch.manager_phone && (
                  <div className="flex items-center gap-3">
                    <Phone
                      size={16}
                      className="shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                      {branch.manager_phone}
                    </span>
                  </div>
                )}

                {branch.manager_email && (
                  <div className="flex items-center gap-3">
                    <Mail
                      size={16}
                      className="shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                      {branch.manager_email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

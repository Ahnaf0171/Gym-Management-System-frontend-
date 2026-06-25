import { PlanCard } from "@/components/ui/PlanCard";
import plans from "@/config/plans";

export default function PlansSection() {
  return (
    <section className="w-full max-w-[var(--container-max)] mx-auto px-[var(--container-pad)] py-24">
      {/* Heading */}
      <div className="text-center mb-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Membership
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wide">
          Choose Your Plan
        </h2>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} {...plan} />
        ))}
      </div>
    </section>
  );
}

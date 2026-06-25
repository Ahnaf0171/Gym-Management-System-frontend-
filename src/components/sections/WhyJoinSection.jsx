import { Zap, Shield, Users, Clock, Trophy, HeartPulse } from "lucide-react";

const reasons = [
  {
    id: 1,
    icon: <Trophy size={28} />,
    title: "Expert Trainers",
    description:
      "Our certified trainers bring years of experience to design programs tailored specifically to your fitness goals.",
    color: "var(--color-warning)",
  },
  {
    id: 2,
    icon: <Zap size={28} />,
    title: "High Energy Environment",
    description:
      "Train in an atmosphere built for performance. Every session pushes you beyond your limits.",
    color: "var(--color-primary)",
  },
  {
    id: 3,
    icon: <Shield size={28} />,
    title: "Safe & Structured",
    description:
      "Every workout plan is carefully structured to ensure safety, progress, and injury prevention.",
    color: "var(--color-success)",
  },
  {
    id: 4,
    icon: <Clock size={28} />,
    title: "Flexible Timings",
    description:
      "Morning, afternoon, or evening — our branches are open when you need them, fitting your schedule.",
    color: "var(--color-info)",
  },
  {
    id: 5,
    icon: <Users size={28} />,
    title: "Community Support",
    description:
      "Join a thriving community of members who motivate and push each other to achieve more every day.",
    color: "var(--color-warning)",
  },
  {
    id: 6,
    icon: <HeartPulse size={28} />,
    title: "Track Your Progress",
    description:
      "Monitor every workout task, track your status, and celebrate every milestone you hit.",
    color: "var(--color-primary)",
  },
];

export function WhyJoinSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface-1)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-pad)]">
        {/* Section header */}
        <div className="text-center mb-14">
          <span
            className="text-xs md:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-primary-light)",
            }}
          >
            Why Choose Us
          </span>

          <h2
            className="text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] mt-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            More Than Just A Gym
          </h2>

          <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-4 max-w-xl mx-auto leading-relaxed">
            We are not just a place to work out. We are a system built to track,
            guide, and push you toward your best self.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ id, icon, title, description, color }) => (
            <div
              key={id}
              className="group flex flex-col gap-4 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  color,
                  backgroundColor: `${color}18`,
                }}
              >
                {icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base md:text-lg font-bold text-[var(--color-text-primary)]">
                  {title}
                </h3>
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="mt-auto h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500"
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

const stats = [
  { value: "200+", label: "Active Members" },
  { value: "20+", label: "Expert Trainers" },
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Programs Available" },
];

export default function AboutSection() {
  return (
    <section className="w-full max-w-[var(--container-max)] mx-auto px-[var(--container-pad)] py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div>
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            About Us
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wide leading-tight mb-6">
            We Build More Than Bodies
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-4">
            Founded with a passion for fitness and community, our gym is more
            than just a place to work out. We provide a space where dedication
            meets results, and every member is supported on their journey.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            With world-class equipment, expert trainers, and a welcoming
            environment, we are committed to helping you reach your goals —
            whether you're just starting out or pushing to the next level.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-500 text-blue-400 text-sm font-semibold uppercase tracking-widest rounded-md hover:bg-blue-500 hover:text-white transition-all duration-150"
          >
            Learn More
          </Link>
        </div>

        {/* Right — Stats */}
        <div className="grid grid-cols-2 gap-6">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-white/10 bg-white/5"
            >
              <span className="text-4xl font-bold text-blue-400 mb-2">
                {value}
              </span>
              <span className="text-sm text-gray-400 uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

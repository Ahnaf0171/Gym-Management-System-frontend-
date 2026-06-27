import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const badgeStyles = {
  save: "bg-green-500/10 text-green-400 border border-green-500/20",
  best: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  life: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

export function PlanCard({
  duration,
  price,
  per,
  subprice,
  badge,
  featured,
  features,
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-5 transition-all
      ${
        featured
          ? "border-2 border-blue-500 bg-white/5"
          : "border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      {badge && (
        <span
          className={`self-start text-[11px] font-medium px-3 py-1 rounded-md mb-3 ${badgeStyles[badge.type]}`}
        >
          {badge.label}
        </span>
      )}

      <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
        {duration}
      </p>

      <p className="text-3xl font-bold text-white leading-none">
        ৳{price.toLocaleString()}
        <span className="text-sm font-normal text-white/40 ml-1">{per}</span>
      </p>

      <p className="text-xs text-white/40 mt-1 mb-4">{subprice}</p>

      <hr className="border-white/10 mb-4" />

      <ul className="flex-1 space-y-2 mb-5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {f.included ? (
              <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
            )}
            <span className={f.included ? "text-white/70" : "text-white/25"}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/visit"
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all text-center block
  ${
    featured
      ? "bg-blue-500 hover:bg-blue-400 text-white"
      : "border border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
  }`}
      >
        Visit Us
      </Link>
    </div>
  );
}

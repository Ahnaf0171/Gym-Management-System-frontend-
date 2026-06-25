import { MapPin, Clock, Phone, Mail } from "lucide-react";

const branches = [
  {
    id: 1,
    name: "Khilgaon Branch",
    address: "Khilgaon, Dhaka-1219",
    phone: "+880 1617533221",
    email: "info@gympro.com",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.6!2d90.4258!3d23.7412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b2c4c4c4c5%3A0x0!2sKhilgaon%2C+Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000",
    hours: [
      { day: "Sat – Thu", time: "6:00 AM – 10:00 PM" },
      { day: "Friday", time: "8:00 AM – 8:00 PM" },
    ],
  },
];

export function VisitSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg)]">
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

        {/* Branches */}
        <div className="flex flex-col gap-12">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] overflow-hidden"
            >
              {/* Branch name header */}
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

              {/* Map + Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Google Map */}
                <div className="h-64 lg:h-auto min-h-64">
                  <iframe
                    src={branch.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "256px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${branch.name} location`}
                  />
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col gap-6">
                  {/* Contact info */}
                  <div className="flex flex-col gap-3">
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
                        {branch.address}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone
                        size={16}
                        className="shrink-0"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                        {branch.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail
                        size={16}
                        className="shrink-0"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                        {branch.email}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px w-full"
                    style={{ backgroundColor: "var(--color-border)" }}
                  />

                  {/* Opening hours */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide flex items-center gap-2">
                      <Clock
                        size={14}
                        style={{ color: "var(--color-primary)" }}
                      />
                      Opening Hours
                    </h4>

                    {branch.hours.map(({ day, time }) => (
                      <div
                        key={day}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                          {day}
                        </span>
                        <span
                          className="text-xs md:text-sm font-medium px-3 py-1 rounded-full"
                          style={{
                            color: "var(--color-success)",
                            backgroundColor: "var(--color-success)18",
                          }}
                        >
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Direction button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <MapPin size={14} />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <main className="relative w-full h-[500px] overflow-hidden">
      {/* Wrapper forces 16:9 and always covers the container */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "max(100%, calc(100vh * 16/9))",
          height: "max(100%, calc(100vw * 9/16))",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/oAPCPjnU1wA?autoplay=1&mute=1&loop=1&playlist=oAPCPjnU1wA&controls=0&rel=0&showinfo=0&modestbranding=1"
          className="w-full h-full pointer-events-none"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[var(--container-pad)]">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-widest mb-6 drop-shadow-lg">
          Push Your Limits
        </h1>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white text-base font-semibold uppercase tracking-widest rounded-md hover:bg-blue-700 transition-all duration-150 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}

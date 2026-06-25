export default function HeroVideo({ src }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

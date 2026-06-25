export function TrainerCard({ image, name, role, className = "", ...rest }) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl overflow-hidden shadow-md bg-white w-44 sm:w-48 ${className}`}
      {...rest}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-44 sm:h-48 object-cover"
      />
      <div className="p-3 text-center">
        <h3 className="text-sm sm:text-base font-bold !text-gray-900">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{role}</p>
      </div>
    </div>
  );
}

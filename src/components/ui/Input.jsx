export function Input({ label, id, className = "", ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm sm:text-base font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base border-2 border-gray-100 rounded-full outline-none focus:border-gray-400 transition-colors duration-150 ${className}`}
        {...rest}
      />
    </div>
  );
}

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
        className={`px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-xl outline-none focus:border-blue-600 transition-all duration-200 ${className}`}
        {...rest}
      />
    </div>
  );
}

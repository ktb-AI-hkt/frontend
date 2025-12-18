export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-[#4A90E2] text-white font-medium shadow-[0_2px_8px_rgba(74,144,226,0.25)] hover:bg-[#3A7BC8] hover:shadow-[0_4px_16px_rgba(74,144,226,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

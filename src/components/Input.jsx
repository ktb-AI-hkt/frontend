export default function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm
        placeholder:text-gray-400
        focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      {...props}
    />
  );
}

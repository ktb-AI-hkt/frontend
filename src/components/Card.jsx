export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.06)] transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

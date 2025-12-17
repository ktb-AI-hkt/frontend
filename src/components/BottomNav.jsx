import { NavLink, useLocation } from "react-router-dom";
import { CalendarDays, FileText, FolderOpen, LogOut } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      to: "/convert",
      label: "변환하기",
      icon: FileText,
    },
    {
      to: "/archive",
      label: "변환 기록",
      icon: FolderOpen,
    },
    {
      to: "/calendar",
      label: "캘린더",
      icon: CalendarDays,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
      <div className="mx-auto flex max-w-[420px] justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center justify-center py-3 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Icon className="mb-1 h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

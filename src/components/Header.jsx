import { Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
      <div className="mx-auto max-w-[420px] relative flex items-center">
        <img
          src="/icon.png"
          alt="쏙쏙 아이콘"
          className="h-8 w-8 mr-2 -translate-y-[4px]"
        />
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "FontA" }}>
          쏙쏙
        </h1>
        <Bell className="absolute right-0 h-6 w-6 text-gray-700" />
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      </div>
    </div>
  );
}

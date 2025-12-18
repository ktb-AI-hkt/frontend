import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    const timeout = setTimeout(() => {
      onFinish?.();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6">
      {/* Mascot */}
      <div className="relative mb-8 animate-pop">
        {/* Main body */}
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-blue-500">
          <div className="absolute top-10 left-8 h-3 w-3 rounded-full bg-white" />
          <div className="absolute top-10 right-8 h-3 w-3 rounded-full bg-white" />

          <div className="absolute bottom-12 left-2 h-4 w-4 rounded-full bg-blue-400 opacity-60" />
          <div className="absolute bottom-12 right-2 h-4 w-4 rounded-full bg-blue-400 opacity-60" />
        </div>

        <div className="absolute top-12 -left-6 h-8 w-8 rounded-full bg-blue-500" />
        <div className="absolute top-12 -right-6 h-8 w-8 rounded-full bg-blue-500" />
      </div>

      <h1
        className="mb-3 text-5xl font-bold text-blue-500"
        style={{ fontFamily: "FontA" }}
      >
        쏙쏙
      </h1>

      <p className="mb-16 text-lg text-gray-600">필요한 정보만 쏙쏙</p>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              dots > i ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

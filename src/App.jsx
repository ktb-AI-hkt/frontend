import { Outlet } from "react-router-dom";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <div className="min-h-screen bg-gray-50 select-none">
          <Outlet />
          <BottomNav />
        </div>
      )}
    </>
  );
}

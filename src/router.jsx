import { Routes, Route } from "react-router-dom";
import App from "./App";
import Convert from "./pages/ConvertPage";
import Archive from "./pages/ArchivePage";
import Calendar from "./pages/CalendarPage";

export default function Router() {
  return (
    <Routes>
      {/* 공통 레이아웃 */}
      <Route element={<App />}>
        <Route path="/" element={<Convert />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/calendar" element={<Calendar />} />
      </Route>
    </Routes>
  );
}

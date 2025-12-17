import { BrowserRouter, Routes } from "react-router-dom";
import ConvertPage from "./pages/ConvertPage.jsx";
import { Route } from "react-router";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConvertPage />} />
        <Route path="/convert" element={<ConvertPage />} />
      </Routes>
    </BrowserRouter>
  );
}

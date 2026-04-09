import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAvatar from "@/pages/CreateAvatar";
import VirtualSpace from "@/pages/VirtualSpace";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateAvatar />} />
        <Route path="/space" element={<VirtualSpace />} />
      </Routes>
    </Router>
  );
}

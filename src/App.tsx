import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAvatar from "@/pages/CreateAvatar";
import VirtualSpace from "@/pages/VirtualSpace";
import Awakening from "@/pages/Awakening";
import AwakeningStep2 from "@/pages/AwakeningStep2";
import AwakeningStep3 from "@/pages/AwakeningStep3";
import AwakeningStep4 from "@/pages/AwakeningStep4";
import AwakeningStep5 from "@/pages/AwakeningStep5";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateAvatar />} />
        <Route path="/space" element={<VirtualSpace />} />
        <Route path="/awakening" element={<Awakening />} />
        <Route path="/awakening-step2" element={<AwakeningStep2 />} />
        <Route path="/awakening-step3" element={<AwakeningStep3 />} />
        <Route path="/awakening-step4" element={<AwakeningStep4 />} />
        <Route path="/awakening-step5" element={<AwakeningStep5 />} />
      </Routes>
    </Router>
  );
}

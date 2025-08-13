import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Success from "./pages/Success";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

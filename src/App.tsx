import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Faucet } from "./pages/faucet";
import { Earn } from "./pages/earn";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/faucet" replace />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/faucet" element={<Faucet />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

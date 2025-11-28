import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Earn } from "./pages/earn";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Earn />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

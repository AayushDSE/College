import { BrowserRouter, Routes, Route } from "react-router-dom";
import Input from "./input";
import Display from "./display";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Input />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

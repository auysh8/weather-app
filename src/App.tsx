import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Detailed_forecast from "./pages/Detailed_forecast";
import './App.css'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/forecast/:city" element={<Detailed_forecast />} />
      </Routes>
    </div>
  );
};

export default App;

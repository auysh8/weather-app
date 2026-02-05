import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Detailed_forecast from "./pages/Detailed_forecast";
import { useState } from "react";
import "./App.css";
import Login_popup from "./components/Login_popup";
import Register_popup from "./components/Register_popup";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const [isLoginPopup, setIsLoginPopup] = useState(false);
  const [isResgisterPopup, setIsRegisterPopup] = useState(false);
  return (
    <div>
      <AnimatePresence>
      {isLoginPopup && (
        <div className="popup_backdrop" onClick={() => setIsLoginPopup(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Login_popup
              onSuccess={() => setIsLoginPopup(false)}
              isRegister={() => {
                setIsRegisterPopup(true);
                setIsLoginPopup(false);
              }}
            />
          </div>
        </div>
      )}
      {isResgisterPopup && (
        <div
          className="popup_backdrop"
          onClick={() => setIsRegisterPopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Register_popup
              isLogin={() => {
                setIsRegisterPopup(false);
                setIsLoginPopup(true);
              }}
            />
          </div>
        </div>
      )}
      </AnimatePresence>
      <Routes>
        <Route
          path="/"
          element={<Homepage onClick={() => setIsLoginPopup(true)} />}
        />
        <Route path="/forecast/:city" element={<Detailed_forecast />} />
      </Routes>
    </div>
  );
};

export default App;

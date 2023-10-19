import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Navbar from "./Components/Navbar";
import Earning from "./Components/Earning";
import { useState } from "react";
import CallBackPopUp from "./Components/CallBackPopUp";

function App() {
  const [popUp, setPopUp] = useState(false);
  function handlePopup() {
    setPopUp(true);
  }

  const closePopup = () => {
    setPopUp(false);
  };
  return (
    <>
      {popUp && <CallBackPopUp onClosePopup={closePopup}/>}
      <Navbar onPopUp={handlePopup} />
      <Routes>
        <Route path="/earning/:url" element={<Earning />} />
        <Route exact path="/" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default App;

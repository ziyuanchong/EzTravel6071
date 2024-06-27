import { Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import CalendarHandler from "./components/CalendarHandler";
import HomePage from "./components/HomePage";
import CreateItinerary from "./components/CreateItinerary";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/CalendarHandler" element={<CalendarHandler />} />
        <Route path="/CreateItinerary" element={<CreateItinerary/>} />
      </Routes>
    </>
  );
}

export default App;

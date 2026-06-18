import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";
import Login from "./pages/login";
import AboutUs from "./pages/AboutUs";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import PageTransition from "./components/PageTransition";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/chatbot" element={<PageTransition><ChatBot /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
      <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
      <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
    </Routes>
  );
}

export default App;
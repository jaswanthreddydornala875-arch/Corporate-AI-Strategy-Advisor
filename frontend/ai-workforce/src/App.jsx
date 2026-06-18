import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";
import Login from "./pages/login";
import AboutUs from "./pages/AboutUs";
import PageTransition from "./components/PageTransition";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageTransition>
            <Home />
          </PageTransition>
        }
      />
      <Route
        path="/chatbot"
        element={
          <PageTransition>
            <ChatBot />
          </PageTransition>
        }
      />
      <Route
        path="/login"
        element={
          <PageTransition>
            <Login />
          </PageTransition>
        }
      />
      <Route
        path="/about"
        element={
          <PageTransition>
            <AboutUs />
          </PageTransition>
        }
      />
    </Routes>
  );
}

export default App;
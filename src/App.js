/* eslint-disable */
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import EventEditor from "./components/EventEditor/EventEditor";
import PricingPage from "./components/pricing/PricingPage";
import ReviewsSection from "./components/reviews/ReviewsSection";
import LoginScreen from "./components/LoginScreen";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function App() {
  const [events, setEvents] = useState([]);

  const paypalEmail = "ton-email-paypal@exemple.com";

  // --- LOGIN GOOGLE ---
  async function handleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard"; // redirection simple
    } catch (err) {
      console.error("Erreur login Google :", err);
    }
  }

  // --- LOGIN INVITÉ / DEMO ---
  function handleGuestLogin() {
    window.location.href = "/dashboard";
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            <LoginScreen
              onLogin={handleLogin}
              onGuestLogin={handleGuestLogin}
            />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard events={events} setEvents={setEvents} />}
        />

        {/* ÉDITEUR */}
        <Route
          path="/editor/:eventId"
          element={<EventEditor events={events} setEvents={setEvents} />}
        />

        {/* PRICING PAGE */}
        <Route
          path="/pricing/:eventId"
          element={
            <PricingPage
              events={events}
              setEvents={setEvents}
              paypalEmail={paypalEmail}
            />
          }
        />

        {/* AVIS PUBLICS */}
        <Route path="/reviews" element={<ReviewsSection />} />

      </Routes>
    </BrowserRouter>
  );
}

/* eslint-disable */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import EventEditor from "./components/EventEditor/EventEditor";
import PricingPage from "./components/pricing/PricingPage";
import ReviewsSection from "./components/reviews/ReviewsSection";
import LoginScreen from "./components/LoginScreen";

export default function App({ events, setEvents, paypalEmail }) {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<LoginScreen />} />

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

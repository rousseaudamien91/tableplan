/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FloorPlan from "../FloorPlan";
import GuestForm from "../GuestForm";
import { Btn } from "../UI";
import { C } from "../../constants";

export default function EventEditor({ events, setEvents }) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = events.find(e => e.id === eventId);

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);

  if (!event) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Événement introuvable</h2>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ░░░ TOP BAR ░░░ */}
      <div
        style={{
          height: 60,
          background: "#18182a",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          🪑 {event.name}
        </div>

        <div style={{ flex: 1 }} />

        {/* BOUTON ACTIVER */}
        {event.status !== "active" && (
          <button
            onClick={() => navigate(`/pricing/${event.id}`)}
            style={{
              background: C.gold,
              color: "#000",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer"
            }}
          >
            ⚡ Activer mon événement
          </button>
        )}

        {/* BADGE SI ACTIF */}
        {event.status === "active" && (
          <div
            style={{
              padding: "6px 14px",
              background: "rgba(39,174,96,0.2)",
              color: "#27AE60",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13
            }}
          >
            ✔️ Événement actif
          </div>
        )}
      </div>

      {/* ░░░ CONTENU PRINCIPAL ░░░ */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* PLAN DE SALLE */}
        <div style={{ flex: 3, borderRight: "1px solid rgba(255,255,255,0.1)" }}>
          <FloorPlan
            event={event}
            events={events}
            setEvents={setEvents}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            selectedGuest={selectedGuest}
            setSelectedGuest={setSelectedGuest}
          />
        </div>

        {/* FORMULAIRE INVITÉ */}
        <div style={{ flex: 1 }}>
          <GuestForm
            event={event}
            events={events}
            setEvents={setEvents}
            selectedGuest={selectedGuest}
            setSelectedGuest={setSelectedGuest}
          />
        </div>
      </div>
    </div>
  );
}

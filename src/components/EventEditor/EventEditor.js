/* eslint-disable */
import { useState } from "react";
import { useI18n } from "../../i18n";
import { Btn } from "../UI";
import { FloorPlan, RoomShapeEditor } from "../FloorPlan";
import { C } from "../../constants";

export default function EventEditor({ ev, onUpdate }) {
  const { t } = useI18n();

  const [selectedTable, setSelectedTable] = useState(null);
  const [highlightAvailable, setHighlightAvailable] = useState(false);

  const updateTables = (tables) => {
    onUpdate({ ...ev, tables });
  };

  const updateRoomShape = (shape) => {
    onUpdate({ ...ev, roomShape: shape });
  };

  const handleDropGuestToTable = (guestId, tableId) => {
    const updatedGuests = ev.guests.map((g) =>
      g.id === guestId ? { ...g, tableId } : g
    );
    onUpdate({ ...ev, guests: updatedGuests });
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2 style={{ marginBottom: 20 }}>{t.eventSettings}</h2>

      <div
        style={{
          background: C.mid,
          padding: 20,
          borderRadius: 12,
          marginBottom: 30,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>{t.tabRoom}</h3>
        <RoomShapeEditor shape={ev.roomShape || []} onChange={updateRoomShape} />
      </div>

      <div
        style={{
          background: C.mid,
          padding: 20,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h3>{t.tabPlanDetail}</h3>

          <Btn
            small
            variant={highlightAvailable ? "primary" : "ghost"}
            onClick={() => setHighlightAvailable((v) => !v)}
          >
            {t.seeAvailable}
          </Btn>
        </div>

        <FloorPlan
          ev={ev}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          onUpdateTables={updateTables}
          highlightAvailable={highlightAvailable}
          onDropGuestToTable={handleDropGuestToTable}
        />
      </div>
    </div>
  );
}

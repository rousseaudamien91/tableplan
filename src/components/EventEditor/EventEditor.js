/* eslint-disable */
import { useState } from "react";

// i18n
import { useI18n } from "../../i18n";

// UI premium
import Btn from "../ui/Btn";

// FloorPlan
import { FloorPlan, RoomShapeEditor } from "../FloorPlan";

// constantes
import { C } from "../../constants";

// thème
import { useTheme } from "../../theme";

export default function EventEditor({ ev, onUpdate }) {
  const { t } = useI18n();
  const { theme } = useTheme();

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
    <div
      style={{
        padding: 24,
        color: theme.text,
        transition: theme.transition,
      }}
    >
      <h2 style={{ marginBottom: 20, fontWeight: 800 }}>
        {t.eventSettings}
      </h2>

      {/* ROOM SHAPE */}
      <div
        style={{
          background: theme.card,
          padding: 20,
          borderRadius: 14,
          marginBottom: 30,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
        }}
      >
        <h3 style={{ marginBottom: 12, fontWeight: 700 }}>
          {t.tabRoom}
        </h3>

        <RoomShapeEditor
          shape={ev.roomShape || []}
          onChange={updateRoomShape}
        />
      </div>

      {/* FLOOR PLAN */}
      <div
        style={{
          background: theme.card,
          padding: 20,
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 700 }}>{t.tabPlanDetail}</h3>

          <Btn
            size="sm"
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

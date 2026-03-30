import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function AddFurnitureModal({
  open,
  onClose,
  newFurniture,
  setNewFurniture,
  updateEv
}) {
  const reset = () =>
    setNewFurniture({
      label: "",
      icon: "🪑",
      color: "#8A7355",
      width: 80,
      height: 40
    });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      furniture: [
        ...(ev.furniture || []),
        { ...newFurniture, id: Date.now(), x: 200, y: 200 }
      ]
    }));
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Ajouter du mobilier"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="NOM *">
          <Input
            value={newFurniture.label}
            onChange={e =>
              setNewFurniture({ ...newFurniture, label: e.target.value })
            }
            placeholder="ex: Buffet, Piano, Podium, Bar, Scène…"
          />
        </Field>

        <Field label="ICÔNE">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              "🪑",
              "🛋",
              "🎹",
              "🎤",
              "🍽",
              "🍹",
              "🎰",
              "📺",
              "🖼",
              "🌿",
              "🕯",
              "🎊",
              "🎭",
              "🔲"
            ].map(ic => (
              <button
                key={ic}
                onClick={() => setNewFurniture({ ...newFurniture, icon: ic })}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  fontSize: 20,
                  background:
                    newFurniture.icon === ic ? C.gold + "33" : C.mid,
                  border: `2px solid ${
                    newFurniture.icon === ic ? C.gold : C.border
                  }`,
                  cursor: "pointer"
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </Field>

        <div style={{ display: "flex", gap: 12 }}>
          <Field label="LARGEUR (cm)">
            <Input
              type="number"
              value={newFurniture.width}
              onChange={e =>
                setNewFurniture({
                  ...newFurniture,
                  width: parseInt(e.target.value) || 80
                })
              }
              placeholder="80"
            />
          </Field>

          <Field label="HAUTEUR (cm)">
            <Input
              type="number"
              value={newFurniture.height}
              onChange={e =>
                setNewFurniture({
                  ...newFurniture,
                  height: parseInt(e.target.value) || 40
                })
              }
              placeholder="40"
            />
          </Field>
        </div>

        <Field label="COULEUR">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "#8A7355",
              "#C9973A",
              "#E84A6A",
              "#4CAF50",
              "#2196F3",
              "#9C27B0",
              "#FF9800",
              "#8B7EC8"
            ].map(col => (
              <button
                key={col}
                onClick={() => setNewFurniture({ ...newFurniture, color: col })}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: col,
                  border: `3px solid ${
                    newFurniture.color === col ? "#fff" : "transparent"
                  }`,
                  cursor: "pointer",
                  padding: 0
                }}
              />
            ))}
          </div>
        </Field>

        <Btn
          disabled={!newFurniture.label.trim()}
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          Ajouter le mobilier
        </Btn>
      </div>
    </Modal>
  );
}

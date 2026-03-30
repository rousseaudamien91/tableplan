import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function ConstraintModal({
  open,
  onClose,
  newConstraint,
  setNewConstraint,
  updateEv
}) {
  const reset = () =>
    setNewConstraint({
      label: "",
      icon: "⚠️",
      color: "#E84A6A",
      notes: ""
    });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      constraints: [...(ev.constraints || []), { ...newConstraint, id: Date.now() }]
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
      title="Ajouter une contrainte"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <Field label="TITRE *">
          <Input
            value={newConstraint.label}
            onChange={e =>
              setNewConstraint({ ...newConstraint, label: e.target.value })
            }
            placeholder="ex: Allergie aux arachides, Mobilité réduite…"
          />
        </Field>

        <Field label="ICÔNE">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["⚠️","🚫","♿","🧒","🥜","🍤","🐟","🌾","🍷","🔥","💊","🩺"].map(ic => (
              <button
                key={ic}
                onClick={() =>
                  setNewConstraint({ ...newConstraint, icon: ic })
                }
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  fontSize: 20,
                  background:
                    newConstraint.icon === ic ? C.gold + "33" : C.mid,
                  border: `2px solid ${
                    newConstraint.icon === ic ? C.gold : C.border
                  }`,
                  cursor: "pointer"
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </Field>

        <Field label="COULEUR">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "#E84A6A",
              "#C9973A",
              "#4CAF50",
              "#2196F3",
              "#9C27B0",
              "#FF9800",
              "#8B7EC8"
            ].map(col => (
              <button
                key={col}
                onClick={() =>
                  setNewConstraint({ ...newConstraint, color: col })
                }
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: col,
                  border: `3px solid ${
                    newConstraint.color === col ? "#fff" : "transparent"
                  }`,
                  cursor: "pointer",
                  padding: 0
                }}
              />
            ))}
          </div>
        </Field>

        <Field label="NOTES (optionnel)">
          <Input
            value={newConstraint.notes}
            onChange={e =>
              setNewConstraint({ ...newConstraint, notes: e.target.value })
            }
            placeholder="Détails supplémentaires…"
          />
        </Field>

        <Btn
          disabled={!newConstraint.label.trim()}
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          Ajouter la contrainte
        </Btn>

      </div>
    </Modal>
  );
}

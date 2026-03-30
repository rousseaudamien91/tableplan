import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function AddProgramItemModal({
  open,
  onClose,
  newProgramItem,
  setNewProgramItem,
  updateEv
}) {
  const reset = () =>
    setNewProgramItem({
      label: "",
      time: "",
      icon: "⏱",
      notes: ""
    });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      program: [...(ev.program || []), { ...newProgramItem, id: Date.now() }]
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
      title="Ajouter un élément au programme"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <Field label="INTITULÉ *">
          <Input
            value={newProgramItem.label}
            onChange={e =>
              setNewProgramItem({ ...newProgramItem, label: e.target.value })
            }
            placeholder="ex: Cérémonie, Cocktail, Ouverture du bal…"
          />
        </Field>

        <Field label="HEURE (optionnel)">
          <Input
            type="time"
            value={newProgramItem.time}
            onChange={e =>
              setNewProgramItem({ ...newProgramItem, time: e.target.value })
            }
          />
        </Field>

        <Field label="ICÔNE">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["⏱","💍","🥂","🍽","🎤","🎶","💃","🕺","🎂","📸","🎁","🎉","🕯","🌙"].map(ic => (
              <button
                key={ic}
                onClick={() =>
                  setNewProgramItem({ ...newProgramItem, icon: ic })
                }
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  fontSize: 20,
                  background:
                    newProgramItem.icon === ic ? C.gold + "33" : C.mid,
                  border: `2px solid ${
                    newProgramItem.icon === ic ? C.gold : C.border
                  }`,
                  cursor: "pointer"
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </Field>

        <Field label="NOTES">
          <Input
            value={newProgramItem.notes}
            onChange={e =>
              setNewProgramItem({ ...newProgramItem, notes: e.target.value })
            }
            placeholder="Détails, intervenants, durée…"
          />
        </Field>

        <Btn
          disabled={!newProgramItem.label.trim()}
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          Ajouter au programme
        </Btn>

      </div>
    </Modal>
  );
}

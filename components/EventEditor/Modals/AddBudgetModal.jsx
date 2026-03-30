import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { BUDGET_CATEGORIES, C } from "../../../constants";

export default function AddBudgetModal({
  open,
  onClose,
  newBudgetLine,
  setNewBudgetLine,
  updateEv
}) {
  const reset = () =>
    setNewBudgetLine({
      category: "salle",
      label: "",
      estimated: 0,
      actual: 0,
      paid: false,
      notes: ""
    });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      budget: [...(ev.budget || []), { ...newBudgetLine }]
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
      title="Ajouter un poste budgétaire"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        
        <Field label="CATÉGORIE">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {BUDGET_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() =>
                  setNewBudgetLine({ ...newBudgetLine, category: cat.id })
                }
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `2px solid ${
                    newBudgetLine.category === cat.id ? C.gold : C.border
                  }`,
                  background:
                    newBudgetLine.category === cat.id
                      ? C.gold + "22"
                      : C.mid,
                  cursor: "pointer",
                  color:
                    newBudgetLine.category === cat.id
                      ? C.gold
                      : C.muted,
                  fontSize: 12,
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="LIBELLÉ (optionnel)">
          <Input
            value={newBudgetLine.label}
            onChange={e =>
              setNewBudgetLine({ ...newBudgetLine, label: e.target.value })
            }
            placeholder="ex: Château de Vincennes, DJ Martin…"
          />
        </Field>

        <div style={{ display: "flex", gap: 12 }}>
          <Field label="MONTANT ESTIMÉ (€)">
            <Input
              type="number"
              value={newBudgetLine.estimated}
              onChange={e =>
                setNewBudgetLine({
                  ...newBudgetLine,
                  estimated: parseFloat(e.target.value) || 0
                })
              }
              placeholder="0"
            />
          </Field>

          <Field label="MONTANT RÉEL (€)">
            <Input
              type="number"
              value={newBudgetLine.actual}
              onChange={e =>
                setNewBudgetLine({
                  ...newBudgetLine,
                  actual: parseFloat(e.target.value) || 0
                })
              }
              placeholder="0"
            />
          </Field>
        </div>

        <Field label="NOTES">
          <Input
            value={newBudgetLine.notes}
            onChange={e =>
              setNewBudgetLine({ ...newBudgetLine, notes: e.target.value })
            }
            placeholder="Acompte versé, devis reçu…"
          />
        </Field>

        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            cursor: "pointer"
          }}
        >
          <input
            type="checkbox"
            checked={newBudgetLine.paid}
            onChange={e =>
              setNewBudgetLine({
                ...newBudgetLine,
                paid: e.target.checked
              })
            }
            style={{ width: 16, height: 16 }}
          />
          Déjà payé ✅
        </label>

        <Btn onClick={handleAdd} style={{ marginTop: 4 }}>
          Ajouter ce poste
        </Btn>
      </div>
    </Modal>
  );
}

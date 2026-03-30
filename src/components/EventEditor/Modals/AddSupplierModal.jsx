import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function AddSupplierModal({
  open,
  onClose,
  newSupplier,
  setNewSupplier,
  updateEv
}) {
  const reset = () =>
    setNewSupplier({
      label: "",
      category: "",
      contact: "",
      phone: "",
      email: "",
      notes: "",
      paid: false,
      amount: 0
    });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      suppliers: [...(ev.suppliers || []), { ...newSupplier, id: Date.now() }]
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
      title="Ajouter un prestataire"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <Field label="NOM DU PRESTATAIRE *">
          <Input
            value={newSupplier.label}
            onChange={e =>
              setNewSupplier({ ...newSupplier, label: e.target.value })
            }
            placeholder="ex: Traiteur Martin, DJ Pulse, Fleuriste Rose…"
          />
        </Field>

        <Field label="CATÉGORIE">
          <Input
            value={newSupplier.category}
            onChange={e =>
              setNewSupplier({ ...newSupplier, category: e.target.value })
            }
            placeholder="ex: Traiteur, DJ, Photographe…"
          />
        </Field>

        <Field label="CONTACT">
          <Input
            value={newSupplier.contact}
            onChange={e =>
              setNewSupplier({ ...newSupplier, contact: e.target.value })
            }
            placeholder="Nom du contact"
          />
        </Field>

        <Field label="TÉLÉPHONE">
          <Input
            value={newSupplier.phone}
            onChange={e =>
              setNewSupplier({ ...newSupplier, phone: e.target.value })
            }
            placeholder="06 00 00 00 00"
          />
        </Field>

        <Field label="EMAIL">
          <Input
            type="email"
            value={newSupplier.email}
            onChange={e =>
              setNewSupplier({ ...newSupplier, email: e.target.value })
            }
            placeholder="contact@prestataire.fr"
          />
        </Field>

        <Field label="MONTANT (€)">
          <Input
            type="number"
            value={newSupplier.amount}
            onChange={e =>
              setNewSupplier({
                ...newSupplier,
                amount: parseFloat(e.target.value) || 0
              })
            }
            placeholder="0"
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
            checked={newSupplier.paid}
            onChange={e =>
              setNewSupplier({ ...newSupplier, paid: e.target.checked })
            }
            style={{ width: 16, height: 16 }}
          />
          Déjà payé
        </label>

        <Field label="NOTES">
          <Input
            value={newSupplier.notes}
            onChange={e =>
              setNewSupplier({ ...newSupplier, notes: e.target.value })
            }
            placeholder="Détails, échéances, conditions…"
          />
        </Field>

        <Btn
          disabled={!newSupplier.label.trim()}
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          Ajouter le prestataire
        </Btn>

      </div>
    </Modal>
  );
}

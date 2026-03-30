import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function AddTaskModal({
  open,
  onClose,
  newTask,
  setNewTask,
  updateEv
}) {
  const reset = () =>
    setNewTask({
      label: "",
      date: "",
      done: false,
      notes: ""
    });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      tasks: [...(ev.tasks || []), { ...newTask, id: Date.now() }]
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
      title="Nouvelle tâche"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <Field label="TÂCHE *">
          <Input
            value={newTask.label}
            onChange={e =>
              setNewTask({ ...newTask, label: e.target.value })
            }
            placeholder="ex: Appeler le traiteur, envoyer les invitations…"
          />
        </Field>

        <Field label="DATE (optionnel)">
          <Input
            type="date"
            value={newTask.date}
            onChange={e =>
              setNewTask({ ...newTask, date: e.target.value })
            }
          />
        </Field>

        <Field label="NOTES">
          <Input
            value={newTask.notes}
            onChange={e =>
              setNewTask({ ...newTask, notes: e.target.value })
            }
            placeholder="Détails, contacts, échéances…"
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
            checked={newTask.done}
            onChange={e =>
              setNewTask({ ...newTask, done: e.target.checked })
            }
            style={{ width: 16, height: 16 }}
          />
          Marquer comme déjà fait
        </label>

        <Btn
          disabled={!newTask.label.trim()}
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          Ajouter la tâche
        </Btn>

      </div>
    </Modal>
  );
}

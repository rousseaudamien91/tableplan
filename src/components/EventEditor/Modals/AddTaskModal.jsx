import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";
import { C } from "../../../constants";

export default function AddTaskModal({ open, onClose, newTask, setNewTask, updateEv }) {
  const reset = () => setNewTask({ label: "", date: "", done: false, notes: "" });
  const handleAdd = () => {
    updateEv(ev => ({ ...ev, tasks: [...(ev.tasks || []), { ...newTask, id: Date.now() }] }));
    reset(); onClose();
  };
  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Nouvelle tâche">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="TÂCHE *">
          <Input value={newTask.label} onChange={e => setNewTask({ ...newTask, label: e.target.value })} placeholder="ex: Appeler le traiteur…" />
        </Field>
        <Field label="DATE (optionnel)">
          <Input type="date" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} />
        </Field>
        <Field label="NOTES">
          <Input value={newTask.notes} onChange={e => setNewTask({ ...newTask, notes: e.target.value })} placeholder="Détails…" />
        </Field>
        <Btn disabled={!newTask.label.trim()} onClick={handleAdd} style={{ marginTop: 4 }}>Ajouter la tâche</Btn>
      </div>
    </Modal>
  );
}

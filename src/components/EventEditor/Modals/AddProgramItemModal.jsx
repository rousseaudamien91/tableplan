import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";

export default function AddProgramItemModal({ open, onClose, newItem, setNewItem, addItem, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter un élément">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label="TIME"><Input value={newItem.time||""} onChange={e=>setNewItem({...newItem,time:e.target.value})} placeholder="time" /></Field>
        <Field label="LABEL"><Input value={newItem.label||""} onChange={e=>setNewItem({...newItem,label:e.target.value})} placeholder="label" /></Field>
        <Field label="NOTES"><Input value={newItem.notes||""} onChange={e=>setNewItem({...newItem,notes:e.target.value})} placeholder="notes" /></Field>
        <Btn onClick={addItem} style={{marginTop:4}}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

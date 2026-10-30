import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";

export default function AddZoneModal({ open, onClose, newItem, setNewItem, addZone, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter une zone">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label="LABEL"><Input value={newItem.label||""} onChange={e=>setNewItem({...newItem,label:e.target.value})} placeholder="label" /></Field>
        <Field label="COLOR"><Input value={newItem.color||""} onChange={e=>setNewItem({...newItem,color:e.target.value})} placeholder="color" /></Field>
        <Btn onClick={addZone} style={{marginTop:4}}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

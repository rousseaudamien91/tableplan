import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";

export default function AddFurnitureModal({ open, onClose, newItem, setNewItem, addFurniture, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter un meuble">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label="LABEL"><Input value={newItem.label||""} onChange={e=>setNewItem({...newItem,label:e.target.value})} placeholder="label" /></Field>
        <Field label="QUANTITY"><Input value={newItem.quantity||""} onChange={e=>setNewItem({...newItem,quantity:e.target.value})} placeholder="quantity" /></Field>
        <Btn onClick={addFurniture} style={{marginTop:4}}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

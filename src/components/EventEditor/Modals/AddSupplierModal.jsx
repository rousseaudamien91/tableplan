import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";

export default function AddSupplierModal({ open, onClose, newItem, setNewItem, addSupplier, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter un prestataire">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label="NAME"><Input value={newItem.name||""} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="name" /></Field>
        <Field label="PHONE"><Input value={newItem.phone||""} onChange={e=>setNewItem({...newItem,phone:e.target.value})} placeholder="phone" /></Field>
        <Field label="EMAIL"><Input value={newItem.email||""} onChange={e=>setNewItem({...newItem,email:e.target.value})} placeholder="email" /></Field>
        <Btn onClick={addSupplier} style={{marginTop:4}}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

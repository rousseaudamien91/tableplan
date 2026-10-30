import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";
import { C, BUDGET_CATEGORIES } from "../../../constants";

export default function AddBudgetModal({ open, onClose, newBudgetLine, setNewBudgetLine, updateEv, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter une dépense">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label="CATÉGORIE">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {BUDGET_CATEGORIES.map(cat=>(
              <button key={cat.id} onClick={()=>setNewBudgetLine({...newBudgetLine,category:cat.id})} style={{ padding:"7px 10px", borderRadius:8, border:`2px solid ${newBudgetLine.category===cat.id?C.gold:C.border}`, background:newBudgetLine.category===cat.id?C.gold+"22":C.mid, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit", color:newBudgetLine.category===cat.id?C.gold:"rgba(255,255,255,0.45)", display:"flex", alignItems:"center", gap:6 }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="LIBELLÉ *">
          <Input value={newBudgetLine.label} onChange={e=>setNewBudgetLine({...newBudgetLine,label:e.target.value})} placeholder="ex: Traiteur Dupont" />
        </Field>
        <Field label="MONTANT (€) *">
          <Input type="number" value={newBudgetLine.amount} onChange={e=>setNewBudgetLine({...newBudgetLine,amount:e.target.value})} placeholder="0" />
        </Field>
        <Field label="NOTES">
          <Input value={newBudgetLine.notes} onChange={e=>setNewBudgetLine({...newBudgetLine,notes:e.target.value})} placeholder="Détails, conditions…" />
        </Field>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setNewBudgetLine({...newBudgetLine,paid:!newBudgetLine.paid})} style={{ width:22, height:22, borderRadius:6, border:`2px solid ${newBudgetLine.paid?C.green:C.border}`, background:newBudgetLine.paid?C.green:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {newBudgetLine.paid && <span style={{color:"#fff",fontSize:10}}>✓</span>}
          </button>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.65)" }}>Déjà payé</span>
        </div>
        <Btn onClick={updateEv} style={{marginTop:4}}>Ajouter la dépense</Btn>
      </div>
    </Modal>
  );
}

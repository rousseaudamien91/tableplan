import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";
import { C } from "../../../constants";

export default function ConstraintModal({ open, onClose, newConstraint, setNewConstraint, updateEv, ev, t }) {
  var guests = ev && ev.guests ? ev.guests : [];
  return (
    <Modal open={open} onClose={onClose} title={t&&t.constraints||"Contraintes de placement"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label="TYPE">
          <div style={{ display:"flex", gap:8 }}>
            {[["apart","🚫 Séparer"],["together","❤️ Ensemble"]].map(([v,l])=>(
              <button key={v} onClick={()=>setNewConstraint({...newConstraint,type:v})} style={{ flex:1, padding:"8px", borderRadius:8, border:`2px solid ${newConstraint.type===v?C.gold:C.border}`, background:newConstraint.type===v?C.gold+"22":C.mid, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit", color:newConstraint.type===v?C.gold:"rgba(255,255,255,0.45)" }}>
                {l}
              </button>
            ))}
          </div>
        </Field>
        <Field label="INVITÉ A">
          <select value={newConstraint.guestA} onChange={e=>setNewConstraint({...newConstraint,guestA:e.target.value})} style={{ width:"100%", padding:"8px 12px", background:"#13131e", border:`1px solid ${C.border}`, borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit" }}>
            <option value="">— Choisir —</option>
            {guests.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </Field>
        <Field label="INVITÉ B">
          <select value={newConstraint.guestB} onChange={e=>setNewConstraint({...newConstraint,guestB:e.target.value})} style={{ width:"100%", padding:"8px 12px", background:"#13131e", border:`1px solid ${C.border}`, borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit" }}>
            <option value="">— Choisir —</option>
            {guests.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </Field>
        <Field label="NOTE (optionnel)">
          <Input value={newConstraint.note} onChange={e=>setNewConstraint({...newConstraint,note:e.target.value})} placeholder="Raison de la contrainte…" />
        </Field>
        <Btn onClick={updateEv} disabled={!newConstraint.guestA||!newConstraint.guestB}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

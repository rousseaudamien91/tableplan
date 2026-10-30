import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";
import { C } from "../../../constants";

export default function AddTableModal({ open, onClose, newTable, setNewTable, nextTableNumber, addTable, t }) {
  return (
    <Modal open={open} onClose={onClose} title={t&&t.addTable||"Ajouter une table"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label={(t&&t.fieldNumber||t&&t.fieldNumber||"Numéro") + " (auto: "+nextTableNumber+")"}>
          <Input type="number" value={newTable.number} onChange={e=>setNewTable({...newTable,number:e.target.value})} placeholder={String(nextTableNumber)} />
        </Field>
        <Field label={t&&t.fieldCapacity||t&&t.fieldCapacity||"Capacité"}>
          <Input type="number" value={newTable.capacity} onChange={e=>setNewTable({...newTable,capacity:e.target.value})} />
        </Field>
        <Field label={t&&t.fieldShape||t&&t.fieldShape||"Forme"}>
          <div style={{ display:"flex", gap:8 }}>
            {[["round","⬤ Ronde"],["rect","▬ Rectangle"]].map(([v,l])=>(
              <button key={v} onClick={()=>setNewTable({...newTable,shape:v})} style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${newTable.shape===v?C.gold:C.border}`, background:newTable.shape===v?C.gold+"22":C.mid, cursor:"pointer", color:newTable.shape===v?C.gold:C.muted, fontFamily:"inherit", fontSize:13, fontWeight:700 }}>
                {l}
              </button>
            ))}
          </div>
        </Field>
        <Field label={(t&&t.fieldLabel||t&&t.fieldLabel||"Label")+" (optionnel)"}>
          <Input value={newTable.label} onChange={e=>setNewTable({...newTable,label:e.target.value})} placeholder="ex: Famille, Amis…" />
        </Field>
        <Field label={(t&&t.fieldColor||t&&t.fieldColor||"Couleur")+" (optionnel)"}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#E8845A"].map(col=>(
              <button key={col} onClick={()=>setNewTable({...newTable,color:col})} style={{ width:28, height:28, borderRadius:"50%", background:col, border:`3px solid ${newTable.color===col?"#fff":"transparent"}`, cursor:"pointer", padding:0 }} />
            ))}
            <button onClick={()=>setNewTable({...newTable,color:undefined})} style={{ width:28, height:28, borderRadius:"50%", background:"none", border:`2px solid ${C.border}`, cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:10 }}>✕</button>
          </div>
        </Field>
        <Btn onClick={addTable} style={{marginTop:4}}>{t&&t.addTable||t&&t.addTable||"Créer la table"}</Btn>
      </div>
    </Modal>
  );
}

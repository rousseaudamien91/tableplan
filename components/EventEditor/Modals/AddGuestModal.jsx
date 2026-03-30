import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { DIET_OPTIONS, C } from "../../../constants";

export default function AddGuestModal({ open, onClose, newGuest, setNewGuest, addGuest, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Ajouter un invité">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        
        <Field label={t.fieldName}>
          <Input
            value={newGuest.name}
            onChange={e=>setNewGuest({...newGuest,name:e.target.value})}
            placeholder="Prénom Nom"
          />
        </Field>

        <Field label={t.fieldEmail}>
          <Input
            type="email"
            value={newGuest.email}
            onChange={e=>setNewGuest({...newGuest,email:e.target.value})}
            placeholder="email@example.fr"
          />
        </Field>

        <Field label="RÉGIME ALIMENTAIRE">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {DIET_OPTIONS.map(ditem=>(
              <button
                key={ditem.id}
                onClick={()=>setNewGuest({...newGuest,diet:ditem.id})}
                style={{
                  padding:"7px 10px",
                  borderRadius:8,
                  border:`2px solid ${newGuest.diet===ditem.id?ditem.color:C.border}`,
                  background:newGuest.diet===ditem.id?ditem.color+"22":C.mid,
                  cursor:"pointer",
                  fontSize:12,
                  fontWeight:700,
                  fontFamily:"inherit",
                  color:newGuest.diet===ditem.id?ditem.color:"rgba(255,255,255,0.45)",
                  display:"flex",
                  alignItems:"center",
                  gap:6,
                }}
              >
                {ditem.icon} {ditem.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="RÔLE / FONCTION">
          <select
            value={newGuest.role||""}
            onChange={e=>setNewGuest({...newGuest,role:e.target.value})}
            style={{
              width:"100%",
              padding:"8px 12px",
              background:"#13131e",
              border:"1px solid "+C.border,
              borderRadius:8,
              color:"#ffffff",
              fontSize:13,
              fontFamily:"inherit"
            }}
          >
            <option value="">— Aucun rôle spécial —</option>
            <option value="marie1">💍 Marié(e) 1</option>
            <option value="marie2">💍 Marié(e) 2</option>
            <option value="temoin">🎖 Témoin</option>
            <option value="famille_proche">👨‍👩‍👧 Famille proche</option>
            <option value="ami_proche">⭐ Ami proche</option>
            <option value="enfant">🧒 Enfant</option>
            <option value="vip">🌟 VIP</option>
            <option value="prestataire">🔧 Prestataire</option>
          </select>
        </Field>

        <Field label="NOTES / ALLERGIES">
          <Input
            value={newGuest.notes}
            onChange={e=>setNewGuest({...newGuest,notes:e.target.value})}
            placeholder="Allergies, mobilité réduite…"
          />
        </Field>

        <Btn onClick={addGuest} style={{marginTop:4}}>
          Ajouter l'invité
        </Btn>

      </div>
    </Modal>
  );
}

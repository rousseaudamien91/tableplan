/* eslint-disable */
import { useState } from "react";
import Field  from "../../ui/Field";
import Input  from "../../ui/Input";
import Btn    from "../../ui/Btn";
import { DIET_OPTIONS, C } from "../../../constants";
import { getRolesForType } from "../roles";

export default function GuestEditModal({ guest, onClose, onSave, onDelete, tables, evType }) {
  var [form, setForm] = useState({
    name:  guest.name  || "",
    email: guest.email || "",
    phone: guest.phone || "",
    role:  guest.role  || "",
    diet:  guest.diet  || "standard",
    rsvp:  guest.rsvp  || "pending",
    notes: guest.notes || "",
  });

  var roles = getRolesForType(evType || "autre");
  var table = tables && tables.find(function(t){ return t.id === guest.tableId; });

  function save() {
    if (!form.name.trim()) return;
    onSave({ ...guest, ...form });
    onClose();
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"Georgia,serif" }}>
      <div style={{ width:"100%", maxWidth:500, maxHeight:"90vh", overflow:"auto", background:"#18182a", borderRadius:20, border:"1px solid rgba(201,151,58,0.2)", padding:"24px 24px 20px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:0, fontSize:17, fontWeight:800, color:"#fff" }}>✏️ Modifier l'invité</h2>
            {table && <div style={{ fontSize:11, color:"#F0C97A", marginTop:3 }}>📍 Table {table.number}{table.label?" — "+table.label:""}</div>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Nom */}
          <Field label="NOM *">
            <Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Prénom Nom" />
          </Field>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {/* Email */}
            <Field label="EMAIL">
              <Input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.fr" />
            </Field>
            {/* Téléphone */}
            <Field label="TÉLÉPHONE">
              <Input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+33 6…" />
            </Field>
          </div>

          {/* RSVP */}
          <Field label="STATUT RSVP">
            <div style={{ display:"flex", gap:8 }}>
              {[
                { id:"confirmed", label:"✅ Confirmé",   color:C.green },
                { id:"pending",   label:"⏳ En attente", color:"rgba(255,255,255,0.45)" },
                { id:"declined",  label:"❌ Décliné",    color:C.red },
              ].map(function(s) {
                var active = form.rsvp === s.id;
                return (
                  <button key={s.id} onClick={()=>setForm({...form,rsvp:s.id})} style={{
                    flex:1, padding:"7px 6px", borderRadius:8, fontSize:11, fontFamily:"inherit",
                    border:"2px solid "+(active?s.color:"rgba(255,255,255,0.08)"),
                    background:active?s.color+"22":"rgba(255,255,255,0.03)",
                    color:active?s.color:"rgba(255,255,255,0.35)", cursor:"pointer", fontWeight:active?700:400,
                  }}>{s.label}</button>
                );
              })}
            </div>
          </Field>

          {/* Rôle */}
          <Field label="RÔLE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
              <button onClick={()=>setForm({...form,role:""})} style={{
                gridColumn:"1/-1", padding:"7px", borderRadius:8, fontSize:11, fontFamily:"inherit",
                border:"1px solid "+(!form.role?"rgba(255,255,255,0.3)":C.border),
                background:!form.role?"rgba(255,255,255,0.06)":C.mid,
                color:!form.role?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)", cursor:"pointer",
              }}>— Aucun rôle</button>
              {roles.map(function(r) {
                var active = form.role === r.id;
                return (
                  <button key={r.id} onClick={()=>setForm({...form,role:r.id})} style={{
                    padding:"7px 8px", borderRadius:8, fontSize:11, fontFamily:"inherit",
                    border:"2px solid "+(active?r.color:C.border),
                    background:active?r.color+"22":C.mid,
                    color:active?r.color:"rgba(255,255,255,0.4)",
                    cursor:"pointer", fontWeight:active?700:400,
                    display:"flex", alignItems:"center", gap:5,
                  }}>{r.icon} {r.label}</button>
                );
              })}
            </div>
          </Field>

          {/* Régime */}
          <Field label="RÉGIME ALIMENTAIRE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
              {DIET_OPTIONS.map(function(d) {
                var active = form.diet === d.id;
                return (
                  <button key={d.id} onClick={()=>setForm({...form,diet:d.id})} style={{
                    padding:"6px 8px", borderRadius:8, fontSize:11, fontFamily:"inherit",
                    border:"2px solid "+(active?d.color:C.border),
                    background:active?d.color+"22":C.mid,
                    color:active?d.color:"rgba(255,255,255,0.4)",
                    cursor:"pointer", fontWeight:active?700:400,
                    display:"flex", alignItems:"center", gap:5,
                  }}>{d.icon} {d.label}</button>
                );
              })}
            </div>
          </Field>

          {/* Notes */}
          <Field label="NOTES">
            <Input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Allergies, mobilité réduite…" />
          </Field>

          {/* Actions */}
          <div style={{ display:"flex", gap:8, marginTop:6 }}>
            <button onClick={function(){ if(window.confirm("Supprimer "+guest.name+" ?")) { onDelete(guest.id); onClose(); } }}
              style={{ padding:"10px 14px", border:"1px solid rgba(192,57,43,0.3)", borderRadius:10, background:"rgba(192,57,43,0.08)", color:C.red, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
              🗑 Supprimer
            </button>
            <div style={{flex:1}}/>
            <button onClick={onClose} style={{ padding:"10px 16px", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, background:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
              Annuler
            </button>
            <button onClick={save} disabled={!form.name.trim()} style={{ padding:"10px 20px", border:"none", borderRadius:10, background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:form.name.trim()?"pointer":"not-allowed", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

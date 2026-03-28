/* eslint-disable */
import { useState } from "react";
import { C, useI18n } from "../theme";
import { Btn, Badge, Field, Input, Select } from "./UI";
import { DIET_OPTIONS, THEMES_CONFIG } from "../constants";
import { uid } from "../utils";

// ═══════════════════════════════════════════════════════════════
// GUEST FORM — Formulaire invité
// ═══════════════════════════════════════════════════════════════

function GuestForm({ event, onBack }) {
  const inputStyle = {
    width:"100%", padding:"9px 12px",
    background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:8, color:"#ffffff", fontSize:14,
    outline:"none", boxSizing:"border-box", fontFamily:"inherit",
  };

  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", diet:"standard", notes:"", plus1:false, allergies:[] });
  const [done, setDone] = useState(false);

  const toggleAllergy = (id) => {
    setForm(f=>({ ...f, allergies: f.allergies.includes(id)?f.allergies.filter(x=>x!==id):[...f.allergies,id] }));
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0d0d14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center", color:"#ffffff", padding:20 }}>
        <div style={{ fontSize:64 }}>🎉</div>
        <h2 style={{ fontFamily:"Georgia,serif", color:"#C9973A", fontSize:28, fontWeight:400 }}>Merci !</h2>
        <p style={{ color:"rgba(255,255,255,0.45)" }}>Vos préférences ont été enregistrées<br/>pour <strong style={{ color:"#ffffff" }}>{event.name}</strong></p>
        <Btn onClick={onBack} style={{ marginTop:24 }}>Retour à l'accueil</Btn>
      </div>
    </div>
  );

  const theme = THEMES_CONFIG[event.type]||THEMES_CONFIG.autre;

  return (
    <div style={{ minHeight:"100vh", background:theme.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:16 }}>
      <div style={{ width:"100%", maxWidth:420, background:C.cream, borderRadius:20, padding:36, boxShadow:`0 32px 80px #000a` }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40 }}>{theme.icon}</div>
          <h2 style={{ color:C.dark, margin:"8px 0 4px", fontSize:22, fontWeight:400 }}>{event.name}</h2>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:0 }}>Merci de renseigner vos préférences</p>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:4, marginBottom:24 }}>
          {[0,1].map(i=>(
            <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=step?theme.color:"#ddd" }}/>
          ))}
        </div>

        {step===0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="VOTRE NOM *">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd` }} placeholder="Prénom Nom"/>
            </Field>
            <Field label={t.fieldEmail}>
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd` }} type="email" placeholder="votre@email.fr"/>
            </Field>
            <label style={{ display:"flex", gap:10, alignItems:"center", fontSize:14, color:C.mid, cursor:"pointer" }}>
              <input type="checkbox" checked={form.plus1} onChange={e=>setForm({...form,plus1:e.target.checked})} style={{ width:16,height:16 }}/>
              Je viens avec un(e) accompagnant(e)
            </label>
            <Btn disabled={!form.name} onClick={()=>setStep(1)} style={{ width:"100%", padding:14, fontSize:15, marginTop:4 }}>
              Continuer →
            </Btn>
          </div>
        )}

        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="RÉGIME ALIMENTAIRE">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {DIET_OPTIONS.map(function(ditem){ return (
                  <button key={ditem.id} onClick={()=>setForm({...form,diet:ditem.id})} style={{
                    padding:"8px 10px", borderRadius:10, border:`2px solid ${form.diet===ditem.id?ditem.color:"#ddd"}`,
                    background:form.diet===ditem.id?ditem.color+"22":"#fff", cursor:"pointer",
                    fontSize:12, fontWeight:700, fontFamily:"inherit", color:form.diet===ditem.id?ditem.color:C.mid,
                    display:"flex", alignItems:"center", gap:6,
                  }}>
                    <span>{ditem.icon}</span><span>{ditem.label}</span>
                  </button>
                );})}
              </div>
            </Field>
            <Field label="ALLERGIES SPÉCIFIQUES">
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {DIET_OPTIONS.filter(function(ditem){ return ditem.id.startsWith("sans-")||ditem.id==="vegan"; }).map(function(ditem){ return (
                  <button key={ditem.id} onClick={()=>toggleAllergy(ditem.id)} style={{
                    padding:"4px 12px", borderRadius:99, border:`1px solid ${form.allergies.includes(ditem.id)?ditem.color:"#ddd"}`,
                    background:form.allergies.includes(ditem.id)?ditem.color+"22":"#fff",
                    cursor:"pointer", fontSize:11, fontFamily:"inherit", color:form.allergies.includes(ditem.id)?ditem.color:C.mid,
                  }}>{ditem.icon} {ditem.label}</button>
                );})}
              </div>
            </Field>
            <Field label="NOTES / PRÉCISIONS">
              <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3}
                placeholder="Mobilité réduite, allergie sévère, poussette..."
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd`, resize:"vertical" }}/>
            </Field>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="muted" onClick={()=>setStep(0)} style={{ flex:1 }}>← Retour</Btn>
              <Btn onClick={()=>setDone(true)} style={{ flex:2, padding:14 }}>Confirmer ✓</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EVENT EDITOR
// ═══════════════════════════════════════════════════════════════


export default GuestForm;

/* eslint-disable */
import Modal  from "../../ui/Modal";
import Field  from "../../ui/Field";
import Input  from "../../ui/Input";
import Btn    from "../../ui/Btn";
import { DIET_OPTIONS, C } from "../../../constants";
import { getRolesForType } from "../roles";

export default function AddGuestModal({ open, onClose, newGuest, setNewGuest, addGuest, t, evType }) {
  var roles = getRolesForType(evType || "autre");

  return (
    <Modal open={open} onClose={onClose} title={t&&t.addGuest||"Ajouter un invité"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

        {/* Nom */}
        <Field label={t&&t.fieldName||t&&t.fieldName||"NOM *"}>
          <Input value={newGuest.name} onChange={e=>setNewGuest({...newGuest,name:e.target.value})} placeholder="Prénom Nom"
            onKeyDown={e=>e.key==="Enter" && newGuest.name && addGuest()} />
        </Field>

        {/* Email */}
        <Field label={t&&t.fieldEmail||t&&t.fieldEmail||"EMAIL"}>
          <Input type="email" value={newGuest.email||""} onChange={e=>setNewGuest({...newGuest,email:e.target.value})} placeholder="email@example.fr" />
        </Field>

        {/* Téléphone */}
        <Field label={t&&t.phone||"TÉLÉPHONE"}>
          <Input value={newGuest.phone||""} onChange={e=>setNewGuest({...newGuest,phone:e.target.value})} placeholder="+33 6 12 34 56 78" />
        </Field>

        {/* Rôle */}
        <Field label={t&&t.guestRole||"RÔLE / FONCTION"}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {/* Option aucun rôle */}
            <button onClick={()=>setNewGuest({...newGuest,role:""})} style={{
              padding:"7px 10px", borderRadius:8, gridColumn:"1/-1",
              border:"1px solid "+(!newGuest.role?"rgba(255,255,255,0.3)":C.border),
              background:!newGuest.role?"rgba(255,255,255,0.06)":C.mid,
              cursor:"pointer", fontSize:11, fontFamily:"inherit",
              color:!newGuest.role?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)",
            }}>— Aucun rôle spécial</button>
            {roles.map(function(r) {
              var active = newGuest.role === r.id;
              return (
                <button key={r.id} onClick={()=>setNewGuest({...newGuest,role:r.id})} style={{
                  padding:"7px 10px", borderRadius:8,
                  border:"2px solid "+(active?r.color:C.border),
                  background:active?r.color+"22":C.mid,
                  cursor:"pointer", fontSize:11, fontWeight:active?700:400, fontFamily:"inherit",
                  color:active?r.color:"rgba(255,255,255,0.45)",
                  display:"flex", alignItems:"center", gap:5,
                }}>
                  {r.icon} {r.label}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Régime */}
        <Field label={t&&t.guestDiet||"RÉGIME ALIMENTAIRE"}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {DIET_OPTIONS.map(ditem=>(
              <button key={ditem.id} onClick={()=>setNewGuest({...newGuest,diet:ditem.id})} style={{
                padding:"7px 10px", borderRadius:8,
                border:"2px solid "+(newGuest.diet===ditem.id?ditem.color:C.border),
                background:newGuest.diet===ditem.id?ditem.color+"22":C.mid,
                cursor:"pointer", fontSize:11, fontWeight:newGuest.diet===ditem.id?700:400,
                fontFamily:"inherit", color:newGuest.diet===ditem.id?ditem.color:"rgba(255,255,255,0.45)",
                display:"flex", alignItems:"center", gap:6,
              }}>
                {ditem.icon} {ditem.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Notes */}
        <Field label={t&&t.guestNotes||t&&t.guestNotes||"NOTES"}>
          <Input value={newGuest.notes||""} onChange={e=>setNewGuest({...newGuest,notes:e.target.value})} placeholder="Allergies, mobilité réduite, info utile…" />
        </Field>

        <Btn onClick={addGuest} disabled={!newGuest.name.trim()} style={{marginTop:4}}>
          {t&&t.addGuest||t&&t.addGuestBtn||"Ajouter l'invité"}
        </Btn>
      </div>
    </Modal>
  );
}

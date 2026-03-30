import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function AddZoneModal({
  open,
  onClose,
  newZone,
  setNewZone,
  updateEv
}) {
  const reset = () => setNewZone({ label:"", icon:"📍", color:"#C9973A" });

  const handleAdd = () => {
    updateEv(ev => ({
      ...ev,
      zones: [...(ev.zones || []), { ...newZone }]
    }));
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Ajouter une zone">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

        <Field label="NOM DE LA ZONE *">
          <Input
            value={newZone.label}
            onChange={e=>setNewZone({...newZone,label:e.target.value})}
            placeholder="ex: Piste de danse, Bar, Scène, Photo Booth…"
          />
        </Field>

        <Field label="ICÔNE">
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["💃","🎭","🍹","📸","🧒","🌿","🍽","🥂","🎤","🎰","⛲","🪑","🎊","📍"].map(ic=>(
              <button
                key={ic}
                onClick={()=>setNewZone({...newZone,icon:ic})}
                style={{
                  width:38,
                  height:38,
                  borderRadius:8,
                  fontSize:20,
                  background:newZone.icon===ic ? C.gold+"33" : C.mid,
                  border:`2px solid ${newZone.icon===ic ? C.gold : C.border}`,
                  cursor:"pointer"
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </Field>

        <Field label="COULEUR">
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#64B5F6","#E8845A","#81C784"].map(col=>(
              <button
                key={col}
                onClick={()=>setNewZone({...newZone,color:col})}
                style={{
                  width:28,
                  height:28,
                  borderRadius:"50%",
                  background:col,
                  border:`3px solid ${newZone.color===col ? "#fff" : "transparent"}`,
                  cursor:"pointer",
                  padding:0
                }}
              />
            ))}
          </div>
        </Field>

        <Btn disabled={!newZone.label.trim()} onClick={handleAdd} style={{marginTop:4}}>
          Ajouter la zone
        </Btn>

      </div>
    </Modal>
  );
}

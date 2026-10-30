import React from "react";
import Modal from "../../ui/Modal";
import Field from "../../ui/Field";
import Input from "../../ui/Input";
import Btn from "../../ui/Btn";

export default function SettingsModal({ open, onClose, settings, setSettings, updateEv, t }) {
  return (
    <Modal open={open} onClose={onClose} title={t&&t.tabSettings||"Paramètres de l'événement"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Field label={t&&t.eventName||"NOM"}>
          <Input value={settings.name||""} onChange={e=>setSettings({...settings,name:e.target.value})} placeholder="Nom de l'événement" />
        </Field>
        <Field label={t&&t.settingDate||"DATE"}>
          <Input type="date" value={settings.date||""} onChange={e=>setSettings({...settings,date:e.target.value})} />
        </Field>
        <Field label="LIEU">
          <Input value={settings.venue||""} onChange={e=>setSettings({...settings,venue:e.target.value})} placeholder="Nom ou adresse du lieu" />
        </Field>
        <Field label="NOTES">
          <textarea value={settings.notes||""} onChange={e=>setSettings({...settings,notes:e.target.value})} rows={3} placeholder="Informations complémentaires…" style={{ width:"100%", padding:"8px 12px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }} />
        </Field>
        <Btn onClick={updateEv} style={{marginTop:4}}>{t&&t.save||"Enregistrer"}</Btn>
      </div>
    </Modal>
  );
}

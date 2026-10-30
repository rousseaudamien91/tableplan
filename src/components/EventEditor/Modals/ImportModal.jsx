import React, { useState } from "react";
import Modal from "../../ui/Modal";
import Btn from "../../ui/Btn";

export default function ImportModal({ open, onClose, onImport, title }) {
  const [text, setText] = useState("");
  return (
    <Modal open={open} onClose={onClose} title={title||"Importer des données"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <textarea
          value={text} onChange={e=>setText(e.target.value)}
          rows={8} placeholder="Collez vos données ici (CSV, JSON…)"
          style={{ width:"100%", padding:"10px 12px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"monospace", resize:"vertical", boxSizing:"border-box" }}
        />
        <Btn onClick={()=>{ onImport&&onImport(text); onClose(); }}>Importer</Btn>
      </div>
    </Modal>
  );
}

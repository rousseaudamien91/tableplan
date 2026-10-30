import React from "react";
import Modal from "../../ui/Modal";
import Btn from "../../ui/Btn";

export default function QRModal({ open, onClose, eventId }) {
  var url = typeof window !== "undefined" ? `${window.location.origin}/join/${eventId}` : "";
  return (
    <Modal open={open} onClose={onClose} title="📱 QR Code invité">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, padding:"8px 0" }}>
        <div style={{ background:"#fff", padding:16, borderRadius:12 }}>
          <div style={{ width:160, height:160, background:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#999", textAlign:"center" }}>
            QR Code<br/>{eventId}
          </div>
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textAlign:"center", wordBreak:"break-all" }}>
          {url}
        </div>
        <Btn onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(url)}>
          📋 Copier le lien
        </Btn>
      </div>
    </Modal>
  );
}

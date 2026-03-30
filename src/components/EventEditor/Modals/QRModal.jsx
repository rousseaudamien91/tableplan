import React from "react";
import Modal from "../../Modal";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function QRModal({ open, onClose, eventId }) {
  const eventUrl = `${window.location.origin}/event/${eventId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(eventUrl);
  };

  return (
    <Modal open={open} onClose={onClose} title="QR Code de l'événement">
      <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center" }}>

        {/* QR CODE */}
        <div
          style={{
            padding:20,
            background:"#fff",
            borderRadius:12
          }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(eventUrl)}`}
            alt="QR Code"
            style={{ width:240, height:240 }}
          />
        </div>

        {/* LIEN */}
        <div
          style={{
            width:"100%",
            padding:"10px 14px",
            background:C.mid,
            border:`1px solid ${C.border}`,
            borderRadius:8,
            fontSize:13,
            color:"rgba(255,255,255,0.65)",
            wordBreak:"break-all",
            textAlign:"center"
          }}
        >
          {eventUrl}
        </div>

        {/* BOUTONS */}
        <div style={{ display:"flex", gap:12 }}>
          <Btn onClick={copyLink}>Copier le lien</Btn>
          <Btn onClick={onClose} style={{ background:"#333" }}>
            Fermer
          </Btn>
        </div>

      </div>
    </Modal>
  );
}

import React, { useState } from "react";
import { Modal, Btn } from "../UI";
import { C } from "../../constants";

export default function ImportModal({
  open,
  onClose,
  onImport,
  title = "Importer des données"
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
  };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    const text = await f.text();
    const rows = text.split("\n").map((r) => r.split(","));
    setPreview(rows.slice(0, 5)); // aperçu des 5 premières lignes
  };

  const handleImport = () => {
    if (!file) return;

    file.text().then((text) => {
      const rows = text.split("\n").map((r) => r.split(","));
      onImport(rows);
      reset();
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={title}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        
        {/* UPLOAD */}
        <label
          style={{
            padding: "14px 18px",
            background: C.mid,
            border: `1px dashed ${C.border}`,
            borderRadius: 10,
            cursor: "pointer",
            textAlign: "center",
            color: "rgba(255,255,255,0.65)",
            fontSize: 14,
          }}
        >
          {file ? "Fichier sélectionné ✔" : "Cliquez pour choisir un fichier CSV"}
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </label>

        {/* APERÇU */}
        {preview && (
          <div
            style={{
              background: "#1a1a25",
              borderRadius: 10,
              padding: 12,
              border: `1px solid ${C.border}`,
              maxHeight: 200,
              overflow: "auto",
            }}
          >
            {preview.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                  gap: 6,
                  padding: "4px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {row.map((cell, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <Btn disabled={!file} onClick={handleImport} style={{ marginTop: 4 }}>
          Importer
        </Btn>
      </div>
    </Modal>
  );
}

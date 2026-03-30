import React from "react";
import Modal from "../../Modal";
import Field from "../../Field";
import Input from "../../Input";
import Btn from "../../Btn";
import { C } from "../../../constants";

export default function SettingsModal({
  open,
  onClose,
  settings,
  setSettings,
  updateEv
}) {
  const reset = () =>
    setSettings({
      title: "",
      date: "",
      location: "",
      theme: "",
      color: "#C9973A",
      notes: ""
    });

  const handleSave = () => {
    updateEv(ev => ({
      ...ev,
      settings: { ...settings }
    }));
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Paramètres de l'événement"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <Field label="TITRE DE L'ÉVÉNEMENT *">
          <Input
            value={settings.title}
            onChange={e =>
              setSettings({ ...settings, title: e.target.value })
            }
            placeholder="ex: Mariage de Clara & Hugo"
          />
        </Field>

        <Field label="DATE">
          <Input
            type="date"
            value={settings.date}
            onChange={e =>
              setSettings({ ...settings, date: e.target.value })
            }
          />
        </Field>

        <Field label="LIEU">
          <Input
            value={settings.location}
            onChange={e =>
              setSettings({ ...settings, location: e.target.value })
            }
            placeholder="ex: Château de la Forêt, Paris…"
          />
        </Field>

        <Field label="THÈME (optionnel)">
          <Input
            value={settings.theme}
            onChange={e =>
              setSettings({ ...settings, theme: e.target.value })
            }
            placeholder="ex: Bohème chic, Classique, Nature…"
          />
        </Field>

        <Field label="COULEUR PRINCIPALE">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "#C9973A",
              "#E84A6A",
              "#4CAF50",
              "#2196F3",
              "#9C27B0",
              "#FF9800",
              "#8B7EC8",
              "#64B5F6",
              "#E8845A",
              "#81C784"
            ].map(col => (
              <button
                key={col}
                onClick={() =>
                  setSettings({ ...settings, color: col })
                }
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: col,
                  border: `3px solid ${
                    settings.color === col ? "#fff" : "transparent"
                  }`,
                  cursor: "pointer",
                  padding: 0
                }}
              />
            ))}
          </div>
        </Field>

        <Field label="NOTES (optionnel)">
          <Input
            value={settings.notes}
            onChange={e =>
              setSettings({ ...settings, notes: e.target.value })
            }
            placeholder="Infos diverses, planning global…"
          />
        </Field>

        <Btn
          disabled={!settings.title.trim()}
          onClick={handleSave}
          style={{ marginTop: 4 }}
        >
          Enregistrer
        </Btn>

      </div>
    </Modal>
  );
}

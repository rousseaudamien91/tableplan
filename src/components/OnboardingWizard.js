/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// i18n
import { useI18n } from "../theme";

// UI
import Btn from "./ui/Btn";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Modal from "./ui/Modal";

// thème + types d'événements
import { useTheme } from "../theme";
import { EVENT_THEMES } from "../theme/eventThemes";

export default function OnboardingWizard({ onSkip, onComplete }) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name:      "",
    date:      "",
    type:      "mariage",
    roomShape: "rectangle",
  });

  const next   = () => setStep((s) => s + 1);
  const prev   = () => setStep((s) => s - 1);
  const finish = () => { onComplete(data); };

  return (
    <Modal open={true} onClose={onSkip} title={t("onboarding.title") || "Nouvel événement"}>
      <div style={{ padding: "4px 2px" }}>

        {/* STEP 1 — Nom */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.eventName") || "Nom de l'événement"}>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder={t("onboarding.placeholderName") || "Ex : Mariage Dupont × Martin"}
              />
            </Field>
            <Btn size="md" onClick={next} disabled={!data.name}>
              {t("next") || "Suivant →"}
            </Btn>
            <Btn variant="ghost" onClick={onSkip}>
              {t("skip") || "Passer"}
            </Btn>
          </div>
        )}

        {/* STEP 2 — Date */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.eventDate") || "Date"}>
              <Input
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </Field>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={prev}>{t("back") || "← Retour"}</Btn>
              <Btn size="md" onClick={next}>{t("next") || "Suivant →"}</Btn>
            </div>
          </div>
        )}

        {/* STEP 3 — Type d'événement */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.eventType") || "Type d'événement"}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {Object.entries(EVENT_THEMES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setData({ ...data, type: k })}
                    style={{
                      padding:     "10px 8px",
                      borderRadius: 10,
                      border:      data.type === k ? `2px solid ${v.color}` : `1px solid ${theme.border || "rgba(201,151,58,0.2)"}`,
                      background:  data.type === k ? v.color + "22" : theme.card || "#1E1208",
                      cursor:      "pointer",
                      color:       data.type === k ? v.color : theme.textMuted || "rgba(255,255,255,0.45)",
                      fontFamily:  "inherit",
                      fontSize:    12,
                      fontWeight:  700,
                      display:     "flex",
                      alignItems:  "center",
                      gap:         6,
                      transition:  "all .22s ease",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{v.icon}</span>
                    {v.label}
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={prev}>{t("back") || "← Retour"}</Btn>
              <Btn size="md" onClick={next}>{t("next") || "Suivant →"}</Btn>
            </div>
          </div>
        )}

        {/* STEP 4 — Forme de salle */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.roomShape") || "Forme de la salle"}>
              <Select
                value={data.roomShape}
                onChange={(e) => setData({ ...data, roomShape: e.target.value })}
              >
                <option value="rectangle">{t("shapes.rectangle") || "Rectangle"}</option>
                <option value="carre">{t("shapes.square") || "Carré"}</option>
                <option value="ronde">{t("shapes.round") || "Ronde"}</option>
                <option value="u">{t("shapes.uShape") || "En U"}</option>
              </Select>
            </Field>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={prev}>{t("back") || "← Retour"}</Btn>
              <Btn size="md" onClick={finish}>{t("finish") || "🚀 Créer"}</Btn>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

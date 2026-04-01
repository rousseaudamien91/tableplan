/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// i18n
import { useI18n } from "../i18n";

// UI
import Btn from "./ui/Btn";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Modal from "./ui/Modal";

// thème
import { useTheme, EVENT_THEMES } from "../theme";

export default function OnboardingWizard({ onSkip, onComplete }) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    name: "",
    date: "",
    type: "mariage",
    roomShape: "rectangle",
  });

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const finish = () => {
    onComplete(data);
  };

  return (
    <Modal open={true} onClose={onSkip} title={t("onboarding.title")}>
      <div style={{ padding: "4px 2px" }}>
        {/* STEP 1 — Nom */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.eventName")}>
              <Input
                value={data.name}
                onChange={(e) =>
                  setData({ ...data, name: e.target.value })
                }
                placeholder={t("onboarding.placeholderName")}
              />
            </Field>

            <Btn size="md" onClick={next} disabled={!data.name}>
              {t("next")}
            </Btn>

            <Btn variant="ghost" onClick={onSkip}>
              {t("skip")}
            </Btn>
          </div>
        )}

        {/* STEP 2 — Date */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.eventDate")}>
              <Input
                type="date"
                value={data.date}
                onChange={(e) =>
                  setData({ ...data, date: e.target.value })
                }
              />
            </Field>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={prev}>
                {t("back")}
              </Btn>
              <Btn size="md" onClick={next}>
                {t("next")}
              </Btn>
            </div>
          </div>
        )}

        {/* STEP 3 — Type d'événement */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.eventType")}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {Object.entries(EVENT_THEMES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setData({ ...data, type: k })}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 10,
                      border:
                        data.type === k
                          ? `2px solid ${v.color}`
                          : `1px solid ${theme.border}`,
                      background:
                        data.type === k ? v.color + "22" : theme.card,
                      cursor: "pointer",
                      color:
                        data.type === k ? v.color : theme.textMuted,
                      fontFamily: "inherit",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all .22s ease",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{v.icon}</span> {v.label}
                  </button>
                ))}
              </div>
            </Field>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={prev}>
                {t("back")}
              </Btn>
              <Btn size="md" onClick={next}>
                {t("next")}
              </Btn>
            </div>
          </div>
        )}

        {/* STEP 4 — Forme de salle */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={t("onboarding.roomShape")}>
              <Select
                value={data.roomShape}
                onChange={(e) =>
                  setData({ ...data, roomShape: e.target.value })
                }
              >
                <option value="rectangle">{t("shapes.rectangle")}</option>
                <option value="carre">{t("shapes.square")}</option>
                <option value="ronde">{t("shapes.round")}</option>
                <option value="u">{t("shapes.uShape")}</option>
              </Select>
            </Field>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={prev}>
                {t("back")}
              </Btn>
              <Btn size="md" onClick={finish}>
                {t("finish")}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* eslint-disable */
import { useState } from "react";

// i18n (nouveau système)
import { useI18n } from "../i18n";

// constantes (couleurs, plans, vouchers)
import { C } from "../constants";

// UI + utils
import Btn from "./ui/Btn";
import Modal from "./ui/Modal";
import Field from "./ui/Field";
import Input from "./ui/Input";

// thème
import { useTheme } from "../theme";

export default function GuestForm({ guest, onSave, onClose }) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [data, setData] = useState({
    name: guest?.name || "",
    table: guest?.table || "",
    notes: guest?.notes || "",
  });

  const save = () => {
    if (!data.name.trim()) {
      alert(t("guestForm.missingName"));
      return;
    }
    onSave({ ...guest, ...data });
  };

  return (
    <Modal open={true} onClose={onClose} title={t("guestForm.title")}>
      <div
        style={{
          padding: "4px 2px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* NOM */}
        <Field label={t("guestForm.name")}>
          <Input
            value={data.name}
            onChange={(e) =>
              setData({ ...data, name: e.target.value })
            }
            placeholder={t("guestForm.placeholderName")}
          />
        </Field>

        {/* TABLE */}
        <Field label={t("guestForm.table")}>
          <Input
            value={data.table}
            onChange={(e) =>
              setData({ ...data, table: e.target.value })
            }
            placeholder={t("guestForm.placeholderTable")}
          />
        </Field>

        {/* NOTES */}
        <Field label={t("guestForm.notes")}>
          <Input
            value={data.notes}
            onChange={(e) =>
              setData({ ...data, notes: e.target.value })
            }
            placeholder={t("guestForm.placeholderNotes")}
          />
        </Field>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Btn variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Btn>

          <Btn size="md" onClick={save}>
            {t("save")}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

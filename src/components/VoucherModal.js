/* eslint-disable */
import { useState } from "react";

// i18n (nouveau système)
import { useI18n } from "../i18n";

// constantes (couleurs, plans, vouchers)
import { VOUCHERS } from "../constants";

// UI premium
import Btn from "./ui/Btn";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

// thème
import { useTheme } from "../theme";

export default function VoucherModal({ onClose, onApply }) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const apply = () => {
    const v = VOUCHERS[code.toUpperCase()];
    if (!v) {
      setError(t("pricing.invalidCode"));
      return;
    }
    onApply({ code: code.toUpperCase(), ...v });
  };

  return (
    <Modal open={true} onClose={onClose} title={t("pricing.voucherTitle")}>
      <div
        style={{
          padding: "4px 2px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Field label={t("pricing.voucher")}>
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="PROMO10"
          />
        </Field>

        {error && (
          <div style={{ color: theme.textMuted, fontSize: 13 }}>
            {error}
          </div>
        )}

        <Btn size="md" onClick={apply}>
          {t("pricing.apply")}
        </Btn>

        <Btn variant="ghost" onClick={onClose}>
          {t("cancel")}
        </Btn>
      </div>
    </Modal>
  );
}

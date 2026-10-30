/* eslint-disable */
import { useState } from "react";
import { useI18n }  from "../i18n";
import { VOUCHERS } from "../constants";
import { useTheme } from "../theme";
import Btn   from "./ui/Btn";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

export default function VoucherModal({ onClose, onApply }) {
  const { theme } = useTheme();
  const { t }     = useI18n();
  const [code, setCode]   = useState("");
  const [error, setError] = useState("");

  const apply = () => {
    const v = VOUCHERS[code.trim().toUpperCase()];
    if (!v) {
      setError(t.voucherInvalid || "Code invalide ou expiré.");
      return;
    }
    onApply({ code: code.trim().toUpperCase(), ...v });
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title={t.voucherTitle || "Code promo"}>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <Field label={t.voucherCode || "Code promotionnel"}>
          <Input
            value={code}
            onChange={e => { setCode(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && apply()}
            placeholder="PROMO10"
          />
        </Field>

        {error && (
          <div style={{ color: theme?.primary || "#e05252", fontSize:13 }}>
            {error}
          </div>
        )}

        <Btn onClick={apply}>
          {t.voucherApply || "Appliquer"}
        </Btn>

        <Btn variant="ghost" onClick={onClose}>
          {t.cancel || "Annuler"}
        </Btn>
      </div>
    </Modal>
  );
}

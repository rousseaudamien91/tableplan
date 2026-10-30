/* eslint-disable */
import { useState } from "react";
import { useI18n }  from "../i18n";
import { useTheme } from "../theme";
import { utiliserCode, offreDe } from "../offres";
import Btn   from "./ui/Btn";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

// Le code est vérifié par les règles Firestore (collection « vouchers », invisible pour les utilisateurs) :
// aucun code n'est présent dans le site.
export default function VoucherModal({ user, entitlement, onClose, onApply }) {
  const { theme } = useTheme();
  const { t }     = useI18n();
  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [enCours, setEnCours] = useState(false);

  const dejaActif = entitlement && entitlement.plan && entitlement.plan !== "free";
  const invite    = !user || user.id === "guest";

  const apply = async () => {
    if (enCours || !code.trim()) return;
    setEnCours(true); setError("");
    try {
      const plan = await utiliserCode(user.id, code);
      onApply && onApply(plan);
      onClose();
    } catch (e) {
      setError(t.voucherInvalid || "Code invalide, déjà utilisé ou expiré.");
    }
    setEnCours(false);
  };

  return (
    <Modal open={true} onClose={onClose} title={t.voucherTitle || "Code promo"}>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        {invite ? (
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)" }}>
            Connectez-vous avec Google pour utiliser un code promo.
          </div>
        ) : dejaActif ? (
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.8)" }}>
            Votre compte bénéficie déjà de la formule <b>{offreDe(entitlement.plan).label}</b>
            {" "}({offreDe(entitlement.plan).maxGuests} invités par événement).
          </div>
        ) : (
          <>
            <Field label={t.voucherCode || "Code promotionnel"}>
              <Input
                value={code}
                onChange={e => { setCode(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && apply()}
                placeholder="XXXX-XXXX-XXXX"
                autoFocus
              />
            </Field>
            {error && (
              <div role="alert" style={{ color: theme?.primary || "#e05252", fontSize:13 }}>{error}</div>
            )}
            <Btn onClick={apply} disabled={enCours}>
              {enCours ? "Vérification…" : (t.voucherApply || "Appliquer")}
            </Btn>
          </>
        )}
        <Btn variant="ghost" onClick={onClose}>{dejaActif || invite ? "Fermer" : (t.cancel || "Annuler")}</Btn>
      </div>
    </Modal>
  );
}

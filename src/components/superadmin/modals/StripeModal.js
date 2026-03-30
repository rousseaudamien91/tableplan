/* eslint-disable */
import { Field, Input, Btn } from "../../components/UI";
import { useI18n } from "../../theme";

export default function StripeModal({
  open,
  onClose,
  stripeKey,
  setStripeKey,
  stripeSecret,
  setStripeSecret
}) {
  const { t } = useI18n();

  if (!open) return null;

  const save = () => {
    localStorage.setItem("tm_stripe_pk", stripeKey);
    localStorage.setItem("tm_stripe_sk", stripeSecret);
    onClose();
  };

  return (
    <div style={{
      background:"#0008",
      position:"fixed",
      inset:0,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      zIndex:9999
    }}>
      <div style={{
        width:500,
        background:"#18182a",
        borderRadius:12,
        padding:24,
        border:"1px solid rgba(255,255,255,0.1)"
      }}>
        <h3 style={{margin:"0 0 16px",fontSize:18,fontWeight:700}}>
          Configuration Stripe
        </h3>

        <div style={{
          padding:"10px 14px",
          background:"rgba(201,151,58,0.08)",
          border:"1px solid rgba(201,151,58,0.2)",
          borderRadius:8,
          fontSize:12,
          color:"rgba(255,255,255,0.6)",
          marginBottom:12
        }}>
          ⚠️ Clés stockées localement. Pour la production, utilisez les variables d'environnement.
        </div>

        <Field label="CLÉ PUBLIQUE">
          <Input
            value={stripeKey}
            onChange={e => setStripeKey(e.target.value)}
            placeholder="pk_live_xxxxxxxxxxxxx"
          />
        </Field>

        <Field label="CLÉ SECRÈTE">
          <Input
            type="password"
            value={stripeSecret}
            onChange={e => setStripeSecret(e.target.value)}
            placeholder="sk_live_xxxxxxxxxxxxx"
          />
        </Field>

        <div style={{display:"flex",gap:10,marginTop:12}}>
          <Btn onClick={save} style={{flex:1}}>💾 Sauvegarder</Btn>
          <Btn variant="ghost" onClick={onClose}>Fermer</Btn>
        </div>
      </div>
    </div>
  );
}

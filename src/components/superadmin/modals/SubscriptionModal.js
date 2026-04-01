/* eslint-disable */
import { Field, Input, Select, Btn } from "../../components/UI";
import { useI18n } from "../../i18n";

export default function SubscriptionModal({
  open,
  onClose,
  user,
  setUsers,
  SUBSCRIPTION_PLANS
}) {
  const { t } = useI18n();

  if (!open || !user) return null;

  const save = () => {
    setUsers(prev =>
      prev.map(u =>
        u.id === user.id
          ? {
              ...u,
              plan: user.plan,
              subscriptionStatus: user.subscriptionStatus,
              subscriptionEnd: user.subscriptionEnd,
              stripeCustomerId: user.stripeCustomerId
            }
          : u
      )
    );
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
          Souscription — {user.name}
        </h3>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="PLAN">
            <Select
              value={user.plan}
              onChange={e => user.set("plan", e.target.value)}
            >
              {Object.entries(SUBSCRIPTION_PLANS).map(([k,v]) => (
                <option key={k} value={k}>
                  {v.label} — {v.price === 0 ? "Gratuit" : v.price+"€/mois"}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="STATUT">
            <Select
              value={user.subscriptionStatus}
              onChange={e => user.set("subscriptionStatus", e.target.value)}
            >
              <option value="active">Actif</option>
              <option value="trial">Essai</option>
              <option value="expired">Expiré</option>
              <option value="cancelled">Annulé</option>
            </Select>
          </Field>

          <Field label="DATE DE FIN">
            <Input
              type="date"
              value={user.subscriptionEnd || ""}
              onChange={e => user.set("subscriptionEnd", e.target.value)}
            />
          </Field>

          <Field label="STRIPE CUSTOMER ID">
            <Input
              value={user.stripeCustomerId || ""}
              onChange={e => user.set("stripeCustomerId", e.target.value)}
              placeholder="cus_xxxxxxxxxxxxxxxxx"
            />
          </Field>

          <Btn onClick={save}>Sauvegarder</Btn>
        </div>
      </div>
    </div>
  );
}

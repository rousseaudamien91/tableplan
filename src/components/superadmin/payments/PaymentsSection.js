/* eslint-disable */
import { useI18n } from "../../theme";
import { Btn, Field, Input } from "../../components/UI";
import { C } from "../../constants";

export default function PaymentsSection({
  stripeKey,
  setStripeKey,
  stripeSecret,
  setStripeSecret,
  paypalEmail,
  setPaypalEmail,
  paypalClientId,
  setPaypalClientId,
  SUBSCRIPTION_PLANS,
  cardStyle,
  showStripeSetup,
  setShowStripeSetup
}) {
  const { t } = useI18n();

  const savePaypal = () => {
    localStorage.setItem("tm_paypal_email", paypalEmail);
    localStorage.setItem("tm_paypal_client_id", paypalClientId);
    alert("PayPal sauvegardé ✅");
  };

  const saveStripe = () => {
    localStorage.setItem("tm_stripe_pk", stripeKey);
    localStorage.setItem("tm_stripe_sk", stripeSecret);
    setShowStripeSetup(false);
  };

  return (
    <div>
      <h2 style={{margin:"0 0 8px",fontSize:24,fontWeight:700}}>
        {t("superadmin.payments.title")}
      </h2>
      <p style={{color:"rgba(255,255,255,0.4)",margin:"0 0 32px",fontSize:14}}>
        {t("superadmin.payments.subtitle")}
      </p>

      {/* PAYPAL */}
      <div style={{...cardStyle,marginBottom:20,border:"1px solid rgba(0,113,206,0.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{
            width:48,height:48,borderRadius:12,
            background:"#003087",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:24
          }}>🅿️</div>

          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:16}}>
              PayPal <span style={{
                fontSize:11,padding:"2px 8px",
                background:"rgba(0,113,206,0.2)",
                color:"#60a5fa",
                borderRadius:99,
                marginLeft:6
              }}>
                {t("superadmin.payments.recommended")}
              </span>
            </div>

            <div style={{
              fontSize:12,
              color: paypalEmail ? "#27AE60" : "rgba(255,255,255,0.4)",
              marginTop:2
            }}>
              {paypalEmail
                ? t("superadmin.payments.paypalConfigured", { email: paypalEmail })
                : t("superadmin.payments.notConfigured")}
            </div>
          </div>

          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",textAlign:"right"}}>
            3,4% + 0,35€<br/>{t("superadmin.payments.perTransaction")}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <Field label="EMAIL PAYPAL *">
            <Input value={paypalEmail} onChange={e=>setPaypalEmail(e.target.value)} placeholder="email@example.com"/>
          </Field>

          <Field label="CLIENT ID PAYPAL (optionnel)">
            <Input value={paypalClientId} onChange={e=>setPaypalClientId(e.target.value)} placeholder="AaBbCc..."/>
          </Field>
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn onClick={savePaypal}>💾 Sauvegarder</Btn>
          <a href="https://www.paypal.com/signin" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <Btn variant="ghost">Ouvrir PayPal →</Btn>
          </a>
          <a href="https://www.paypal.com/buttons/smart" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <Btn variant="ghost">Créer un bouton →</Btn>
          </a>
        </div>

        {paypalEmail && (
          <div style={{
            marginTop:16,
            padding:"14px 16px",
            background:"rgba(0,113,206,0.06)",
            border:"1px solid rgba(0,113,206,0.2)",
            borderRadius:10
          }}>
            <div style={{
              fontSize:12,fontWeight:700,color:"#60a5fa",marginBottom:10
            }}>
              {t("superadmin.payments.quickLinks")}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {Object.entries(SUBSCRIPTION_PLANS)
                .filter(([k]) => k !== "free")
                .map(([key, plan]) => {
                  const link = "https://www.paypal.com/paypalme/" + paypalEmail.split("@")[0] + "/" + plan.price + "EUR";

                  return (
                    <div key={key} style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{color:plan.color,fontWeight:700,minWidth:80,fontSize:13}}>
                        {plan.label}
                      </span>

                      <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",minWidth:50}}>
                        {plan.price}€/mois
                      </span>

                      <code style={{
                        flex:1,fontSize:11,color:"rgba(255,255,255,0.6)",
                        background:"#13131e",padding:"4px 8px",
                        borderRadius:6,overflow:"hidden",
                        textOverflow:"ellipsis",whiteSpace:"nowrap"
                      }}>
                        {link}
                      </code>

                      <Btn small variant="ghost" onClick={() => navigator.clipboard.writeText(link)}>
                        📋
                      </Btn>
                    </div>
                  );
                })}
            </div>

            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:10}}>
              ⚠️ {t("superadmin.payments.paypalMeWarning")}
            </div>
          </div>
        )}
      </div>

      {/* STRIPE */}
      <div style={{...cardStyle,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
          <div style={{
            width:48,height:48,borderRadius:12,
            background:"#635bff",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:24
          }}>💳</div>

          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:16}}>Stripe</div>
            <div style={{
              fontSize:12,
              color: stripeKey ? "#27AE60" : "rgba(255,255,255,0.4)",
              marginTop:2
            }}>
              {stripeKey
                ? t("superadmin.payments.stripeConfigured")
                : t("superadmin.payments.notConfigured")}
            </div>
          </div>

          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",textAlign:"right"}}>
            1,5% + 0,25€<br/>{t("superadmin.payments.perTransaction")}
          </div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <Btn onClick={() => setShowStripeSetup(true)} variant="ghost">
            {stripeKey
              ? t("superadmin.payments.editKeys")
              : t("superadmin.payments.configureStripe")}
          </Btn>

          <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <Btn variant="ghost">Stripe Dashboard →</Btn>
          </a>
        </div>
      </div>

      {/* STRIPE MODAL */}
      {showStripeSetup && (
        <div style={{
          marginTop:20,
          padding:20,
          background:"#13131e",
          borderRadius:12,
          border:"1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{
            padding:"10px 14px",
            background:"rgba(201,151,58,0.08)",
            border:"1px solid rgba(201,151,58,0.2)",
            borderRadius:8,
            fontSize:12,
            color:"rgba(255,255,255,0.6)",
            marginBottom:12
          }}>
            ⚠️ {t("superadmin.payments.localWarning")}
          </div>

          <Field label="CLÉ PUBLIQUE (pk_live_... ou pk_test_...)">
            <Input value={stripeKey} onChange={e=>setStripeKey(e.target.value)} placeholder="pk_live_xxxxxxxxxxxxx"/>
          </Field>

          <Field label="CLÉ SECRÈTE (sk_live_... ou sk_test_...)">
            <Input type="password" value={stripeSecret} onChange={e=>setStripeSecret(e.target.value)} placeholder="sk_live_xxxxxxxxxxxxx"/>
          </Field>

          <div style={{display:"flex",gap:10,marginTop:12}}>
            <Btn onClick={saveStripe} style={{flex:1}}>💾 Sauvegarder</Btn>

            <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <Btn variant="ghost">Ouvrir Stripe →</Btn>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

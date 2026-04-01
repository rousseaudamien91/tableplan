/* eslint-disable */
import { useI18n } from "../../i18n";
import { C } from "../../constants";

export default function StatsSection({
  users,
  events,
  enrichedUsers,
  stats,
  SUBSCRIPTION_PLANS,
  VOUCHERS,
  cardStyle
}) {
  const { t } = useI18n();

  const totalGuests = events.reduce((s, e) => s + (e.guests || []).length, 0);

  return (
    <div>
      <h2 style={{margin:"0 0 28px",fontSize:24,fontWeight:700}}>
        {t("superadmin.stats.title")}
      </h2>

      {/* KPI GRID */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
        gap:16,
        marginBottom:28
      }}>
        {[
          { label: t("superadmin.stats.users"), val: users.length, icon:"👥", color:C.blue },
          { label: t("superadmin.stats.mrr"), val: stats.mrr+"€", icon:"💰", color:C.gold },
          { label: t("superadmin.stats.projects"), val: events.length, icon:"📁", color:C.gold },
          { label: t("superadmin.stats.guests"), val: totalGuests, icon:"👤", color:C.green },
          { label: t("superadmin.stats.paidPlans"), val: stats.proUsers, icon:"⭐", color:"#E8845A" },
          { label: t("superadmin.stats.trialUsers"), val: stats.trialUsers, icon:"⏳", color:"#F0C97A" }
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.val}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:12,marginTop:4}}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* PLAN DISTRIBUTION */}
      <div style={{...cardStyle,marginBottom:20}}>
        <h3 style={{color:C.gold,margin:"0 0 16px",fontWeight:600,fontSize:15}}>
          {t("superadmin.stats.planDistribution")}
        </h3>

        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
          const count = enrichedUsers.filter(u => u.plan === key).length;
          const pct = users.length > 0 ? Math.round(count / users.length * 100) : 0;

          return (
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <span style={{width:80,fontSize:13,color:plan.color,fontWeight:600}}>
                {plan.label}
              </span>

              <div style={{
                flex:1,
                height:8,
                background:"rgba(255,255,255,0.06)",
                borderRadius:99,
                overflow:"hidden"
              }}>
                <div style={{
                  width:pct+"%",
                  height:"100%",
                  background:plan.color,
                  borderRadius:99
                }}/>
              </div>

              <span style={{
                fontSize:12,
                color:"rgba(255,255,255,0.4)",
                width:60,
                textAlign:"right"
              }}>
                {count} {t("superadmin.stats.accounts")}
              </span>

              <span style={{
                fontSize:12,
                color:"rgba(255,255,255,0.25)",
                width:35
              }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* VOUCHERS */}
      <div style={cardStyle}>
        <h3 style={{color:C.gold,margin:"0 0 16px",fontWeight:600,fontSize:15}}>
          {t("superadmin.stats.vouchers")}
        </h3>

        {Object.entries(VOUCHERS).map(([code, v]) => (
          <div key={code} style={{
            display:"flex",
            alignItems:"center",
            gap:12,
            padding:"12px 16px",
            background:"#13131e",
            borderRadius:10,
            marginBottom:8
          }}>
            <span style={{
              fontFamily:"monospace",
              color:"#C9973A",
              fontWeight:700,
              fontSize:14,
              minWidth:120
            }}>
              {code}
            </span>

            <span style={{color:"#fff",fontSize:13,flex:1}}>
              {v.description}
            </span>

            <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>
              -{v.discount}%
            </span>

            <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>
              {t("superadmin.stats.max")} {v.maxUses}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* eslint-disable */
import { useState, useEffect } from "react";
import { C, useI18n } from "../theme";
import { Btn, Badge, Modal, Field, Input, Select } from "./UI";
import { PLANS, INITIAL_USERS, THEMES_CONFIG, VOUCHERS } from "../constants";
import { uid } from "../utils";

const SUBSCRIPTION_PLANS = {
  free:       { label:"Free",       color:"#8A7355",  price:0,   maxEvents:1,   maxGuests:50   },
  starter:    { label:"Starter",    color:"#3b82f6",  price:9,   maxEvents:3,   maxGuests:200  },
  pro:        { label:"Pro",        color:"#C9973A",  price:29,  maxEvents:20,  maxGuests:999  },
  enterprise: { label:"Enterprise", color:"#e05252",  price:99,  maxEvents:999, maxGuests:9999 },
};

const STATUS_COLORS = {
  active:"#27AE60", trial:"#F0C97A", expired:"#e05252", cancelled:"#8A7355",
};

function SuperAdminPanel({ events, setEvents, users, setUsers, onLogout }) {
  const { t } = useI18n();
  const [tab, setTab]                       = useState("accounts");
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewUser, setShowNewUser]       = useState(false);
  const [showSubscription, setShowSubscription] = useState(null);
  const [showStripeSetup, setShowStripeSetup]   = useState(false);
  const [stripeKey,    setStripeKey]    = useState(localStorage.getItem("tm_stripe_pk")||"")
  const [paypalEmail,  setPaypalEmail]  = useState(localStorage.getItem("tm_paypal_email")||"")
  const [paypalClientId, setPaypalClientId] = useState(localStorage.getItem("tm_paypal_client_id")||"");
  const [stripeSecret, setStripeSecret] = useState(localStorage.getItem("tm_stripe_sk")||"");
  const [search,       setSearch]       = useState("");
  const [filterPlan,   setFilterPlan]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newProject,   setNewProject]   = useState({ name:"", date:"", type:"mariage", adminId:"" });
  const [newUser,      setNewUser]      = useState({ name:"", email:"", role:"admin", plan:"free", subscriptionStatus:"trial" });

  const enrichedUsers = users.map(u => ({
    ...u,
    plan: u.plan || "free",
    subscriptionStatus: u.subscriptionStatus || (u.role==="superadmin" ? "active" : "trial"),
    subscriptionStart: u.subscriptionStart || new Date(Date.now()-7*86400000).toISOString().slice(0,10),
    subscriptionEnd:   u.subscriptionEnd   || new Date(Date.now()+23*86400000).toISOString().slice(0,10),
    stripeCustomerId:  u.stripeCustomerId  || "",
    projectCount: events.filter(e=>e.ownerId===u.id).length,
    guestCount:   events.filter(e=>e.ownerId===u.id).reduce((s,e)=>s+(e.guests||[]).length,0),
  }));

  const filteredUsers = enrichedUsers.filter(u => {
    if (filterPlan   !== "all" && u.plan               !== filterPlan)   return false;
    if (filterStatus !== "all" && u.subscriptionStatus !== filterStatus) return false;
    if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) &&
        !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalUsers:           users.length,
    activeSubscriptions:  enrichedUsers.filter(u=>u.subscriptionStatus==="active").length,
    trialUsers:           enrichedUsers.filter(u=>u.subscriptionStatus==="trial").length,
    proUsers:             enrichedUsers.filter(u=>u.plan==="pro"||u.plan==="enterprise").length,
    mrr:                  enrichedUsers.reduce((s,u)=>s+(SUBSCRIPTION_PLANS[u.plan]?.price||0),0),
  };

  const createProject = () => {
    if (!newProject.name) return;
    const ev = {
      id: Date.now(), ownerId: newProject.adminId || "sa",
      name: newProject.name, date: newProject.date || new Date().toISOString().slice(0,10),
      type: newProject.type, plan:"pro",
      roomShape:[{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:[], guests:[], constraints:[], menu:null,
    };
    setEvents(prev=>[...prev,ev]);
    if (newProject.adminId) setUsers(prev=>prev.map(u=>u.id===newProject.adminId?{...u,projectIds:[...(u.projectIds||[]),ev.id]}:u));
    setNewProject({name:"",date:"",type:"mariage",adminId:""});
    setShowNewProject(false);
  };

  const createUser = () => {
    if (!newUser.name||!newUser.email) return;
    setUsers(prev=>[...prev,{
      id:uid(), ...newUser,
      avatar: newUser.name.slice(0,2).toUpperCase(), projectIds:[],
      subscriptionStart: new Date().toISOString().slice(0,10),
      subscriptionEnd:   new Date(Date.now()+30*86400000).toISOString().slice(0,10),
    }]);
    setNewUser({name:"",email:"",role:"admin",plan:"free",subscriptionStatus:"trial"});
    setShowNewUser(false);
  };

  const saveStripeKeys = () => {
    localStorage.setItem("tm_stripe_pk", stripeKey);
    localStorage.setItem("tm_stripe_sk", stripeSecret);
    setShowStripeSetup(false);
  };

  const card = { background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"20px 24px" };

  return (
    <div style={{ minHeight:"100vh", background:C.dark, fontFamily:"'Inter','Segoe UI',sans-serif", color:"#ffffff" }}>

      {/* NAV */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100, gap:4 }}>
        <span style={{ fontSize:18, color:"#C9973A", fontWeight:800 }}>🪑 TableMaître</span>
        <Badge color={C.red} style={{marginLeft:8,fontSize:10}}>Super Admin</Badge>
        <div style={{flex:1}}/>
        {[["accounts","👥 Comptes"],["projects","📁 Projets"],["stats","📊 Stats"],["stripe","💳 Paiement"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            background:tab===id?C.gold+"22":"none", border:"none",
            color:tab===id?C.gold:"rgba(255,255,255,0.5)",
            padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          }}>{label}</button>
        ))}
        <div style={{width:1,height:24,background:C.border,margin:"0 12px"}}/>
        <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 24px" }}>

        {/* ── COMPTES ── */}
        {tab==="accounts" && (<>
          <div style={{ display:"flex", alignItems:"center", marginBottom:24, gap:12, flexWrap:"wrap" }}>
            <div style={{flex:1}}>
              <h2 style={{ margin:0, fontSize:24, fontWeight:700 }}>Comptes & Souscriptions</h2>
              <p style={{ color:"rgba(255,255,255,0.4)", margin:"4px 0 0", fontSize:13 }}>
                {filteredUsers.length} compte{filteredUsers.length>1?"s":""} · MRR : <strong style={{color:C.gold}}>{stats.mrr}€/mois</strong>
              </p>
            </div>
            <Btn onClick={()=>setShowNewUser(true)}>+ Nouveau compte</Btn>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..."
              style={{ flex:1, minWidth:200, padding:"8px 14px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"#fff", fontSize:13, outline:"none" }}/>
            <select value={filterPlan} onChange={e=>setFilterPlan(e.target.value)}
              style={{ padding:"8px 14px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"#fff", fontSize:13 }}>
              <option value="all">Tous les plans</option>
              {Object.entries(SUBSCRIPTION_PLANS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
              style={{ padding:"8px 14px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"#fff", fontSize:13 }}>
              <option value="all">Tous statuts</option>
              <option value="active">Actif</option>
              <option value="trial">Essai</option>
              <option value="expired">Expiré</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.1)", borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr auto", gap:12, padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
              <span>Compte</span><span>Plan</span><span>Statut</span><span>Fin</span><span>Projets</span><span>Invités</span><span>Actions</span>
            </div>
            {filteredUsers.length===0 && <div style={{padding:40,textAlign:"center",color:"rgba(255,255,255,0.3)"}}>Aucun compte trouvé</div>}
            {filteredUsers.map(u=>{
              const plan   = SUBSCRIPTION_PLANS[u.plan] || SUBSCRIPTION_PLANS.free;
              const sColor = STATUS_COLORS[u.subscriptionStatus] || STATUS_COLORS.trial;
              const soon   = u.subscriptionEnd && new Date(u.subscriptionEnd)<new Date(Date.now()+7*86400000);
              return (
                <div key={u.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr auto", gap:12, padding:"14px 20px", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:"50%",background:u.role==="superadmin"?C.red+"33":C.gold+"22",display:"flex",alignItems:"center",justifyContent:"center",color:u.role==="superadmin"?C.red:C.gold,fontSize:12,fontWeight:800,flexShrink:0 }}>{u.avatar||"?"}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:600}}>{u.name}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{u.email}</div>
                    </div>
                  </div>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:plan.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:plan.color,fontWeight:600}}>{plan.label}</span>
                  </span>
                  <span style={{display:"inline-block",padding:"3px 10px",borderRadius:99,background:sColor+"22",color:sColor,fontSize:11,fontWeight:700}}>
                    {u.subscriptionStatus==="active"?"✅ Actif":u.subscriptionStatus==="trial"?"⏳ Essai":u.subscriptionStatus==="expired"?"❌ Expiré":"⛔ Annulé"}
                  </span>
                  <span style={{fontSize:12,color:soon?"#F0C97A":"rgba(255,255,255,0.4)"}}>{u.subscriptionEnd?(soon?"⚠️ ":"")+u.subscriptionEnd:"—"}</span>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{u.projectCount}</span>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{u.guestCount}</span>
                  <div style={{display:"flex",gap:6}}>
                    {u.role!=="superadmin" && <>
                      <Btn small variant="ghost" onClick={()=>setShowSubscription(u)}>✏️</Btn>
                      <Btn small variant="danger" onClick={()=>setUsers(prev=>prev.filter(x=>x.id!==u.id))}>✕</Btn>
                    </>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:24 }}>
            {[{label:"Actifs",val:stats.activeSubscriptions,color:STATUS_COLORS.active},{label:"En essai",val:stats.trialUsers,color:STATUS_COLORS.trial},{label:"Plans payants",val:stats.proUsers,color:C.gold},{label:"MRR",val:stats.mrr+"€",color:C.gold}].map(s=>(
              <div key={s.label} style={{...card,textAlign:"center",padding:16}}>
                <div style={{fontSize:22,fontWeight:800,color:s.color}}>{s.val}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── PROJETS ── */}
        {tab==="projects" && (<>
          <div style={{display:"flex",alignItems:"center",marginBottom:28}}>
            <div><h2 style={{margin:0,fontSize:24,fontWeight:700}}>Tous les projets</h2><p style={{color:"rgba(255,255,255,0.4)",margin:"4px 0 0",fontSize:13}}>{events.length} projet{events.length>1?"s":""}</p></div>
            <div style={{flex:1}}/><Btn onClick={()=>setShowNewProject(true)}>+ Nouveau projet</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {events.map(ev=>{
              const owner=users.find(u=>u.id===ev.ownerId);
              const theme=THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
              return (
                <div key={ev.id} style={card}>
                  <div style={{display:"flex",alignItems:"start",gap:12,marginBottom:12}}>
                    <span style={{fontSize:28}}>{theme.icon}</span>
                    <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{ev.name}</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{ev.date}</div></div>
                    <Badge color={theme.color}>{theme.label}</Badge>
                  </div>
                  <div style={{display:"flex",gap:16,fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:12}}>
                    <span>🪑 {(ev.tables||[]).length} tables</span><span>👤 {(ev.guests||[]).length} invités</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:10,fontWeight:700}}>{owner?.avatar||"?"}</div>
                    <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{owner?.name||"Sans propriétaire"}</span>
                    <div style={{flex:1}}/>
                    <Btn small variant="danger" onClick={()=>setEvents(prev=>prev.filter(e=>e.id!==ev.id))}>Supprimer</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* ── STATS ── */}
        {tab==="stats" && (
          <div>
            <h2 style={{margin:"0 0 28px",fontSize:24,fontWeight:700}}>Tableau de bord</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:28}}>
              {[{label:"Utilisateurs",val:users.length,icon:"👥",color:C.blue},{label:"MRR",val:stats.mrr+"€",icon:"💰",color:C.gold},{label:"Projets",val:events.length,icon:"📁",color:C.gold},{label:"Invités",val:events.reduce((s,e)=>s+(e.guests||[]).length,0),icon:"👤",color:C.green},{label:"Plans payants",val:stats.proUsers,icon:"⭐",color:"#E8845A"},{label:"En essai",val:stats.trialUsers,icon:"⏳",color:STATUS_COLORS.trial}].map(s=>(
                <div key={s.label} style={card}><div style={{fontSize:24,marginBottom:8}}>{s.icon}</div><div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.val}</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:12,marginTop:4}}>{s.label}</div></div>
              ))}
            </div>
            <div style={{...card,marginBottom:20}}>
              <h3 style={{color:C.gold,margin:"0 0 16px",fontWeight:600,fontSize:15}}>Répartition par plan</h3>
              {Object.entries(SUBSCRIPTION_PLANS).map(([key,plan])=>{
                const count=enrichedUsers.filter(u=>u.plan===key).length;
                const pct=users.length>0?Math.round(count/users.length*100):0;
                return (
                  <div key={key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    <span style={{width:80,fontSize:13,color:plan.color,fontWeight:600}}>{plan.label}</span>
                    <div style={{flex:1,height:8,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{width:pct+"%",height:"100%",background:plan.color,borderRadius:99}}/>
                    </div>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",width:60,textAlign:"right"}}>{count} compte{count>1?"s":""}</span>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.25)",width:35}}>{pct}%</span>
                  </div>
                );
              })}
            </div>
            <div style={card}>
              <h3 style={{color:C.gold,margin:"0 0 16px",fontWeight:600,fontSize:15}}>🎟️ Codes promotionnels</h3>
              {Object.entries(VOUCHERS).map(([code,v])=>(
                <div key={code} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#13131e",borderRadius:10,marginBottom:8}}>
                  <span style={{fontFamily:"monospace",color:"#C9973A",fontWeight:700,fontSize:14,minWidth:120}}>{code}</span>
                  <span style={{color:"#fff",fontSize:13,flex:1}}>{v.description}</span>
                  <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>-{v.discount}%</span>
                  <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>max {v.maxUses}</span>
                </div>
              ))}
            </div>

            {/* Tunnel de conversion */}
            <div style={{...card,marginTop:20}}>
              <h3 style={{color:C.gold,margin:"0 0 16px",fontWeight:600,fontSize:15}}>📈 Tunnel de conversion</h3>
              {(()=>{
                const total=enrichedUsers.filter(u=>u.role!=="superadmin").length;
                const trial=enrichedUsers.filter(u=>u.subscriptionStatus==="trial").length;
                const paid=enrichedUsers.filter(u=>u.subscriptionStatus==="active"&&u.plan!=="free").length;
                const free=enrichedUsers.filter(u=>u.plan==="free").length;
                return [{label:"Inscrits",val:total,color:"#3b82f6"},{label:"En essai",val:trial,color:"#F0C97A"},{label:"Plan gratuit",val:free,color:"rgba(255,255,255,0.3)"},{label:"Payants",val:paid,color:"#27AE60"}].map(r=>(
                  <div key={r.label} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    <span style={{width:120,fontSize:13,color:"rgba(255,255,255,0.6)"}}>{r.label}</span>
                    <div style={{flex:1,height:8,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{width:(total>0?Math.round(r.val/total*100):0)+"%",height:"100%",background:r.color,borderRadius:99}}/>
                    </div>
                    <span style={{fontSize:13,color:r.color,fontWeight:700,minWidth:24,textAlign:"right"}}>{r.val}</span>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",minWidth:35}}>{total>0?Math.round(r.val/total*100):0}%</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* ── PAIEMENT ── */}
        {tab==="stripe" && (
          <div>
            <h2 style={{margin:"0 0 8px",fontSize:24,fontWeight:700}}>Intégration paiement</h2>
            <p style={{color:"rgba(255,255,255,0.4)",margin:"0 0 32px",fontSize:14}}>Configurez votre moyen de paiement pour encaisser vos clients.</p>

            {/* PayPal — recommandé pour démarrer */}
            <div style={{...card,marginBottom:20,border:"1px solid rgba(0,113,206,0.4)"}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                <div style={{width:48,height:48,borderRadius:12,background:"#003087",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🅿️</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:16}}>PayPal <span style={{fontSize:11,padding:"2px 8px",background:"rgba(0,113,206,0.2)",color:"#60a5fa",borderRadius:99,marginLeft:6}}>Recommandé</span></div>
                  <div style={{fontSize:12,color:paypalEmail?STATUS_COLORS.active:"rgba(255,255,255,0.4)",marginTop:2}}>{paypalEmail?"✅ Compte configuré : "+paypalEmail:"❌ Non configuré"}</div>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",textAlign:"right"}}>3,4% + 0,35€<br/>par transaction</div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <Field label="EMAIL PAYPAL *">
                  <Input value={paypalEmail} onChange={e=>setPaypalEmail(e.target.value)} placeholder="votre@email.com"/>
                </Field>
                <Field label="CLIENT ID PAYPAL (optionnel)">
                  <Input value={paypalClientId} onChange={e=>setPaypalClientId(e.target.value)} placeholder="AaBbCc..."/>
                </Field>
              </div>

              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Btn onClick={()=>{ localStorage.setItem("tm_paypal_email",paypalEmail); localStorage.setItem("tm_paypal_client_id",paypalClientId); alert("PayPal sauvegardé ✅"); }}>💾 Sauvegarder</Btn>
                <a href="https://www.paypal.com/signin" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost">Ouvrir PayPal →</Btn></a>
                <a href="https://www.paypal.com/buttons/smart" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost">Créer un bouton →</Btn></a>
              </div>

              {paypalEmail && (
                <div style={{marginTop:16,padding:"14px 16px",background:"rgba(0,113,206,0.06)",border:"1px solid rgba(0,113,206,0.2)",borderRadius:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#60a5fa",marginBottom:10}}>🔗 Liens de paiement rapide (à partager avec vos clients)</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {Object.entries(SUBSCRIPTION_PLANS).filter(([k])=>k!=="free").map(([key,plan])=>{
                      const link = "https://www.paypal.com/paypalme/"+paypalEmail.split("@")[0]+"/"+plan.price+"EUR";
                      return (
                        <div key={key} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{color:plan.color,fontWeight:700,minWidth:80,fontSize:13}}>{plan.label}</span>
                          <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",minWidth:50}}>{plan.price}€/mois</span>
                          <code style={{flex:1,fontSize:11,color:"rgba(255,255,255,0.6)",background:"#13131e",padding:"4px 8px",borderRadius:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link}</code>
                          <Btn small variant="ghost" onClick={()=>navigator.clipboard.writeText(link)}>📋</Btn>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:10}}>⚠️ Ces liens utilisent PayPal.me — activez votre compte PayPal.me sur paypal.com/paypalme</div>
                </div>
              )}
            </div>

            {/* Stripe */}
            <div style={{...card,marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:"#635bff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💳</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:16}}>Stripe</div>
                  <div style={{fontSize:12,color:stripeKey?STATUS_COLORS.active:"rgba(255,255,255,0.4)",marginTop:2}}>{stripeKey?"✅ Clés configurées":"Non configuré"}</div>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",textAlign:"right"}}>1,5% + 0,25€<br/>par transaction</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={()=>setShowStripeSetup(true)} variant="ghost">{stripeKey?"Modifier les clés":"Configurer Stripe"}</Btn>
                <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost">Stripe Dashboard →</Btn></a>
              </div>
            </div>

            <div style={{...card,marginBottom:20}}>
              <h3 style={{color:C.gold,margin:"0 0 20px",fontWeight:600,fontSize:15}}>Plans & tarifs</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                {Object.entries(SUBSCRIPTION_PLANS).map(([key,plan])=>(
                  <div key={key} style={{padding:20,borderRadius:12,border:"1px solid "+plan.color+"44",background:plan.color+"08"}}>
                    <div style={{color:plan.color,fontWeight:800,fontSize:16,marginBottom:4}}>{plan.label}</div>
                    <div style={{fontSize:24,fontWeight:800,marginBottom:8}}>{plan.price===0?"Gratuit":plan.price+"€"}<span style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:400}}>/mois</span></div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",display:"flex",flexDirection:"column",gap:4}}>
                      <span>📁 {plan.maxEvents===999?"Illimité":plan.maxEvents} projet{plan.maxEvents>1?"s":""}</span>
                      <span>👤 {plan.maxGuests===9999?"Illimité":plan.maxGuests} invités</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <h3 style={{color:C.gold,margin:"0 0 16px",fontWeight:600,fontSize:15}}>📋 Guide d'intégration</h3>
              <div style={{display:"flex",flexDirection:"column",gap:10,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>
                {[
                  ["1","Créez un compte sur stripe.com et récupérez vos clés API (Dashboard → Développeurs → Clés API)"],
                  ["2","Entrez vos clés dans le panneau \"Configurer Stripe\" ci-dessus"],
                  ["3","Créez un produit et des prix dans Stripe pour chaque plan (Starter 9€, Pro 29€, Enterprise 99€)"],
                  ["4","Créez des Liens de paiement Stripe et partagez-les avec vos utilisateurs"],
                  ["5","Configurez un Webhook Stripe pour mettre à jour automatiquement les statuts de souscription"],
                ].map(([n,text])=>(
                  <div key={n} style={{display:"flex",gap:12}}><span style={{color:C.gold,fontWeight:700,minWidth:20}}>{n}.</span><span>{text}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL souscription */}
      {showSubscription && (
        <Modal open={true} onClose={()=>setShowSubscription(null)} title={"Souscription — "+showSubscription.name} width={500}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{padding:"12px 16px",background:"#13131e",borderRadius:10,fontSize:13}}>
              <div style={{fontWeight:600}}>{showSubscription.name}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{showSubscription.email}</div>
            </div>
            <Field label="PLAN">
              <Select value={showSubscription.plan} onChange={e=>setShowSubscription({...showSubscription,plan:e.target.value})}>
                {Object.entries(SUBSCRIPTION_PLANS).map(([k,v])=><option key={k} value={k}>{v.label} — {v.price===0?"Gratuit":v.price+"€/mois"}</option>)}
              </Select>
            </Field>
            <Field label="STATUT">
              <Select value={showSubscription.subscriptionStatus} onChange={e=>setShowSubscription({...showSubscription,subscriptionStatus:e.target.value})}>
                <option value="active">✅ Actif</option>
                <option value="trial">⏳ Essai</option>
                <option value="expired">❌ Expiré</option>
                <option value="cancelled">⛔ Annulé</option>
              </Select>
            </Field>
            <Field label="DATE DE FIN">
              <Input type="date" value={showSubscription.subscriptionEnd||""} onChange={e=>setShowSubscription({...showSubscription,subscriptionEnd:e.target.value})}/>
            </Field>
            <Field label="STRIPE CUSTOMER ID">
              <Input value={showSubscription.stripeCustomerId||""} onChange={e=>setShowSubscription({...showSubscription,stripeCustomerId:e.target.value})} placeholder="cus_xxxxxxxxxxxxxxxxx"/>
            </Field>
            <Btn onClick={()=>{setUsers(prev=>prev.map(u=>u.id===showSubscription.id?{...u,plan:showSubscription.plan,subscriptionStatus:showSubscription.subscriptionStatus,subscriptionEnd:showSubscription.subscriptionEnd,stripeCustomerId:showSubscription.stripeCustomerId}:u));setShowSubscription(null);}}>Sauvegarder</Btn>
          </div>
        </Modal>
      )}

      {/* MODAL Stripe */}
      <Modal open={showStripeSetup} onClose={()=>setShowStripeSetup(false)} title="Configuration Stripe" width={500}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{padding:"10px 14px",background:"rgba(201,151,58,0.08)",border:"1px solid rgba(201,151,58,0.2)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.6)"}}>
            ⚠️ Clés stockées localement. Pour la production, configurez-les dans les variables d'environnement Vercel.
          </div>
          <Field label="CLÉ PUBLIQUE (pk_live_... ou pk_test_...)"><Input value={stripeKey} onChange={e=>setStripeKey(e.target.value)} placeholder="pk_live_xxxxxxxxxxxxx"/></Field>
          <Field label="CLÉ SECRÈTE (sk_live_... ou sk_test_...)"><Input type="password" value={stripeSecret} onChange={e=>setStripeSecret(e.target.value)} placeholder="sk_live_xxxxxxxxxxxxx"/></Field>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={saveStripeKeys} style={{flex:1}}>💾 Sauvegarder</Btn>
            <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost">Ouvrir Stripe →</Btn></a>
          </div>
        </div>
      </Modal>

      {/* MODAL nouveau projet */}
      <Modal open={showNewProject} onClose={()=>setShowNewProject(false)} title="Créer un nouveau projet">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="NOM *"><Input value={newProject.name} onChange={e=>setNewProject({...newProject,name:e.target.value})} placeholder="Mariage Dupont × Martin"/></Field>
          <Field label="DATE"><Input type="date" value={newProject.date} onChange={e=>setNewProject({...newProject,date:e.target.value})}/></Field>
          <Field label="TYPE">
            <Select value={newProject.type} onChange={e=>setNewProject({...newProject,type:e.target.value})}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </Select>
          </Field>
          <Field label="ADMIN">
            <Select value={newProject.adminId} onChange={e=>setNewProject({...newProject,adminId:e.target.value})}>
              <option value="">— Sans propriétaire —</option>
              {users.filter(u=>u.role==="admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
          </Field>
          <Btn onClick={createProject}>Créer</Btn>
        </div>
      </Modal>

      {/* MODAL nouvel utilisateur */}
      <Modal open={showNewUser} onClose={()=>setShowNewUser(false)} title="Créer un compte admin">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="NOM *"><Input value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})} placeholder="Marie Dupont"/></Field>
          <Field label="EMAIL *"><Input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} placeholder="marie@example.fr"/></Field>
          <Field label="PLAN">
            <Select value={newUser.plan} onChange={e=>setNewUser({...newUser,plan:e.target.value})}>
              {Object.entries(SUBSCRIPTION_PLANS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </Select>
          </Field>
          <Field label="STATUT">
            <Select value={newUser.subscriptionStatus} onChange={e=>setNewUser({...newUser,subscriptionStatus:e.target.value})}>
              <option value="trial">⏳ Essai</option>
              <option value="active">✅ Actif</option>
            </Select>
          </Field>
          <Btn onClick={createUser}>Créer le compte</Btn>
        </div>
      </Modal>
    </div>
  );
}

export default SuperAdminPanel;

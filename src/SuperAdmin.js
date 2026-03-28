/* eslint-disable */
import { useState, useEffect } from "react";
import { C, useI18n } from "../theme";
import { Btn, Badge, Modal, Field, Input, Select } from "./UI";
import { PLANS, INITIAL_USERS } from "../constants";
import { uid } from "../utils";

// ═══════════════════════════════════════════════════════════════
// SUPER ADMIN PANEL
// ═══════════════════════════════════════════════════════════════

function SuperAdminPanel({ events, setEvents, users, setUsers, onLogout }) {
  const { t } = useI18n();
  const [tab, setTab] = useState("projects"); // projects | users
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newProject, setNewProject] = useState({ name:"", date:"", type:"mariage", adminId:"" });
  const [newUser, setNewUser] = useState({ name:"", email:"", password:"", role:"admin" });

  const createProject = () => {
    if (!newProject.name) return;
    const ev = {
      id: Date.now(), ownerId: newProject.adminId || "sa",
      name: newProject.name, date: newProject.date || new Date().toISOString().slice(0,10),
      type: newProject.type, plan: "pro",
      roomShape:[{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:[], guests:[], constraints:[], menu:null,
    };
    setEvents(prev=>[...prev,ev]);
    if (newProject.adminId) {
      setUsers(prev=>prev.map(u=>u.id===newProject.adminId?{...u,projectIds:[...(u.projectIds||[]),ev.id]}:u));
    }
    setNewProject({name:"",date:"",type:"mariage",adminId:""});
    setShowNewProject(false);
  };

  const createUser = () => {
    if (!newUser.name||!newUser.email||!newUser.password) return;
    const u = { id:uid(), ...newUser, avatar:newUser.name.slice(0,2).toUpperCase(), projectIds:[] };
    setUsers(prev=>[...prev,u]);
    setNewUser({name:"",email:"",password:"",role:"admin"});
    setShowNewUser(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Nav */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:"#C9973A", letterSpacing:1 }}>🪑 TableMaître</span>
        <Badge color={C.red} style={{marginLeft:10}}>Super Admin</Badge>
        <div style={{flex:1}}/>
        {[["projects","📁 Projets"],["users","👥 Utilisateurs"],["stats","📊 Stats"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            background:tab===t?C.gold+"22":"none", border:"none", color:tab===t?C.gold:C.muted,
            padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          }}>{l}</button>
        ))}
        <div style={{width:1,height:24,background:C.border,margin:"0 12px"}}/>
        <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px" }}>
        {/* PROJECTS */}
        {tab==="projects" && (
          <>
            <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
              <div>
                <h2 style={{ margin:0, fontSize:26, fontWeight:400 }}>Tous les projets</h2>
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"4px 0 0", fontSize:13 }}>{events.length} projet{events.length>1?"s":""}</p>
              </div>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowNewProject(true)}>+ Nouveau projet</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {events.map(ev=>{
                const owner = users.find(u=>u.id===ev.ownerId);
                const theme = THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
                return (
                  <div key={ev.id} style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:16, padding:24, transition:"all .2s" }}>
                    <div style={{ display:"flex", alignItems:"start", gap:12, marginBottom:12 }}>
                      <span style={{ fontSize:28 }}>{theme.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{ color:"#ffffff", fontSize:16, marginBottom:2 }}>{ev.name}</div>
                        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{ev.date}</div>
                      </div>
                      <Badge color={theme.color}>{theme.label}</Badge>
                    </div>
                    <div style={{ display:"flex", gap:16, fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:12 }}>
                      <span>🪑 {ev.tables.length} tables</span>
                      <span>👤 {ev.guests.length} invités</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:24,height:24,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:10,fontWeight:700 }}>
                        {owner?.avatar||"?"}
                      </div>
                      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{owner?.name||"Sans propriétaire"}</span>
                      <div style={{flex:1}}/>
                      <Btn small variant="danger" onClick={()=>setEvents(prev=>prev.filter(e=>e.id!==ev.id))}>Supprimer</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* STATS */}
        {tab==="stats" && (
          <div>
            <h2 style={{ margin:"0 0 28px", fontSize:26, fontWeight:400 }}>Tableau de bord</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
              {[
                { label:"Projets total", val:events.length, icon:"📁", color:"#C9973A" },
                { label:"Utilisateurs", val:users.length, icon:"👥", color:C.blue },
                { label:"Invités total", val:events.reduce((s,e)=>s+e.guests.length,0), icon:"👤", color:C.green },
                { label:"Tables", val:events.reduce((s,e)=>s+e.tables.length,0), icon:"🪑", color:"#C9973A" },
                { label:"Projets Pro", val:events.filter(e=>e.plan==="pro").length, icon:"⭐", color:"#E8845A" },
                { label:"Projets Free", val:events.filter(e=>e.plan==="free").length, icon:"🆓", color:"rgba(255,255,255,0.45)" },
              ].map(s => (
                <div key={s.label} style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"20px 24px" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:16, padding:24 }}>
              <h3 style={{ color:"#C9973A", margin:"0 0 16px", fontWeight:400, fontSize:16 }}>🎟️ Codes promotionnels actifs</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {Object.entries(VOUCHERS).map(([code, v]) => (
                  <div key={code} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#13131e", borderRadius:10 }}>
                    <span style={{ fontFamily:"monospace", color:"#C9973A", fontWeight:700, fontSize:14, minWidth:120 }}>{code}</span>
                    <span style={{ color:"#ffffff", fontSize:13, flex:1 }}>{v.description}</span>
                    <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>-{v.discount}%</span>
                    <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>max {v.maxUses} utilisations</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==="users" && (
          <>
            <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
              <div>
                <h2 style={{ margin:0, fontSize:26, fontWeight:400 }}>Utilisateurs</h2>
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"4px 0 0", fontSize:13 }}>{users.length} comptes</p>
              </div>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowNewUser(true)}>+ Nouvel utilisateur</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {users.map(u=>(
                <div key={u.id} style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:42,height:42,borderRadius:"50%",background:u.role==="superadmin"?C.red+"33":C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:u.role==="superadmin"?C.red:C.gold,fontSize:15,fontWeight:700 }}>
                    {u.avatar}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{ color:"#ffffff", fontSize:15 }}>{u.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{u.email}</div>
                  </div>
                  <Badge color={u.role==="superadmin"?C.red:C.gold}>{u.role}</Badge>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>
                    {u.role!=="superadmin" && `${(u.projectIds||[]).length} projet${(u.projectIds||[]).length>1?"s":""}`}
                  </span>
                  {u.role!=="superadmin" && (
                    <Btn small variant="danger" onClick={()=>setUsers(prev=>prev.filter(x=>x.id!==u.id))}>Supprimer</Btn>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal new project */}
      <Modal open={showNewProject} onClose={()=>setShowNewProject(false)} title="Créer un nouveau projet">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÉVÉNEMENT *">
            <Input value={newProject.name} onChange={e=>setNewProject({...newProject,name:e.target.value})} placeholder="Mariage Dupont × Martin"/>
          </Field>
          <Field label={t.settingDate}>
            <Input type="date" value={newProject.date} onChange={e=>setNewProject({...newProject,date:e.target.value})}/>
          </Field>
          <Field label="TYPE D'ÉVÉNEMENT">
            <Select value={newProject.type} onChange={e=>setNewProject({...newProject,type:e.target.value})}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </Select>
          </Field>
          <Field label="ASSIGNER À UN ADMIN">
            <Select value={newProject.adminId} onChange={e=>setNewProject({...newProject,adminId:e.target.value})}>
              <option value="">— Sans propriétaire —</option>
              {users.filter(u=>u.role==="admin").map(u=><option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </Select>
          </Field>
          <Btn onClick={createProject} style={{marginTop:8}}>Créer le projet</Btn>
        </div>
      </Modal>

      {/* Modal new user */}
      <Modal open={showNewUser} onClose={()=>setShowNewUser(false)} title="Créer un utilisateur">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM COMPLET *">
            <Input value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})} placeholder="Marie Dupont"/>
          </Field>
          <Field label="EMAIL *">
            <Input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} placeholder="marie@example.fr"/>
          </Field>
          <Field label="MOT DE PASSE *">
            <Input type="password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} placeholder="Mot de passe temporaire"/>
          </Field>
          <Field label="RÔLE">
            <Select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
              <option value="admin">Admin Projet</option>
              <option value="superadmin">Super Admin</option>
            </Select>
          </Field>
          <Btn onClick={createUser} style={{marginTop:8}}>Créer l'utilisateur</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GUEST FORM (QR landing)
// ═══════════════════════════════════════════════════════════════


export default SuperAdminPanel;

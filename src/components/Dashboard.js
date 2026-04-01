
      {showOnboarding && (
        <OnboardingWizard
          onSkip={() => { setShowOnboarding(false); setShowNew(true); }}
          onComplete={(wizardData) => {
            setShowOnboarding(false);
            const ev = {
              id: Date.now(), ownerId: user.id,
              name: wizardData.name, date: wizardData.date,
              type: wizardData.type, plan: 'free',
              roomShape: wizardData.roomShape,
              tables: [], guests: [], constraints: [], menu: null,
            };
            setEvents(prev => [...prev, ev]);
            onOpenEvent(ev.id);
          }}
        />
      )}
      {showPricing && (
        <PricingPage
          user={user}
          onClose={() => setShowPricing(false)}
          onPlanSelected={(planId) => { setShowPricing(false); }}
        />
      )}
      {showOnboarding && (
        <OnboardingWizard
          onSkip={() => { setShowOnboarding(false); setShowNew(true); }}
          onComplete={(wizardData) => {
            setShowOnboarding(false);
            const ev = {
              id: Date.now(), ownerId: user.id,
              name: wizardData.name, date: wizardData.date,
              type: wizardData.type, plan: 'free',
              roomShape: wizardData.roomShape,
              tables: [], guests: [], constraints: [], menu: null,
            };
            setEvents(prev => [...prev, ev]);
            onOpenEvent(ev.id);
          }}
        />
      )}
      {showPricing && (
        <PricingPage
          user={user}
          onClose={()=>setShowPricing(false)}
          onPlanSelected={(planId)=>setShowPricing(false)}
        />
      )}
      {showVoucher && <VoucherModal onClose={() => setShowVoucher(false)} onApply={handleApplyVoucher} />}
      <div aria-live="polite" aria-atomic="true" style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:9999, pointerEvents:"none" }}>
        {saveToast && (
          <div style={{ background:"#1E1208", border:`1px solid ${C.green}`, borderRadius:10, padding:"10px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", fontSize:13, color:C.green }}>
            {t.savedCloud}
          </div>
        )}
      </div>

      {appliedVoucher && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#18182a", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 20px", zIndex:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          <span style={{fontSize:18}}>🎟️</span>
          <div>
            <div style={{color:C.green, fontSize:12, fontWeight:700}}>Code appliqué : {appliedVoucher.code}</div>
            <div style={{color:"rgba(255,255,255,0.45)", fontSize:11}}>{appliedVoucher.description}</div>
          </div>
          <button onClick={() => setAppliedVoucher(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16,padding:0}}>×</button>
        </div>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÉVÉNEMENT *"><Input value={newEv.name} onChange={e=>setNewEv({...newEv,name:e.target.value})} placeholder="Mariage Dupont × Martin"/></Field>
          <Field label={t.settingDate}><Input type="date" value={newEv.date} onChange={e=>setNewEv({...newEv,date:e.target.value})}/></Field>
          <Field label="TYPE D'ÉVÉNEMENT">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>setNewEv({...newEv,type:k})} style={{
                  padding:"10px 8px", borderRadius:10, border:`2px solid ${newEv.type===k?v.color:C.border}`,
                  background:newEv.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:newEv.type===k?v.color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12, fontWeight:700,
                  display:"flex", alignItems:"center", gap:6,
                }}><span style={{fontSize:16}}>{v.icon}</span> {v.label}</button>
              ))}
            </div>
          </Field>
          <Btn onClick={createEvent} style={{marginTop:4}}>Créer l'événement</Btn>
        </div>
      {/* ── BANDEAU SOUSCRIPTION ── */}


      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// FIREBASE HOOKS
// ═══════════════════════════════════════════════════════════════


export default Dashboard;

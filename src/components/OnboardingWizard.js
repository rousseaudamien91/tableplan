/* eslint-disable */
// ═══════════════════════════════════════════════════════════════
// ONBOARDING WIZARD — Création d'événement guidée en 4 étapes
// Étape 1 : Type d'événement
// Étape 2 : Nom + Date
// Étape 3 : Nombre d'invités estimé
// Étape 4 : Template de salle
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { C } from "../theme";
import { THEMES_CONFIG } from "../constants";

const EVENT_TYPES = Object.entries(THEMES_CONFIG).map(([id, v]) => ({ id, ...v }));

const TEMPLATES = [
  {
    id: "rect",
    label: "Salle rectangulaire",
    icon: "▬",
    desc: "Idéal pour banquets et conférences",
    shape: [{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
  },
  {
    id: "u",
    label: "Disposition en U",
    icon: "⊓",
    desc: "Parfait pour séminaires et ateliers",
    shape: [{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:500,y:520},{x:500,y:300},{x:300,y:300},{x:300,y:520},{x:60,y:520}],
  },
  {
    id: "l",
    label: "Salle en L",
    icon: "⌐",
    desc: "Pour espaces atypiques",
    shape: [{x:60,y:60},{x:740,y:60},{x:740,y:300},{x:400,y:300},{x:400,y:520},{x:60,y:520}],
  },
  {
    id: "round",
    label: "Salle ronde",
    icon: "⬡",
    desc: "Ambiance cosy, tables rondes",
    shape: Array.from({length:8}, (_,i) => {
      const a = i*Math.PI*2/8 - Math.PI/2;
      return { x: Math.round(400 + 280*Math.cos(a)), y: Math.round(290 + 220*Math.sin(a)) };
    }),
  },
  {
    id: "blank",
    label: "Partir de zéro",
    icon: "✏️",
    desc: "Dessiner ma propre salle",
    shape: [{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
  },
];

const GUEST_RANGES = [
  { label: "< 10 invités",    value: 5,   icon: "👤" },
  { label: "10 – 50 invités", value: 30,  icon: "👥" },
  { label: "50 – 100 invités",value: 75,  icon: "👨‍👩‍👧‍👦" },
  { label: "100 – 200 invités",value:150,  icon: "🎉" },
  { label: "> 200 invités",   value: 250, icon: "🏟️" },
];

function OnboardingWizard({ onComplete, onSkip }) {
  const [step, setStep]   = useState(1);
  const [data, setData]   = useState({
    type: '', name: '', date: '', guestRange: null, template: 'rect',
  });

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));

  const canNext = () => {
    if (step === 1) return !!data.type;
    if (step === 2) return !!data.name.trim();
    if (step === 3) return data.guestRange !== null;
    return true;
  };

  const finish = () => {
    const tpl = TEMPLATES.find(t => t.id === data.template);
    onComplete({
      name: data.name.trim() || 'Mon événement',
      date: data.date || new Date().toISOString().slice(0,10),
      type: data.type,
      roomShape: tpl?.shape || TEMPLATES[0].shape,
      estimatedGuests: data.guestRange,
    });
  };

  const dot = (n) => (
    <div key={n} style={{
      width: n === step ? 24 : 8, height: 8, borderRadius: 99,
      background: n <= step ? C.gold : 'rgba(255,255,255,0.15)',
      transition: 'all .3s',
    }}/>
  );

  const cardBtn = (selected, onClick, children) => (
    <button onClick={onClick} style={{
      background: selected ? C.gold+'22' : '#13131e',
      border: `2px solid ${selected ? C.gold : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 14, padding: '16px 12px', cursor: 'pointer',
      color: selected ? C.gold : 'rgba(255,255,255,0.7)',
      fontFamily: 'inherit', transition: 'all .15s', textAlign: 'center',
      transform: selected ? 'scale(1.03)' : '',
    }}>
      {children}
    </button>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(12px)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ maxWidth: 640, width: '100%', background: '#18182a', borderRadius: 24, padding: '40px 36px', border: '1px solid rgba(201,151,58,0.15)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[1,2,3,4].map(dot)}
          </div>
          <button onClick={onSkip} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>
            Passer →
          </button>
        </div>

        {/* Étape 1 : Type */}
        {step === 1 && (
          <>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#fff' }}>Quel type d'événement ?</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', fontSize: 14 }}>Choisissez pour personnaliser votre espace</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12 }}>
              {EVENT_TYPES.map(t => cardBtn(data.type === t.id, () => { set('type', t.id); setTimeout(() => setStep(2), 200); },
                <><div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div><div style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</div></>
              ))}
            </div>
          </>
        )}

        {/* Étape 2 : Nom + Date */}
        {step === 2 && (
          <>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#fff' }}>Nommez votre événement</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', fontSize: 14 }}>Vous pourrez modifier ces informations plus tard</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>NOM DE L'ÉVÉNEMENT *</label>
                <input value={data.name} onChange={e => set('name', e.target.value)}
                  placeholder={THEMES_CONFIG[data.type]?.icon + ' ' + (THEMES_CONFIG[data.type]?.label || 'Mon événement')}
                  style={{ width: '100%', padding: '12px 16px', background: '#13131e', border: '1px solid rgba(201,151,58,0.2)', borderRadius: 10, color: '#fff', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && canNext() && setStep(3)}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>DATE</label>
                <input type="date" value={data.date} onChange={e => set('date', e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#13131e', border: '1px solid rgba(201,151,58,0.2)', borderRadius: 10, color: '#fff', fontSize: 15, fontFamily: 'inherit', outline: 'none', colorScheme: 'dark', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </>
        )}

        {/* Étape 3 : Nombre d'invités */}
        {step === 3 && (
          <>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#fff' }}>Combien d'invités ?</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', fontSize: 14 }}>Une estimation suffit pour préparer votre salle</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GUEST_RANGES.map(r => cardBtn(data.guestRange === r.value, () => { set('guestRange', r.value); setTimeout(() => setStep(4), 200); },
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <span style={{ fontSize: 24 }}>{r.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Étape 4 : Template */}
        {step === 4 && (
          <>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#fff' }}>Choisissez un plan de salle</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', fontSize: 14 }}>Vous pourrez personnaliser la forme librement ensuite</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 12 }}>
              {TEMPLATES.map(t => cardBtn(data.template === t.id, () => set('template', t.id),
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.desc}</div>
                </>
              ))}
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s-1)} style={{
              padding: '12px 24px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
            }}>← Retour</button>
          )}
          <button onClick={() => step < 4 ? setStep(s => s+1) : finish()}
            disabled={!canNext()}
            style={{
              flex: 1, padding: '14px', background: canNext() ? `linear-gradient(135deg,${C.gold},#F0C97A)` : 'rgba(255,255,255,0.08)',
              border: 'none', borderRadius: 10, cursor: canNext() ? 'pointer' : 'not-allowed',
              color: canNext() ? '#0d0d14' : 'rgba(255,255,255,0.3)',
              fontWeight: 800, fontSize: 15, fontFamily: 'inherit', transition: 'all .2s',
            }}>
            {step < 4 ? 'Continuer →' : '🚀 Créer mon événement'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingWizard;

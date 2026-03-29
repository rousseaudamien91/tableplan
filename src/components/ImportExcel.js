/* eslint-disable */
import { useState, useRef } from "react";
import { C } from "../theme";
import { Btn, Modal } from "./UI";

// ═══════════════════════════════════════════════════════════════
// IMPORT EXCEL / CSV — Modal d'import d'invités
// Supporte .csv et .txt (XLSX non supporté sans librairie externe)
// ═══════════════════════════════════════════════════════════════

const COL_KEYWORDS = {
  name:  ["nom","name","prénom","prenom","firstname","lastname","invité","guest","full"],
  email: ["email","mail","e-mail","courriel"],
  diet:  ["régime","regime","diet","alimentation","food","repas"],
  table: ["table","numéro table","table number"],
  notes: ["notes","note","remarque","commentaire","info"],
  phone: ["téléphone","telephone","phone","mobile","portable"],
};

const DIET_MAP = {
  "végétarien":"vegetarian","vegetarian":"vegetarian","vegan":"vegan","végétalien":"vegan",
  "halal":"halal","casher":"kosher","kosher":"kosher","sans gluten":"glutenfree",
  "gluten free":"glutenfree","sans lactose":"lactosefree","standard":"standard","normal":"standard",
};

function detectCol(headers, type) {
  const kw = COL_KEYWORDS[type] || [];
  return headers.findIndex(h => kw.some(k => h.toLowerCase().trim().includes(k)));
}

function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return [];
  const sep = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(sep).map(h => h.replace(/^["']|["']$/g,'').trim());
  return lines.slice(1).map(line => {
    const vals = line.split(sep).map(v => v.replace(/^["']|["']$/g,'').trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  }).filter(r => Object.values(r).some(v => v));
}

function rowsToGuests(rows) {
  if (!rows.length) return [];
  const headers = Object.keys(rows[0]);
  const cName  = detectCol(headers, 'name');
  const cEmail = detectCol(headers, 'email');
  const cDiet  = detectCol(headers, 'diet');
  const cTable = detectCol(headers, 'table');
  const cNotes = detectCol(headers, 'notes');
  const cPhone = detectCol(headers, 'phone');

  return rows.map((row, idx) => {
    const vals = Object.values(row);
    const rawName = cName >= 0 ? vals[cName] : vals[0] || '';
    const rawDiet = cDiet >= 0 ? vals[cDiet] : '';
    const dietKey = DIET_MAP[rawDiet.toLowerCase()] || 'standard';
    return {
      id: Date.now() + idx,
      name:      rawName.trim(),
      email:     cEmail >= 0 ? vals[cEmail].trim() : '',
      diet:      dietKey,
      notes:     cNotes >= 0 ? vals[cNotes].trim() : '',
      phone:     cPhone >= 0 ? vals[cPhone].trim() : '',
      tableHint: cTable >= 0 ? vals[cTable].trim() : '',
      allergies: [],
      rsvp:      'pending',
      tableId:   null,
    };
  }).filter(g => g.name);
}

function ImportModal({ open, onClose, onImport, existingGuests }) {
  var existing = existingGuests || [];
  const [step, setStep]       = useState('upload');
  const [guests, setGuests]   = useState([]);
  const [duplicates, setDups] = useState([]);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function reset() { setStep('upload'); setGuests([]); setDups([]); setError(''); }

  function handleClose() { reset(); onClose(); }

  function finalize(imported) {
    if (!imported.length) { setError('Aucun invité trouvé dans le fichier.'); return; }
    const existNames = new Set(existing.map(g => g.name.toLowerCase().trim()));
    const dups = imported.filter(g => existNames.has(g.name.toLowerCase().trim()));
    setDups(dups);
    setGuests(imported);
    setStep('preview');
  }

  function handleFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    setError('');
    setLoading(true);
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'xlsx' || ext === 'xls') {
      setLoading(false);
      setError('Format .xlsx non supporté directement. Exportez en .csv depuis Excel (Fichier → Enregistrer sous → CSV).');
      return;
    }
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var parsed = parseCsvText(ev.target.result);
        var imported = rowsToGuests(parsed);
        finalize(imported);
      } catch(err) {
        setError('Erreur de lecture : ' + err.message);
      }
      setLoading(false);
    };
    reader.onerror = function() { setError('Impossible de lire le fichier.'); setLoading(false); };
    reader.readAsText(file, 'UTF-8');
  }

  function doImport(skipDups) {
    var toImport = skipDups
      ? guests.filter(g => !duplicates.find(d => d.name === g.name))
      : guests;
    onImport(toImport);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="📥 Importer des invités" width={580}>
      {step === 'upload' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Zone de drop */}
          <div
            onClick={function() { fileRef.current && fileRef.current.click(); }}
            style={{
              border:'2px dashed rgba(201,151,58,0.3)', borderRadius:14,
              padding:'40px 20px', textAlign:'center', cursor:'pointer',
              background:'rgba(201,151,58,0.04)',
            }}
          >
            <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#ffffff', marginBottom:6 }}>
              Cliquez pour sélectionner un fichier
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:8 }}>
              Formats supportés : .csv · .txt
            </div>
          </div>
          <input
            ref={fileRef} type="file" accept=".csv,.txt"
            style={{ display:'none' }} onChange={handleFile}
          />

          {loading && <div style={{ textAlign:'center', color:C.gold }}>⏳ Lecture...</div>}
          {error && (
            <div style={{ color:'#e05252', fontSize:13, padding:'10px 14px', background:'rgba(224,82,82,0.1)', borderRadius:8 }}>
              ❌ {error}
            </div>
          )}

          {/* Guide */}
          <div style={{ background:'#13131e', borderRadius:10, padding:'14px 16px', fontSize:12, color:'rgba(255,255,255,0.5)' }}>
            <div style={{ color:C.gold, fontWeight:700, marginBottom:8 }}>📋 Format attendu (CSV)</div>
            <code style={{ color:'#ffffff', display:'block', marginBottom:4 }}>Nom,Email,Régime,Table,Notes</code>
            <code style={{ color:'rgba(255,255,255,0.6)', display:'block' }}>Dupont Marie,marie@ex.fr,standard,1,VIP</code>
            <div style={{ marginTop:8 }}>Colonnes détectées auto : nom, email, régime, table, notes, téléphone</div>
          </div>

          {/* Modèle CSV à télécharger */}
          <a
            href={"data:text/csv;charset=utf-8,Nom,Email,R%C3%A9gime,Table,Notes%0ADupont%20Marie,marie@ex.fr,standard,1,VIP%0AMartin%20Paul,paul@ex.fr,v%C3%A9g%C3%A9tarien,2,"}
            download="modele_invites.csv"
            style={{ textDecoration:'none', textAlign:'center' }}
          >
            <Btn variant="ghost" small>⬇ Télécharger le modèle CSV</Btn>
          </a>
        </div>
      )}

      {step === 'preview' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <div style={{ padding:'10px 16px', background:'rgba(39,174,96,0.1)', border:'1px solid rgba(39,174,96,0.3)', borderRadius:10, fontSize:13 }}>
              ✅ <strong style={{ color:'#27AE60' }}>{guests.length}</strong> invités détectés
            </div>
            {duplicates.length > 0 && (
              <div style={{ padding:'10px 16px', background:'rgba(240,201,122,0.1)', border:'1px solid rgba(240,201,122,0.3)', borderRadius:10, fontSize:13 }}>
                ⚠️ <strong style={{ color:'#F0C97A' }}>{duplicates.length}</strong> doublons
              </div>
            )}
          </div>

          {/* Aperçu */}
          <div style={{ maxHeight:260, overflowY:'auto', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#13131e', position:'sticky', top:0 }}>
                  {['Nom','Email','Régime','Table','Notes'].map(function(h) {
                    return (
                      <th key={h} style={{ padding:'8px 12px', textAlign:'left', color:'rgba(255,255,255,0.4)', fontWeight:600, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {guests.map(function(g, i) {
                  var isDup = duplicates.find(function(d) { return d.name === g.name; });
                  return (
                    <tr key={i} style={{ background: isDup ? 'rgba(240,201,122,0.05)' : i%2===0 ? '#18182a' : '#13131e' }}>
                      <td style={{ padding:'7px 12px', color: isDup ? '#F0C97A' : '#ffffff' }}>{isDup ? '⚠️ ' : ''}{g.name}</td>
                      <td style={{ padding:'7px 12px', color:'rgba(255,255,255,0.5)' }}>{g.email}</td>
                      <td style={{ padding:'7px 12px', color:'rgba(255,255,255,0.5)' }}>{g.diet}</td>
                      <td style={{ padding:'7px 12px', color:'rgba(255,255,255,0.5)' }}>{g.tableHint}</td>
                      <td style={{ padding:'7px 12px', color:'rgba(255,255,255,0.5)' }}>{g.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <Btn variant="ghost" onClick={reset}>← Recommencer</Btn>
            {duplicates.length > 0 && (
              <Btn variant="ghost" onClick={function() { doImport(false); }}>
                Tout importer ({guests.length})
              </Btn>
            )}
            <Btn onClick={function() { doImport(true); }} style={{ flex:1 }}>
              ✅ Importer {duplicates.length > 0 ? 'sans doublons (' + (guests.length - duplicates.length) + ')' : guests.length + ' invités'}
            </Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ImportModal;

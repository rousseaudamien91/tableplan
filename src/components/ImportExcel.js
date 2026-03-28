/* eslint-disable */
// ═══════════════════════════════════════════════════════════════
// IMPORT EXCEL / CSV — Composant modal d'import d'invités
// Supporte .xlsx, .xls, .csv
// Colonnes détectées automatiquement : Nom, Prénom, Email, Régime, Table, Notes
// ═══════════════════════════════════════════════════════════════
import { useState, useRef } from "react";
import { C } from "../theme";
import { Btn, Modal } from "./UI";

// Mapping des colonnes possibles
const COL_MAP = {
  name:  ["nom","name","prénom","prenom","firstname","lastname","invité","guest","full name","fullname"],
  email: ["email","mail","e-mail","courriel"],
  diet:  ["régime","regime","diet","alimentation","food","repas"],
  table: ["table","tablename","numéro table","table number"],
  notes: ["notes","note","remarque","remarques","commentaire","info"],
  phone: ["téléphone","telephone","phone","mobile","portable","tel"],
};

const DIET_MAP = {
  "végétarien": "vegetarian", "vegetarian": "vegetarian", "vegan": "vegan", "végétalien": "vegan",
  "halal": "halal", "casher": "kosher", "kosher": "kosher", "sans gluten": "glutenfree",
  "gluten free": "glutenfree", "sans lactose": "lactosefree", "allergie": "allergy",
  "standard": "standard", "normal": "standard",
};

function detectColumn(headers, type) {
  const keywords = COL_MAP[type] || [];
  return headers.findIndex(h => keywords.some(k => h.toLowerCase().trim().includes(k)));
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return [];
  // Détecter le séparateur (virgule, point-virgule, tab)
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
  const colName  = detectColumn(headers, 'name');
  const colEmail = detectColumn(headers, 'email');
  const colDiet  = detectColumn(headers, 'diet');
  const colTable = detectColumn(headers, 'table');
  const colNotes = detectColumn(headers, 'notes');
  const colPhone = detectColumn(headers, 'phone');

  return rows.map((row, idx) => {
    const vals = Object.values(row);
    const rawName  = colName  >= 0 ? vals[colName]  : vals[0] || '';
    const rawDiet  = colDiet  >= 0 ? vals[colDiet]  : '';
    const dietKey  = DIET_MAP[rawDiet.toLowerCase()] || 'standard';
    return {
      id: Date.now() + idx,
      name:    rawName.trim(),
      email:   colEmail >= 0 ? vals[colEmail].trim()  : '',
      diet:    dietKey,
      notes:   colNotes >= 0 ? vals[colNotes].trim()  : '',
      phone:   colPhone >= 0 ? vals[colPhone].trim()  : '',
      tableHint: colTable >= 0 ? vals[colTable].trim() : '',
      allergies: [],
      rsvp: 'pending',
      tableId: null,
    };
  }).filter(g => g.name);
}

function ImportModal({ open, onClose, onImport, existingGuests = [] }) {
  const [step, setStep]       = useState('upload'); // upload | preview | done
  const [rows, setRows]       = useState([]);
  const [guests, setGuests]   = useState([]);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const fileRef = useRef();

  const reset = () => { setStep('upload'); setRows([]); setGuests([]); setError(''); setDuplicates([]); };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'csv' || ext === 'txt') {
        const text = await file.text();
        const parsed = parseCSV(text);
        const imported = rowsToGuests(parsed);
        finalize(imported);
      } else if (ext === 'xlsx' || ext === 'xls') {
        // Lecture XLSX via FileReader + parsing manuel basique
        const ab = await file.arrayBuffer();
        // Parser XLSX simplifié (format ZIP + XML)
        const parsed = await parseXLSX(ab);
        const imported = rowsToGuests(parsed);
        finalize(imported);
      } else {
        setError('Format non supporté. Utilisez .csv, .xlsx ou .xls');
      }
    } catch(err) {
      setError('Erreur de lecture : ' + err.message);
    }
    setLoading(false);
  };

  async function parseXLSX(ab) {
    // Décompresser le ZIP
    try {
      const { default: JSZip } = await import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js').catch(() => ({ default: null }));
      if (!JSZip) throw new Error('JSZip non disponible');
      const zip = await JSZip.loadAsync(ab);
      const sheetXML = await zip.file('xl/worksheets/sheet1.xml')?.async('text');
      const sharedXML = await zip.file('xl/sharedStrings.xml')?.async('text');
      if (!sheetXML) throw new Error('Feuille introuvable');

      // Parser les strings partagées
      const strings = [];
      if (sharedXML) {
        const matches = sharedXML.matchAll(/<t[^>]*>([^<]*)<\/t>/g);
        for (const m of matches) strings.push(m[1]);
      }

      // Parser les cellules
      const rows = {};
      const cellMatches = sheetXML.matchAll(/<c r="([A-Z]+)(\d+)"[^>]*t="([^"]*)"[^>]*><v>(\d+)<\/v><\/c>|<c r="([A-Z]+)(\d+)"[^>]*><v>([^<]*)<\/v><\/c>/g);
      for (const m of cellMatches) {
        const col = m[1] || m[5];
        const row = parseInt(m[2] || m[6]);
        const type = m[3] || '';
        const val  = m[4] || m[7] || '';
        const cellVal = type === 's' ? (strings[parseInt(val)] || '') : val;
        if (!rows[row]) rows[row] = {};
        rows[row][col] = cellVal;
      }

      const rowNums = Object.keys(rows).map(Number).sort((a,b) => a-b);
      if (!rowNums.length) return [];
      const headerRow = rows[rowNums[0]];
      const headers = Object.values(headerRow);
      return rowNums.slice(1).map(n => {
        const obj = {};
        Object.keys(headerRow).forEach((col, i) => { obj[headers[i]] = rows[n]?.[col] || ''; });
        return obj;
      });
    } catch {
      // Fallback: traiter comme CSV si le parsing XLSX échoue
      const text = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(ab));
      return parseCSV(text);
    }
  }

  function finalize(imported) {
    if (!imported.length) { setError('Aucun invité trouvé dans le fichier.'); return; }
    // Détecter les doublons
    const existingNames = new Set(existingGuests.map(g => g.name.toLowerCase().trim()));
    const dups = imported.filter(g => existingNames.has(g.name.toLowerCase().trim()));
    setDuplicates(dups);
    setGuests(imported);
    setStep('preview');
  }

  const handleImport = (skipDuplicates = true) => {
    const toImport = skipDuplicates
      ? guests.filter(g => !duplicates.find(d => d.name === g.name))
      : guests;
    onImport(toImport);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="📥 Importer des invités" width={600}>
      {step === 'upload' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Zone de drop */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.gold; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,151,58,0.2)'; }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'rgba(201,151,58,0.2)';
              const f = e.dataTransfer.files[0];
              if (f) { const inp = fileRef.current; inp.files = e.dataTransfer.files; handleFile({ target: inp }); }
            }}
            style={{
              border: '2px dashed rgba(201,151,58,0.3)', borderRadius:14,
              padding:'40px 20px', textAlign:'center', cursor:'pointer',
              background:'rgba(201,151,58,0.04)', transition:'border-color .2s',
            }}
          >
            <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#ffffff', marginBottom:6 }}>
              Glissez votre fichier ici
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
              ou cliquez pour sélectionner
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:8 }}>
              Formats supportés : .csv · .xlsx · .xls
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" style={{ display:'none' }} onChange={handleFile}/>

          {loading && <div style={{ textAlign:'center', color:C.gold }}>⏳ Lecture en cours...</div>}
          {error && <div style={{ color:'#e05252', fontSize:13, padding:'10px 14px', background:'rgba(224,82,82,0.1)', borderRadius:8 }}>❌ {error}</div>}

          {/* Guide colonnes */}
          <div style={{ background:'#13131e', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:12, color:C.gold, fontWeight:700, marginBottom:10 }}>📋 Colonnes reconnues automatiquement</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:12, color:'rgba(255,255,255,0.5)' }}>
              {Object.entries(COL_MAP).map(([type, keys]) => (
                <div key={type}>
                  <span style={{ color:'rgba(255,255,255,0.7)', fontWeight:600 }}>{type}</span>
                  {' → '}{keys.slice(0,3).join(', ')}
                </div>
              ))}
            </div>
          </div>

          <a href="data:text/csv;charset=utf-8,Nom,Email,R%C3%A9gime,Table,Notes%0ADupont Marie,marie@ex.fr,standard,1,VIP%0AMartin Paul,paul@ex.fr,v%C3%A9g%C3%A9tarien,2,"
            download="modele_import_invites.csv"
            style={{ textDecoration:'none', display:'block', textAlign:'center' }}>
            <Btn variant="ghost" small>⬇ Télécharger le modèle CSV</Btn>
          </a>
        </div>
      )}

      {step === 'preview' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <div style={{ padding:'12px 20px', background:'rgba(39,174,96,0.1)', border:'1px solid rgba(39,174,96,0.3)', borderRadius:10, fontSize:13 }}>
              ✅ <strong style={{ color:'#27AE60' }}>{guests.length}</strong> invités détectés
            </div>
            {duplicates.length > 0 && (
              <div style={{ padding:'12px 20px', background:'rgba(240,201,122,0.1)', border:'1px solid rgba(240,201,122,0.3)', borderRadius:10, fontSize:13 }}>
                ⚠️ <strong style={{ color:'#F0C97A' }}>{duplicates.length}</strong> doublons
              </div>
            )}
          </div>

          {/* Aperçu */}
          <div style={{ maxHeight:280, overflowY:'auto', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#13131e', position:'sticky', top:0 }}>
                  {['Nom','Email','Régime','Table','Notes'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', color:'rgba(255,255,255,0.4)', fontWeight:600, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guests.map((g, i) => {
                  const isDup = duplicates.find(d => d.name === g.name);
                  return (
                    <tr key={i} style={{ background: isDup ? 'rgba(240,201,122,0.05)' : i%2===0 ? '#18182a' : '#13131e' }}>
                      <td style={{ padding:'7px 12px', color: isDup ? '#F0C97A' : '#ffffff' }}>
                        {isDup ? '⚠️ ' : ''}{g.name}
                      </td>
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
              <Btn variant="ghost" onClick={() => handleImport(false)}>
                Importer tout ({guests.length})
              </Btn>
            )}
            <Btn onClick={() => handleImport(true)} style={{ flex:1 }}>
              ✅ Importer {duplicates.length > 0 ? `sans doublons (${guests.length - duplicates.length})` : `${guests.length} invités`}
            </Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ImportModal;

// Vercel Serverless Function — assistant IA de TableMaître (proxy vers l'API Anthropic).
// Variables d'environnement Vercel : ANTHROPIC_API_KEY (obligatoire), AI_MODEL (facultatif).
//
// Sécurité :
// - réservé aux utilisateurs connectés : le jeton Firebase (Authorization: Bearer …) est vérifié
//   avec les clés publiques de Google (signature, émetteur, audience, expiration) ;
// - le serveur impose le modèle et la longueur de réponse : le navigateur ne choisit rien ;
// - pas d'en-tête CORS : seul le site lui-même peut appeler cette route depuis un navigateur.
import { createRemoteJWKSet, jwtVerify } from "jose";

const PROJECT_ID = "tableplan-c4a6b";
const JWKS = createRemoteJWKSet(new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
));
const MODEL        = process.env.AI_MODEL || "claude-haiku-4-5";
const MAX_TOKENS   = 800;
const MAX_MESSAGES = 20;
const MAX_CHARS    = 4000;

async function utilisateur(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!m) return null;
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer: "https://securetoken.google.com/" + PROJECT_ID,
      audience: PROJECT_ID,
    });
    return payload.sub ? payload : null;
  } catch (e) {
    return null;
  }
}

function texte(x, max) {
  return typeof x === "string" ? x.slice(0, max) : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Méthode non autorisée" }); return; }

  const user = await utilisateur(req);
  if (!user) { res.status(401).json({ error: "Connexion requise" }); return; }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(503).json({ error: "Assistant IA non configuré" }); return; }

  const body = req.body || {};
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-MAX_MESSAGES)
    .filter(m => m && (m.role === "user" || m.role === "assistant"))
    .map(m => ({ role: m.role, content: texte(m.content, MAX_CHARS) }))
    .filter(m => m.content);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    res.status(400).json({ error: "Message manquant" }); return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: texte(body.system, 12000),
        messages,
        metadata: { user_id: String(user.sub).slice(0, 64) },
      }),
    });
    const data = await response.json();
    if (!response.ok) { res.status(502).json({ error: "Erreur du service IA" }); return; }
    res.status(200).json({ content: data.content });
  } catch (e) {
    res.status(502).json({ error: "Service IA injoignable" });
  }
}

// src/setupProxy.js
// Proxy CRA pour router /api/* vers un serveur local en dev
// En production (Vercel), les routes /api/* sont gérées nativement

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  // En dev local, on n'a pas de serveur Vercel — on simule avec un mock
  // Pour l'agent IA, on appelle directement l'API Anthropic via un middleware Express
  app.use("/api/ai", async (req, res) => {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(200).end();
      return;
    }
    try {
      const fetch = require("node-fetch");
      const apiKey = process.env.ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "ANTHROPIC_API_KEY non définie. Ajoutez-la dans un fichier .env à la racine." });
        return;
      }
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.status(response.status).json(data);
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
  });
};

# 🚀 Déploiement TableMaître sur Vercel

## Prérequis (à installer une seule fois)

1. **Node.js** → https://nodejs.org (télécharge la version LTS)
2. **Un compte GitHub gratuit** → https://github.com
3. **Un compte Vercel gratuit** → https://vercel.com (connecte-toi avec GitHub)

---

## Étape 1 — Installer Git (si pas déjà fait)

- **Windows** : https://git-scm.com/download/win
- **Mac** : `xcode-select --install` dans le Terminal
- **Linux** : `sudo apt install git`

---

## Étape 2 — Ouvrir un terminal dans ce dossier

- **Windows** : clic droit dans le dossier → "Ouvrir dans Terminal"
- **Mac/Linux** : ouvre le Terminal, puis `cd chemin/vers/tableplan`

---

## Étape 3 — Initialiser Git et pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit – TableMaître"
```

Puis va sur https://github.com/new, crée un repo nommé **tableplan** (privé ou public), et suis les instructions affichées par GitHub pour lier ton dépôt local.

```bash
git remote add origin https://github.com/TON_USERNAME/tableplan.git
git branch -M main
git push -u origin main
```

---

## Étape 4 — Déployer sur Vercel

1. Va sur https://vercel.com/new
2. Clique **"Import Git Repository"**
3. Sélectionne ton repo **tableplan**
4. Laisse tous les paramètres par défaut (Vercel détecte automatiquement React)
5. Clique **Deploy** 🚀

En ~2 minutes tu reçois une URL du type :
**https://tableplan-xyz.vercel.app**

---

## Étape 5 — Mettre à jour l'app (plus tard)

À chaque modification, il suffit de :

```bash
git add .
git commit -m "Mise à jour"
git push
```

Vercel redéploie automatiquement en 1 minute.

---

## 🌐 Ajouter ton propre nom de domaine (optionnel)

1. Achète un domaine sur OVH (ex. `tablema.fr` ~10€/an)
2. Dans Vercel → ton projet → **Settings → Domains**
3. Ajoute ton domaine et suis les instructions DNS

---

## ❓ Besoin d'aide ?

Demande à Claude sur claude.ai — colle le message d'erreur et il t'aidera à déboguer.

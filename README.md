# TableMaître (tableplan)

Application web de plans de table pour événements : mariages, galas, anniversaires, conférences, lotos. Elle gère les invités, les tables, le plan de salle, le budget, les tâches, le menu et l'export PDF.

- **Pile technique** : React 18 (Create React App + craco), Firebase (authentification Google, Firestore), Vercel (hébergement et fonction `/api/ai`).
- **En ligne** : https://tableplan-seven.vercel.app (déployé depuis la branche `main`).
- **Firebase** : projet `tableplan-c4a6b` (offre gratuite Spark).

## Sécurité : où elle se joue

Le code du site s'exécute dans le navigateur et peut être contourné. Tout ce qui doit être garanti est vérifié par les **règles Firestore** ([firestore.rules](firestore.rules)), à publier dans la console Firebase (Firestore > Règles) après chaque modification.

| Sujet | Garanti par |
|---|---|
| Chacun ne voit et ne modifie que ses événements (`users/{uid}/events/{id}`) | règles Firestore |
| Nombre d'invités par formule (10 / 50 / 2 000) | règles Firestore (`guestsAllowed`) + contrôle dans l'appli |
| Codes promo : invisibles, usage limité, formule accordée | règles Firestore (`vouchers`, `entitlements`) |
| Assistant IA réservé aux comptes connectés, modèle imposé | [api/ai.js](api/ai.js) (vérification du jeton Firebase) |

## Formules et codes promo

Les formules sont définies dans [src/offres.js](src/offres.js) et doivent rester alignées avec `guestsAllowed()` dans les règles :

| Formule | Prix (par compte, pour l'instant) | Invités par événement |
|---|---|---|
| Gratuit | 0 € | 10 |
| Essentiel (`medium`) | 20 € | 50 |
| Complet (`full`) | 39 € | 2 000 |

**Créer un code promo** (console Firebase > Firestore > Données, en tant qu'administrateur) : collection `vouchers`, identifiant du document = le code en MAJUSCULES (6 à 40 caractères, lettres, chiffres, tirets ; choisir un code long et imprévisible), champs :

| Champ | Type | Exemple |
|---|---|---|
| `plan` | string | `full` ou `medium` |
| `maxUses` | number | `1` (usage unique) |
| `uses` | number | `0` |
| `active` | boolean | `true` |

L'utilisateur le saisit via le bouton « Code promo » du tableau de bord (compte Google requis). Un compte ne peut utiliser qu'un seul code. Pour désactiver un code : `active = false`.

**Accorder une formule à la main** (par exemple après un paiement PayPal) : collection `entitlements`, document = UID de l'utilisateur (console Firebase > Authentication), champs `plan` (`medium`/`full`), `source` = `admin`.

## Assistant IA

Variables d'environnement Vercel : `ANTHROPIC_API_KEY` (obligatoire), `AI_MODEL` (facultatif, défaut `claude-haiku-4-5`). Sans clé, l'assistant répond « non configuré ». Ne jamais mettre de clé dans une variable `REACT_APP_…` : elles sont intégrées au site publié.

## Développement

```bash
npm install --legacy-peer-deps
npm start          # http://localhost:3000
npm run build
```

## Audit du 30 octobre 2026 : ce qui a été corrigé (branche `reprise-claude`)

- **Rien n'était sauvegardé** : l'appli écrivait dans `events/…`, refusé par les règles ; tout était perdu au rechargement. Les événements sont maintenant dans `users/{uid}/events/…`.
- **Codes promo lisibles dans le site** (dont `FULL100`, accès complet gratuit) et limite d'usage jamais vérifiée : supprimés du code, remplacés par la collection `vouchers` protégée.
- **Formule choisie par le navigateur** (bouton « Activer » sans vérification de paiement) et limites jamais appliquées : limites désormais imposées par les règles.
- **Relais IA ouvert** (`api/ai.js` : clé Anthropic utilisable par n'importe qui, n'importe quel modèle, ouvert à tous les sites). Il n'était pas encore déployé. Il est maintenant réservé aux comptes connectés, avec modèle et longueur imposés.
- Version locale du 3 avril (assistant IA, invitations, éditeur découpé) intégrée : elle n'avait jamais été poussée. Code mort retiré (ancien éditeur de 2 294 lignes, seconde page de tarifs, panneau super-admin non branché).
- Nouveau type d'événement **Loto / Quine**.

## Reste à faire

- **Paiement** : aujourd'hui, un lien PayPal.me sans vérification ; la formule est accordée à la main (`entitlements`). À terme : Stripe Checkout + webhook (nécessite un compte Stripe et l'offre Firebase Blaze ou une fonction Vercel avec compte de service).
- **Page d'invitation des invités** (`/join/…`) : utilise l'ancienne API Firebase et n'est pas couverte par les règles ; à refaire (lien partagé en lecture seule).
- **Panneau super-admin** : retiré car non branché ; à reconstruire sur les règles (`isAdmin`) si besoin.
- Prix par événement (prévu par la page de tarifs) ou par compte (actuel) : décision commerciale à prendre.

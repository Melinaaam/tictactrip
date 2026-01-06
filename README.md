# API de Justification de Texte

API REST en Node.js/TypeScript permettant de justifier du texte à 80 caractères par ligne, avec système d'authentification par token et limitation de quota (80 000 mots/jour/token).

## Démarrage 

### Installation

```bash
npm install
```

### Lancer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Lancer les tests

```bash
npm test
```

## Utilisation de l'API

### 1. Obtenir un token

```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Réponse :**
```json
{
  "token": "abc123def456..."
}
```

### 2. Justifier du texte

```bash
curl -X POST http://localhost:3000/api/justify \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer abc123def456..." \
  -d "Votre texte à justifier ici. Il sera formaté sur 80 caractères par ligne."
```

**Réponse :**
```
Votre  texte  à  justifier  ici.  Il  sera  formaté sur 80 caractères par
ligne.
```

### Codes de réponse

- **200 OK** : Texte justifié avec succès
- **400 Bad Request** : Texte invalide ou vide
- **401 Unauthorized** : Token manquant ou invalide
- **402 Payment Required** : Quota de 80 000 mots/jour dépassé

## Architecture

Projet découpé en 4 parties :
- Logique de justification du texte 
- API/routes
- Contrôles d'accès
- Stockage de l'état 

### Structure du projet

```
src/
├── domain/justify/          # Logique métier de justification
│   ├── tokenizer.ts         # Découpage du texte en mots
│   ├── justifyLine.ts       # Justification d'une ligne (80 chars)
│   └── justifyText.ts       # Orchestration complète
├── api/                     # Endpoints et serveur
│   ├── routes.ts            # Définition des routes
│   └── server.ts            # Configuration du serveur Express
├── middleware/              # Middlewares de contrôle
│   ├── tokenAuth.ts         # Vérification du token
│   └── quotaLimit.ts        # Limitation du quota (80k mots/jour)
├── storage/                 # Gestion de l'état
│   └── tokenStore.ts        # Stockage tokens et quotas
└── tests/                   # Suite de tests complète
    ├── justify-tests/       # 44 tests
    ├── api-tests/           # 27 tests
    ├── middleware-tests/    # 23 tests
    └── storage-tests/       # 12 tests
```

========================

## Tests

**106 tests** au total avec couverture complète :

```bash
npm test                           # Tous les tests
npm test -- --coverage             # Avec rapport de couverture
npm test -- src/tests/api-tests/   # Tests spécifiques
```

### Détail de la couverture

| Module | Fichier | Tests |
|--------|---------|-------|
| **justify-tests** | tokenizer.test.ts | 14 ✅ |
| | justifyLine.test.ts | 15 ✅ |
| | justifyText.test.ts | 15 ✅ |
| **api-tests** | routes.test.ts | 27 ✅ |
| **middleware-tests** | tokenAuth.test.ts | 12 ✅ |
| | quotaLimit.test.ts | 11 ✅ |
| **storage-tests** | tokenStore.test.ts | 12 ✅ |

### Coverage (Couverture de code)

Pour générer un rapport de couverture complet :

```bash
npm test -- --coverage
```

**Résultats de couverture :**

| Module | Statements | Branches | Functions | Lines |
|--------|------------|----------|-----------|-------|
| **domain/justify/** | 100% | 95.23% | 100% | 100% ✅ |
| **middleware/** | 100% | 100% | 100% | 100% ✅ |
| **storage/** | 100% | 100% | 100% | 100% ✅ |
| **api/routes.ts** | 91.66% | 91.66% | 100% | 91.66% ✅ |

**Couverture globale : 84%** (100% sur la logique métier)

========================

## Détail des modules

### 1️⃣ Logique de justification du texte

**Objectif :** Prendre du texte brut, le découper en mots, construire des lignes de 80 caractères et justifier chaque ligne.

#### `src/domain/justify/tokenizer.ts`
- Découpe le texte en mots via regex `/\s+/`
- Gère espaces multiples, tabulations, retours à la ligne
- Filtre les tokens vides

#### `src/domain/justify/justifyLine.ts`
- Prend un tableau de mots pour une ligne
- Répartit les espaces uniformément entre les mots
- Retourne une ligne de exactement 80 caractères (sauf dernière ligne)

#### `src/domain/justify/justifyText.ts`
- Orchestre tokenizer + justifyLine
- Construit les lignes optimales (max 80 chars)
- Dernière ligne non justifiée (left-aligned)

**Tests :** `src/tests/justify-tests/` (44 tests)

========================

### 2️⃣ API et Routes

**Endpoints disponibles :**

#### `POST /api/token`
Génère un token d'authentification.

**Body :**
```json
{
  "email": "user@example.com"
}
```

**Response :**
```json
{
  "token": "abc123..."
}
```

#### `POST /api/justify`
Justifie un texte à 80 caractères par ligne.

**Headers :**
- `Authorization: Bearer {token}`
- `Content-Type: text/plain`

**Body :** Texte brut (plain text)

**Response :** Texte justifié (text/plain)

**Tests :** `src/tests/api-tests/routes.test.ts` (27 tests)

========================

### 3️⃣ Contrôles d'accès

#### `src/middleware/tokenAuth.ts`
- Vérifie la présence du header `Authorization`
- Valide le format `Bearer {token}`
- Confirme l'existence du token dans le store
- Retourne **401 Unauthorized** si invalide

#### `src/middleware/quotaLimit.ts`
- Compte les mots de la requête
- Vérifie le quota journalier (80 000 mots max/token)
- Retourne **402 Payment Required** si dépassé
- Réinitialisation automatique chaque jour

**Tests :** `src/tests/middleware-tests/` (23 tests)

========================

### 4️⃣ Stockage de l'état

#### `src/storage/tokenStore.ts`

Fonctions principales :
- `add(token)` : Ajoute un nouveau token
- `has(token)` : Vérifie l'existence d'un token
- `consumeWords(token, count, limit)` : Consomme des mots du quota
- `getUsedWords(token)` : Retourne le nombre de mots utilisés aujourd'hui
- `resetAll()` : Vide le store (pour les tests)

**Stockage :** `Map<string, TokenUsage>` avec reset quotidien automatique

**Tests :** `src/tests/storage-tests/tokenStore.test.ts` (12 tests)

========================

## Technologies utilisées

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Jest** - Framework de tests
- **Supertest** - Tests d'API

========================

**Melina Motylewski**

Test technique pour TictacTrip - Janvier 2026

========================


# Système de Base de Données Manga

## 🎯 Nouveau Système

Au lieu de scraper en temps réel (lent et instable), on pré-remplit une base de données JSON, puis le backend lit instantanément depuis ce fichier.

## 📁 Fichiers

- `manga-db.json` : Base de données (liste de mangas)
- `scrape-to-db.js` : Script pour remplir la base
- `server.js` : Backend simplifié (lecture JSON uniquement)

## 🚀 Utilisation

### 1. Remplir la base de données (une fois)

```bash
cd backend
node scrape-to-db.js 200
```

Cela va scraper 200 mangas et les sauvegarder dans `manga-db.json`.

**Options:**
- `node scrape-to-db.js 100` : Scraper 100 mangas
- `node scrape-to-db.js 500` : Scraper 500 mangas
- Par défaut (sans argument) : 100 mangas

**Temps estimé:** ~2-3 minutes pour 100 mangas (scraping en parallèle par batch de 10)

### 2. Lancer le backend

```bash
npm run dev
```

Le backend charge automatiquement `manga-db.json` au démarrage.

### 3. Ajouter plus de mangas

```bash
node scrape-to-db.js 300
```

Le script détecte les mangas existants et n'ajoute que les nouveaux (évite les doublons).

### 4. Recharger la base sans redémarrer

Après avoir ajouté des mangas, rechargez la base:

```bash
curl -X POST http://localhost:3001/reload-db
```

Ou redémarrez simplement le serveur.

## 📊 Endpoints

### `GET /manga`
Retourne un manga aléatoire

### `GET /health`
Status du serveur + taille de la base
```json
{
  "status": "ok",
  "dbSize": 200,
  "lastUpdate": "2024-01-15T10:30:00.000Z"
}
```

### `GET /db-stats`
Statistiques détaillées
```json
{
  "total": 200,
  "lastUpdate": "2024-01-15T10:30:00.000Z",
  "byType": {
    "Shonen": 120,
    "Seinen": 50,
    "Shojo": 30
  },
  "sample": [...]
}
```

### `POST /reload-db`
Recharge la base depuis le fichier

## ✅ Avantages

- ⚡ **Ultra rapide** : Lecture instantanée (pas de scraping)
- 🎯 **Stable** : Pas de dépendance au site Nautiljon en temps réel
- 📦 **Portable** : Le fichier JSON peut être versionné/partagé
- 🔧 **Contrôlable** : Vous choisissez combien de mangas avoir

## 🔄 Workflow Recommandé

1. **Setup initial** : `node scrape-to-db.js 200` (une fois)
2. **Développement** : `npm run dev` (utilise la base existante)
3. **Production** : Déployer avec `manga-db.json` pré-rempli
4. **Maintenance** : Ajouter des mangas périodiquement avec le script

## 📝 Structure manga-db.json

```json
{
  "mangas": [
    {
      "title": "One Piece",
      "picture": "https://...",
      "description": "...",
      "type": "Shonen",
      "url": "https://..."
    }
  ],
  "lastUpdate": "2024-01-15T10:30:00.000Z"
}
```

## 🐛 Dépannage

**Base vide:**
```
⚠️  Base de données vide! Lancez: node scrape-to-db.js 200
```
→ Lancez le script de scraping

**Erreur 500 "Base de données vide":**
→ Le fichier manga-db.json est vide, relancez le scraper

**Mangas en double:**
→ Impossible, le script détecte automatiquement les doublons par URL

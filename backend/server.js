const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Charger la base de données de mangas
const DB_PATH = path.join(__dirname, 'manga-db.json');
let mangaDatabase = { mangas: [] };
let lastMangaUrl = null;

function loadDatabase() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    mangaDatabase = JSON.parse(data);
    console.log(`Base de données chargée: ${mangaDatabase.mangas.length} mangas`);

    if (mangaDatabase.mangas.length === 0) {
      console.warn('Base de données vide! Lancez: node scrape-to-db.js 200');
    }
  } catch (error) {
    console.error('Erreur chargement base:', error.message);
    mangaDatabase = { mangas: [] };
  }
}

// Charger la DB au démarrage
loadDatabase();

// Recharger la DB (utile après avoir lancé le scraper)
function reloadDatabase() {
  loadDatabase();
}

// Fonction pour obtenir un manga aléatoire depuis la base
function getRandomManga() {
  if (mangaDatabase.mangas.length === 0) {
    throw new Error('Base de données vide. Lancez: node scrape-to-db.js 200');
  }

  // Filtrer pour éviter le même manga
  let candidates = lastMangaUrl
    ? mangaDatabase.mangas.filter(m => m.url !== lastMangaUrl)
    : mangaDatabase.mangas;

  // Si on a filtré tous les mangas (cas rare), utiliser toute la base
  if (candidates.length === 0) {
    candidates = mangaDatabase.mangas;
  }

  // Sélectionner aléatoirement
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const manga = candidates[randomIndex];

  lastMangaUrl = manga.url;

  return manga;
}

// Route pour obtenir un manga aléatoire
app.get('/manga', async (req, res) => {
  try {
    const manga = getRandomManga();
    res.json(manga);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du manga',
      details: error.message
    });
  }
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dbSize: mangaDatabase.mangas.length,
    lastUpdate: mangaDatabase.lastUpdate
  });
});

// Route pour recharger la base (après avoir lancé le scraper)
app.post('/reload-db', (req, res) => {
  reloadDatabase();
  res.json({
    success: true,
    mangaCount: mangaDatabase.mangas.length
  });
});

// Route pour voir les stats de la base
app.get('/db-stats', (req, res) => {
  const stats = {};
  mangaDatabase.mangas.forEach(m => {
    stats[m.type] = (stats[m.type] || 0) + 1;
  });

  res.json({
    total: mangaDatabase.mangas.length,
    lastUpdate: mangaDatabase.lastUpdate,
    byType: stats,
    sample: mangaDatabase.mangas.slice(0, 5).map(m => ({ title: m.title, type: m.type }))
  });
});

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
  console.log(`Base: ${mangaDatabase.mangas.length} mangas disponibles`);
  console.log(`\nCommandes utiles:`);
  console.log(`   - Remplir la base: node scrape-to-db.js 200`);
  console.log(`   - Stats: GET http://localhost:${PORT}/db-stats`);
  console.log(`   - Recharger: POST http://localhost:${PORT}/reload-db`);
});


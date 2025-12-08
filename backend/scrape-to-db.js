const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const validTypes = ['Shonen', 'Shojo', 'Seinen'];
const DB_PATH = path.join(__dirname, 'manga-db.json');

// Scraper un seul manga
async function scrapeSingleManga() {
  try {
    // Délai aléatoire (simule comportement humain)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const offset = Math.floor(Math.random() * 225) * 25;
    console.log(`   🔍 Tentative page offset=${offset}...`);
    
    const response = await axios.get(`https://www.nautiljon.com/mangas/?offset=${offset}`, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Referer': 'https://www.nautiljon.com/'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const allMangas = [];
    
    // Chercher tous les liens contenant /mangas/
    $('a[href*="/mangas/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      const title = $(elem).attr('title') || $(elem).text().trim();
      
      if (href && title && title.length > 2 && !href.includes('?') && !href.includes('#')) {
        const mangaUrl = href.startsWith('http') ? href : 'https://www.nautiljon.com' + href;
        if (!allMangas.find(m => m.url === mangaUrl)) {
          allMangas.push({ title, url: mangaUrl });
        }
      }
    });

    if (allMangas.length === 0) {
      console.log(`   ❌ Aucun manga trouvé sur cette page`);
      return null;
    }

    console.log(`   📚 ${allMangas.length} mangas trouvés, sélection...`);
    const randomManga = allMangas[Math.floor(Math.random() * allMangas.length)];
    
    // Récupérer les détails
    const detailResponse = await axios.get(randomManga.url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Connection': 'keep-alive',
        'Referer': 'https://www.nautiljon.com/mangas/'
      },
      timeout: 15000
    });

    const $detail = cheerio.load(detailResponse.data);

    // Extraction image (plusieurs stratégies)
    let picture = '';
    
    // Strategy 1: img avec classe image_fiche
    let img = $detail('img.image_fiche').first();
    if (img.length) picture = img.attr('src') || img.attr('data-src') || '';
    
    // Strategy 2: meta og:image
    if (!picture) {
      picture = $detail('meta[property="og:image"]').attr('content') || '';
    }
    
    // Strategy 3: n'importe quelle img dans figure
    if (!picture) {
      img = $detail('figure img, div.image_fiche img').first();
      if (img.length) picture = img.attr('src') || img.attr('data-src') || '';
    }
    
    if (picture && picture.includes('/mini/')) {
      picture = picture.replace('/mini/', '/');
    }
    if (picture && picture.startsWith('/')) {
      picture = 'https://www.nautiljon.com' + picture;
    }

    // Extraction description
    let description = 'Description indisponible';
    let descElem = $detail('div.description').first().text().trim();
    if (!descElem) {
      descElem = $detail('p').first().text().trim();
    }
    if (descElem) {
      description = descElem.substring(0, 500);
    }

    // Extraction type - chercher dans le contenu
    let type = 'Inconnu';
    const bodyText = $detail('body').text();
    
    // Chercher "Type :" suivi du type
    let typeMatch = bodyText.match(/Type\s*:\s*([Ss]honen|[Ss]hojo|[Ss]einen)/i);
    if (typeMatch) {
      type = typeMatch[1];
    }

    // Normalisation
    let normalizedType = 'Inconnu';
    if (type.toLowerCase().includes('shonen')) {
      normalizedType = 'Shonen';
    } else if (type.toLowerCase().includes('shojo')) {
      normalizedType = 'Shojo';
    } else if (type.toLowerCase().includes('seinen')) {
      normalizedType = 'Seinen';
    }

    if (!validTypes.includes(normalizedType)) {
      console.log(`   ⚠️  Type invalide: "${type}"`);
      return null;
    }

    console.log(`   ✅ ${randomManga.title.substring(0, 40)} (${normalizedType})`);
    
    return {
      title: randomManga.title,
      picture: picture || 'https://via.placeholder.com/300x400?text=Manga',
      description,
      type: normalizedType,
      url: randomManga.url
    };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message.substring(0, 80)}`);
    return null;
  }
}

// Charger la base existante
async function loadDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { mangas: [], lastUpdate: null };
  }
}

// Sauvegarder la base
async function saveDatabase(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

// Script principal
async function main() {
  const TARGET = parseInt(process.argv[2]) || 100;
  const BATCH_SIZE = 3; // Petit batch pour éviter les blocages
  const DELAY_BETWEEN_BATCHES = 5000; // 5s entre chaque batch
  
  console.log(`🎯 Objectif: ${TARGET} mangas`);
  console.log(`⚠️  Protection anti-ban: ${BATCH_SIZE} req/batch, pause de ${DELAY_BETWEEN_BATCHES}ms`);
  
  let db = await loadDatabase();
  const existingUrls = new Set(db.mangas.map(m => m.url));
  
  console.log(`📚 Base actuelle: ${db.mangas.length} mangas\n`);
  
  let scraped = 0;
  let failed = 0;
  let batchCount = 0;
  
  while (db.mangas.length < TARGET) {
    const remaining = TARGET - db.mangas.length;
    const batchSize = Math.min(BATCH_SIZE, remaining * 2);
    
    batchCount++;
    console.log(`🔄 Batch #${batchCount}: Scraping ${batchSize} mangas...`);
    
    const promises = Array(batchSize).fill(null).map(() => scrapeSingleManga());
    const results = await Promise.all(promises);
    
    let added = 0;
    for (const manga of results) {
      if (manga && !existingUrls.has(manga.url)) {
        db.mangas.push(manga);
        existingUrls.add(manga.url);
        added++;
        scraped++;
        console.log(`   ✅ ${manga.title} (${manga.type})`);
      } else if (!manga) {
        failed++;
      }
    }
    
    console.log(`   Ajoutés: ${added} | Total: ${db.mangas.length}/${TARGET}`);
    console.log(`   Stats: ${scraped} OK, ${failed} FAIL\n`);
    
    db.lastUpdate = new Date().toISOString();
    await saveDatabase(db);
    
    if (db.mangas.length < TARGET) {
      console.log(`⏳ Pause de ${DELAY_BETWEEN_BATCHES}ms...\n`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  console.log(`\n🎉 Terminé! ${db.mangas.length} mangas dans la base`);
  const stats = {};
  db.mangas.forEach(m => {
    stats[m.type] = (stats[m.type] || 0) + 1;
  });
  console.log('📊 Répartition par type:');
  Object.entries(stats).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });
}

main().catch(console.error);

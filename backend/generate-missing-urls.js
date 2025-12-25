//node generate-missing-urls.js --dry-run
//pour simuler ce que les modif vont donner

//node generate-missing-urls.js
//pour appliquer les modif

//ce code s'inscrit dans la fusion de plusieurs bdd qui ne possedent pas toutes les urls




const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'manga-db.json');

function titleToSlug(title) {
    return String(title || '')
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/['"!?,:;()\[\]{}\.]/g, ' ')
        .replace(/\s+/g, '+')
        .replace(/\++/g, '+')
        .replace(/^\+|\+$/g, '');
}

async function generateMissingUrls() {
    const dryRun = process.argv.includes('--dry-run');
    console.log('Génération des URL manquantes depuis les titres...');
    if (dryRun) console.log('Mode simulation: aucune écriture.');

    let db;
    try {
        db = JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
    } catch (e) {
        console.error('Lecture manga-db.json:', e.message);
        process.exit(1);
    }

    if (!db || !Array.isArray(db.mangas)) {
        console.error('Format invalide: propriété "mangas" absente ou non-array.');
        process.exit(1);
    }

    let generated = 0;
    let preserved = 0;
    const sample = [];

    db.mangas.forEach((m) => {
        const hadUrl = typeof m.url === 'string' && m.url.trim().length > 0;
        if (hadUrl) {
            preserved++;
            return; // ne pas toucher aux liens existants
        }
        const slug = titleToSlug(m.title || '');
        if (slug.length > 0) {
            const newUrl = `https://www.nautiljon.com/mangas/${slug}.html`;
            if (!dryRun) m.url = newUrl;
            generated++;
            if (sample.length < 10) sample.push({ title: m.title, url: newUrl });
        } else {
            if (!dryRun) m.url = '';
        }
    });

    console.log(`Liens conservés: ${preserved}`);
    console.log(`Liens générés: ${generated}`);
    if (sample.length) {
        console.log('Exemples:');
        sample.forEach(s => console.log(` - ${s.title} -> ${s.url}`));
    }

    if (dryRun) {
        console.log('Simulation OK.');
        return;
    }

    db.lastUpdate = new Date().toISOString();
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log('Écriture terminée.');
    } catch (e) {
        console.error('Échec écriture manga-db.json:', e.message);
        process.exit(1);
    }
}

generateMissingUrls();

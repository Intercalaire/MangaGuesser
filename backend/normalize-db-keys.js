// node normalize-db-keys.js --dry-run
//pour simuler ce que les modif vont donner

//node normalize-db-keys.js
//pour appliquer les modif

// - Renommer "image" en "picture"
// - Renommer "genre" en "type"
// - S'assurer que "url" existe toujours (ajouter vide si manquant)

// Ne pas modifier les valeurs existantes, sauf pour ajouter des clés manquantes

//ce code s'inscrit dans la fusion de plusieurs bdd qui ne possedent pas les mêmes noms de cles





const fs = require('fs').promises;
const path = require('path');


const DB_PATH = path.join(__dirname, 'manga-db.json');

async function normalizeDb() {
    const dryRun = process.argv.includes('--dry-run');
    console.log('Normalisation des clés (image→picture, genre→type, url)...');
    if (dryRun) {
        console.log('Mode simulation activé: aucune écriture ne sera faite.');
    }

    let db;
    try {
        const raw = await fs.readFile(DB_PATH, 'utf8');
        db = JSON.parse(raw);
    } catch (e) {
        console.error('Lecture de manga-db.json impossible:', e.message);
        process.exit(1);
    }

    if (!db || !Array.isArray(db.mangas)) {
        console.error('Format invalide: propriété "mangas" absente ou non-array.');
        process.exit(1);
    }

    let changed = 0;
    let urlMismatches = 0;
    let pictureMismatches = 0;

    const before = db.mangas.map(m => ({
        url: m.url,
        image: m.image
    }));

    db.mangas.forEach((m, idx) => {
        let localChanged = 0;

        const originalUrl = before[idx].url;
        const originalImage = before[idx].image;

        // image -> picture (copie de valeur, aucun remplacement dans la chaîne)
        if (Object.prototype.hasOwnProperty.call(m, 'image')) {
            if (!Object.prototype.hasOwnProperty.call(m, 'picture')) {
                m.picture = m.image;
            }
            delete m.image;
            localChanged++;
        }

        // genre -> type (garder la valeur telle quelle)
        if (Object.prototype.hasOwnProperty.call(m, 'genre')) {
            if (!Object.prototype.hasOwnProperty.call(m, 'type')) {
                m.type = m.genre;
            }
            delete m.genre;
            localChanged++;
        }

        // url: si manquant, ajouter vide; sinon ne pas modifier
        if (!Object.prototype.hasOwnProperty.call(m, 'url')) {
            m.url = '';
            localChanged++;
        } else if (typeof m.url !== 'string') {
            m.url = '';
            localChanged++;
        }

        // Vérifications de sécurité: l'URL existante ne doit pas changer
        if (originalUrl !== undefined && originalUrl !== null) {
            if (m.url !== originalUrl) urlMismatches++;
        }

        // Vérif: la valeur d'image copiée doit correspondre à picture
        if (originalImage !== undefined && originalImage !== null) {
            // Si picture existait déjà, on ne force pas la valeur, donc pas de mismatch s'il était différent
            if (!before[idx].image && !Object.prototype.hasOwnProperty.call(m, 'picture')) {
                // Cas rare, ignoré
            } else if (Object.prototype.hasOwnProperty.call(m, 'picture')) {
                if (m.picture !== originalImage) pictureMismatches++;
            }
        }

        if (localChanged > 0) changed++;
    });

    console.log(` Modifications prévues: ${changed}`);
    console.log(`URL changées (doit être 0): ${urlMismatches}`);
    console.log(`Picture ≠ Image (après copie): ${pictureMismatches}`);

    if (urlMismatches > 0) {
        console.error('Sécurité: au moins une URL existante aurait été modifiée. Abandon.');
        process.exit(1);
    }

    if (dryRun) {
        console.log('Simulation OK: aucune URL modifiée.');
        return;
    }

    try {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log(`Normalisation terminée. Entrées modifiées: ${changed}`);
    } catch (e) {
        console.error('Écriture de manga-db.json impossible:', e.message);
        process.exit(1);
    }
}

normalizeDb();

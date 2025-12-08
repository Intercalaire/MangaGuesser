var express = require('express');
var router = express.Router();
var scrapper = require('../scrapper')
var apicache = require('apicache')
var cache = apicache.middleware

// Normaliser les accents et caractères spéciaux pour matcher les genres
function normalizeGenre(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

router.get("/item", cache('1 day'), function (req, res) {
    const path = req.query.path;
    
    if (!path) {
        return res.status(400).json({
            error: 'Missing path parameter'
        });
    }

    scrapper.get({
        url: `https://www.nautiljon.com${path}`,
        onSuccess: ($, response) => {
            if (response.statusCode != 200) {
                return res.status(response.statusCode).json({
                    error: 'Error returned by nautiljon',
                    code: response.statusCode
                });
            }

            let type = 'Inconnu';
            let rawType = '';
            
            // Essayer d'extraire le type depuis les différentes sources
            // 1. Depuis la ligne "Type : XXX"
            const typeText = $("body").text();
            const typeMatch = typeText.match(/Type\s*:\s*([^\n]+)/i);
            if (typeMatch) {
                rawType = typeMatch[1].trim();
                type = rawType;
            }

            // 2. Depuis les meta tags ou classe
            if (!rawType) {
                const metaType = $('meta[property="og:type"]').attr('content') || 
                               $('span:contains("Type")').next().text();
                if (metaType) {
                    type = metaType.trim();
                    rawType = type;
                }
            }

            // 3. Depuis l'URL pour déterminer le type si pas trouvé
            if (!rawType && path.includes('/mangas/')) {
                type = 'Manga';
                rawType = 'Manga';
            }

            res.json({
                type: type,
                rawType: rawType,
                path: path
            });
        },
        onError: (error) => {
            console.log("error::" + error);
            res.status(500).json({
                error: 'Internal Server Error, Unable to fetch item details'
            });
        }
    });
});

module.exports = router;

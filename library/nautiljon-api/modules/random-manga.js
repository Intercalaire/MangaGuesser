var express = require('express');
var router = express.Router();
var scrapper = require('../scrapper')
var apicache = require('apicache')
var cache = apicache.middleware

router.get("/random-manga", cache('5 minutes'), function (req, res) {
    // Récupérer la page d'accueil avec les dernières critiques/sélections
    scrapper.get({
        url: 'https://www.nautiljon.com/',
        onSuccess: ($, response) => {
            if(response.statusCode != 200){
                return res.status(response.statusCode).json({
                    error: 'Error returned by nautiljon',
                    code: response.statusCode
                })
            }

            try {
                var mangas = [];

                // Récupérer tous les mangas de la page d'accueil
                var div = $("#content > .frame_right > .top_bloc")
                if (div.length > 0) {
                    div = $(div[div.length - 2]);
                    var els = $(div).find(".bloc_images")
                    els.each(function (i, elem) {
                        const link = $(elem).find("a");
                        const path = link.attr("href");
                        const title = link.attr("title") || $(elem).find("span").text().trim();
                        const picture = $(elem).find("img").attr("src");
                        
                        if (path && path.includes('/mangas/')) {
                            mangas.push({
                                title: title,
                                picture: picture,
                                path: path
                            });
                        }
                    });
                }

                if (mangas.length === 0) {
                    return res.status(404).json({
                        error: 'Aucun manga trouvé'
                    });
                }

                // Sélectionner un manga aléatoire
                const randomManga = mangas[Math.floor(Math.random() * mangas.length)];

                // Récupérer les détails du manga
                scrapper.get({
                    url: `https://www.nautiljon.com${randomManga.path}`,
                    onSuccess: ($detail, responseDetail) => {
                        if (responseDetail.statusCode != 200) {
                            // Retourner le manga sans les détails si échec
                            return res.json({
                                title: randomManga.title,
                                picture: randomManga.picture,
                                path: randomManga.path,
                                description: 'Description indisponible',
                                genre: 'Genre inconnu'
                            });
                        }

                        try {
                            // Extraire la description
                            let description = 'Description indisponible';
                            const descMatch = $detail("body").html().match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/div>/i);
                            if (descMatch) {
                                description = descMatch[1].trim().substring(0, 500);
                            }

                            // Extraire le genre/type
                            let genre = 'Manga';
                            const typeMatch = $detail("body").text().match(/Type\s*:\s*([^\n]+)/i);
                            if (typeMatch) {
                                genre = typeMatch[1].trim().split('\n')[0];
                            }

                            res.json({
                                title: randomManga.title,
                                picture: randomManga.picture,
                                path: randomManga.path,
                                description: description,
                                genre: genre
                            });
                        } catch (parseErr) {
                            res.json({
                                title: randomManga.title,
                                picture: randomManga.picture,
                                path: randomManga.path,
                                description: 'Description indisponible',
                                genre: 'Manga'
                            });
                        }
                    },
                    onError: (error) => {
                        console.log("Detail fetch error:", error);
                        res.json({
                            title: randomManga.title,
                            picture: randomManga.picture,
                            path: randomManga.path,
                            description: 'Description indisponible',
                            genre: 'Manga'
                        });
                    }
                });
            } catch (err) {
                console.error("Parse error:", err);
                res.status(500).json({
                    error: 'Erreur lors du parsing'
                });
            }
        },
        onError: (error) => {
            console.log("Home page fetch error:", error);
            res.status(500).json({
                error: 'Impossible de récupérer les données de nautiljon.com'
            })
        }
    });
});

module.exports = router;

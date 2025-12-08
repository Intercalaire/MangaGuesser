var express = require('express');
var router = express.Router();
var apicache = require('apicache');
var scrapper = require('../scrapper');
var cache = apicache.middleware;

router.get('/item', function (req, res) {
    var path = req.query.path || req.query.url;
    if (!path) {
        return res.status(400).json({ error: 'missing path or url query parameter' });
    }

    var url = path;
    if (path.indexOf('http') !== 0) {
        // assume relative path
        if (path.startsWith('/')) url = 'https://www.nautiljon.com' + path;
        else url = 'https://www.nautiljon.com/' + path;
    }

    scrapper.get({
        url: url,
        onSuccess: ($, response) => {
            if (response.statusCode != 200) {
                return res.status(response.statusCode).json({ error: 'Error returned by nautiljon', code: response.statusCode });
            }

            try {
                var title = $('.h1titre span').text().trim() || $('h1').text().trim() || null;

                // Try several selectors that may contain synopsis/description
                var selectors = ["#content .resume", '.resume', '.fiche_description', '.synopsis', '.description', '.presentation', '.fiche .desc', '.fiche .resume', '#resume'];
                var text = null;
                var html = null;
                for (var i = 0; i < selectors.length; i++) {
                    var sel = selectors[i];
                    var el = $(sel);
                    if (el && el.length) {
                        text = $(el).text().trim();
                        html = $(el).html().trim();
                        break;
                    }
                }

                // fallback to meta description or og:description
                if ((!text || text.length == 0) && ($('meta[name=description]').attr('content') || $('meta[property="og:description"]').attr('content'))) {
                    var meta = $('meta[name=description]').attr('content') || $('meta[property="og:description"]').attr('content');
                    if (meta) {
                        text = meta.trim();
                        html = meta.trim();
                    }
                }

                res.json({
                    title: title,
                    synopsis: {
                        text: text || null,
                        html: html || null
                    },
                    path: response.request && response.request.uri ? response.request.uri.pathname : url
                });
            } catch (e) {
                console.log(e);
                res.status(500).json({ error: 'Error during scrapping' });
            }
        },
        onError: (error) => {
            console.log('error::' + error);
            res.status(500).json({ error: 'Internal Server Error, Unable to fetch page' });
        }
    })
});

module.exports = router;

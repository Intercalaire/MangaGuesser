var request = require('request')
var cheerio = require('cheerio')
var cheerioAdv = require('cheerio-advanced-selectors')
var randomUA = require('random-fake-useragent')

cheerio = cheerioAdv.wrap(cheerio)

var defaultUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

var scrap = function(requestMethod, config){
    var headers = {
        'Referer': config.referer ? config.referer : config.url,
        'User-Agent': config.userAgent || defaultUA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }

    var reqOptions = {
        url: config.url,
        headers: headers,
        timeout: config.timeout ? config.timeout : 20000,
        gzip: true,
        followAllRedirects: true
    }

    requestMethod(reqOptions, function (error, response, html) {
        if (!error && response) {
            var $ = cheerio.load(html)
            try {
                config.onSuccess($, response, html)
            } catch (e) {
                config.onError(e, response, html)
            }
        } else {
            config.onError(error, response, html)
        }
    })
}

module.exports = {
    get: (config) => scrap(request.get, config),
    post: (config) => scrap(request.post, config),
}

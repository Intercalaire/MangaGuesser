function normalizeUrl(u) {
  if (!u) return null;

  try {
    let url = String(u).trim();

    // strip possible css url(...) wrapper
    url = url.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');

    // normalize whitespace and encode spaces
    url = url.replace(/\s+/g, ' ');

    // already absolute
    if (/^https?:\/\//i.test(url)) return encodeURI(url);

    // protocol-relative
    if (/^\/\//.test(url)) return encodeURI('https:' + url);

    // root-relative -> prefix nautiljon base
    if (url.startsWith('/')) return encodeURI('https://www.nautiljon.com' + url);

    // relative paths -> try prefixing nautiljon
    return encodeURI('https://www.nautiljon.com/' + url);
  } catch (err) {
    console.warn('normalizeUrl failed for', u, err);
    return null;
  }
}

export default normalizeUrl;
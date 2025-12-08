// Simplifié : le backend lit maintenant depuis JSON (instantané, pas besoin de retry)
const defaultRetry = { attempts: 2, delay: 500 }; // Réduit à 2 tentatives

async function fetchWithRetry(url, { attempts = defaultRetry.attempts, delay = defaultRetry.delay } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status} ${response.statusText}${text ? ` - ${text.slice(0, 160)}` : ''}`);
      }
      return response.json();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }
    }
  }
  console.warn('API fetch failed after retries', lastErr);
  throw new Error('Service temporairement indisponible, merci de réessayer.');
}

export async function getMangaReviews() {
  return fetchWithRetry('/api/reviews?type=manga');
}

export { fetchWithRetry };

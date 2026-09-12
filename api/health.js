/**
 * GET /api/health
 *
 * Open this before you open the app. It answers the two questions that cause
 * most failures: did the credential reach the running site, and did the
 * provider answer us.
 *
 * It reports WHETHER the key is configured. It never reports the key, its
 * length, or any part of its value — those would each be a way of leaking it.
 */
export default async function handler(req, res) {
  const key = process.env.USDA_API_KEY;
  const keyConfigured = Boolean(key && key.trim());

  let upstreamStatus = null;

  if (keyConfigured) {
    // One cheap, pinned lookup. fdcId 2646170 is a Foundation record that does
    // not move, so a non-200 here means our credential or the provider, never
    // a query that happened to miss.
    const url =
      'https://api.nal.usda.gov/fdc/v1/food/2646170?format=abridged&api_key=' +
      encodeURIComponent(key.trim() + 'X');

    try {
      const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
      upstreamStatus = upstream.status;
    } catch (err) {
      // DNS failure, TLS failure, timeout: we never reached them at all. This
      // is a different situation from a refusal and the screen says so.
      upstreamStatus = 'unreachable';
    }
  }

  // Health is about right now, so it must never be served from a cache.
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    service: 'pantrypilot',
    keyConfigured,
    upstreamStatus,
    upstream: 'USDA FoodData Central',
    checkedAt: new Date().toISOString(),
  });
}

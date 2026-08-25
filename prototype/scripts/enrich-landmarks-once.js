#!/usr/bin/env node

// Usage: node prototype/scripts/enrich-landmarks-once.js /path/to/.env.local [limit]
// The env file stays outside Git. This script is for a one-time admin batch,
// while Vercel invokes the same logic through /api/enrich-landmarks in production.
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) return;
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    try { process.env[key] = value.startsWith('"') ? JSON.parse(value) : value; } catch { process.env[key] = value; }
  });
}

const envPath = process.argv[2];
if (envPath) loadEnvFile(path.resolve(envPath));
const limit = Math.max(1, Math.min(10, Number.parseInt(process.argv[3], 10) || 4));

const { supabaseRequest } = require('../api/_lib');
const enrichLandmarks = require('../api/enrich-landmarks');

async function main() {
  const rows = await supabaseRequest('places?select=id,name,address,description,homepage_url,image_url,operating_hours,metadata&source=eq.daejeon_tourspot&category=eq.landmark&order=updated_at.asc&limit=100');
  const candidates = (Array.isArray(rows) ? rows : []).filter((place) => enrichLandmarks.shouldEnrich(place, false)).slice(0, limit);
  const results = [];
  for (const place of candidates) {
    try {
      const searchResult = await enrichLandmarks.callOpenAiLandmarkSearch(place);
      await supabaseRequest(`places?id=eq.${encodeURIComponent(place.id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(enrichLandmarks.mergeUpdate(place, searchResult))
      });
      results.push({ name: place.name, ok: true, imageFound: Boolean(searchResult.image), sourceCount: searchResult.sourceUrls.length });
    } catch (error) {
      results.push({ name: place.name, ok: false, error: String(error.message || error).slice(0, 180) });
    }
  }
  console.log(JSON.stringify({ requested: candidates.length, updated: results.filter((result) => result.ok).length, results }, null, 2));
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`landmark_enrichment_failed: ${error.message}`);
  process.exitCode = 1;
});

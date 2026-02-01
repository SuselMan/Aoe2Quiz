/**
 * Fetches data.json and locale strings from aoe2techtree.net and saves to app/
 * Run: node scripts/fetch-aoe2-data.js
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const DATA_URL = 'https://aoe2techtree.net/data/data.json';
const STRINGS_BASE = 'https://aoe2techtree.net/data/locales';

// App locale -> aoe2techtree locale (for fetch). Saves as strings_{appLocale}.json
const LOCALE_MAP = [
  ['en', 'en'],
  ['zh', 'zh'],
  ['tw', 'zh'],
  ['fr', 'fr'],
  ['de', 'de'],
  ['hi', 'hi'],
  ['it', 'it'],
  ['jp', 'jp'],
  ['ko', 'ko'],
  ['ms', 'ms'],
  ['pl', 'pl'],
  ['ru', 'ru'],
  ['es', 'es'],
  ['mx', 'es'],
  ['tr', 'tr'],
  ['vi', 'vi'],
  ['br', 'pt'],
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

async function main() {
  console.log('Fetching data.json...');
  const data = await fetchJson(DATA_URL);
  fs.writeFileSync(path.join(APP_DIR, 'data.json'), JSON.stringify(data, null, 0));
  console.log('Saved app/data.json');

  const fetched = new Map();
  for (const [appLocale, aoe2Locale] of LOCALE_MAP) {
    const cacheKey = aoe2Locale;
    let json;
    if (fetched.has(cacheKey)) {
      json = fetched.get(cacheKey);
    } else {
      try {
        console.log(`Fetching strings ${aoe2Locale}...`);
        json = await fetchJson(`${STRINGS_BASE}/${aoe2Locale}/strings.json`);
        fetched.set(cacheKey, json);
      } catch (e) {
        console.warn(`Failed ${aoe2Locale}:`, e.message);
        if (aoe2Locale !== 'en') {
          json = fetched.get('en') || (await fetchJson(`${STRINGS_BASE}/en/strings.json`));
          fetched.set(cacheKey, json);
        } else {
          throw e;
        }
      }
    }
    const outPath = path.join(APP_DIR, `strings_${appLocale}.json`);
    fs.writeFileSync(outPath, JSON.stringify(json, null, 0));
    console.log(`Saved ${outPath}`);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

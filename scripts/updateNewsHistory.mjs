import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fetchRepairNews } from '../lib/repairNews.mjs';

const outputPath = resolve('public/data/news-history.json');
const onlyWhenUk17 = process.argv.includes('--only-uk-17');

if (onlyWhenUk17 && !isUkHour(17)) {
  console.log('Not 17:00 in Europe/London. Skipping news update.');
  process.exit(0);
}

const fetchedAt = new Date().toISOString();
const existing = await readExistingHistory();
const latest = await fetchRepairNews({ limit: 12 });
const items = mergeHistory(existing.items ?? [], latest.items ?? [], latest.generatedAt ?? fetchedAt);
const payload = {
  updatedAt: latest.generatedAt ?? fetchedAt,
  items,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Saved ${items.length} news items to ${outputPath}`);

async function readExistingHistory() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return { updatedAt: '', items: [] };
  }
}

function mergeHistory(current, latestItems, generatedAt) {
  const byKey = new Map(current.map((item) => [newsKey(item), item]));

  for (const item of latestItems) {
    const existing = byKey.get(newsKey(item));
    byKey.set(newsKey(item), {
      ...existing,
      ...item,
      firstFetchedAt: existing?.firstFetchedAt ?? generatedAt,
      lastFetchedAt: generatedAt,
    });
  }

  return [...byKey.values()]
    .sort((a, b) => new Date(b.lastFetchedAt || 0) - new Date(a.lastFetchedAt || 0))
    .slice(0, 500);
}

function newsKey(item) {
  return item.link || `${item.source}-${item.title}`;
}

function isUkHour(hour) {
  const value = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    hour12: false,
  }).format(new Date());

  return Number(value) === hour;
}

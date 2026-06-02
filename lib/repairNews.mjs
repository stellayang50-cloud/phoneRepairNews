import { XMLParser } from 'fast-xml-parser';

export const newsSources = [
  {
    name: 'Phone Repair Guru',
    region: 'Peer video / Global',
    category: 'peer-video',
    priority: 5,
    format: 'rss2json',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCvdWmAe3PwSp7C2J5_xzr0Q',
  },
  {
    name: 'DIYPhoneFix',
    region: 'DIY video / Global',
    category: 'peer-video',
    priority: 5,
    format: 'rss2json',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCae3Xu063RaYJaDd1M8FHRQ',
  },
  {
    name: 'iDoctor UK',
    region: 'Peer video / UK',
    category: 'peer-video',
    priority: 5,
    format: 'rss2json',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCCa6do4XROkGYo4J--a8bRA',
  },
  {
    name: 'REWA Technology',
    region: 'Peer video / Global',
    category: 'peer-video',
    priority: 5,
    format: 'rss2json',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUC3ByF8DcZ3yxUs7VP1NOuyA',
  },
  {
    name: 'iFixit News',
    region: 'Technical / Global',
    category: 'technical-repair',
    priority: 4,
    url: 'https://www.ifixit.com/News/feed',
  },
  {
    name: 'GSMArena',
    region: 'Demand signal / Global',
    category: 'demand-signal',
    priority: 3,
    url: 'https://www.gsmarena.com/rss-news-reviews.php3',
  },
  {
    name: 'TechRadar Phones',
    region: 'Demand signal / UK',
    category: 'demand-signal',
    priority: 3,
    url: 'https://www.techradar.com/rss/news/phones',
  },
  {
    name: 'iPhone Repair Base',
    region: 'UK',
    category: 'phone-repair',
    priority: 3,
    url: 'https://iphonerepairbase.co.uk/blog/feed/',
  },
  {
    name: 'XFix',
    region: 'UK',
    category: 'phone-repair',
    priority: 2,
    url: 'https://xfix.co.uk/feed/',
  },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: 'text',
});

export async function fetchRepairNews({ limit = 8 } = {}) {
  const results = await Promise.allSettled(newsSources.map(fetchSource));
  const sortedItems = results
    .filter((result) => result.status === 'fulfilled')
    .flatMap((result) => result.value)
    .sort((a, b) => {
      const scoreDiff = b.marketScore - a.marketScore;
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
  const items = selectMarketRadarItems(sortedItems, limit).map(({ marketScore, category, ...item }) => item);

  return {
    generatedAt: new Date().toISOString(),
    sources: newsSources.map(({ name, region, url }) => ({ name, region, url })),
    items,
  };
}

async function fetchSource(source) {
  const feedText = await fetchFeedText(source);
  if (source.format === 'rss2json') {
    const data = JSON.parse(feedText);
    const rawItems = asArray(data.items);
    return rawItems.map((item) => normalizeItem(item, source)).filter((item) => isRelevantNews(item, source));
  }

  const xml = feedText;
  const data = parser.parse(xml);
  const channel = data.rss?.channel ?? data.feed ?? {};
  const rawItems = asArray(channel.item ?? channel.entry);

  return rawItems.map((item) => normalizeItem(item, source)).filter((item) => isRelevantNews(item, source));
}

function normalizeItem(item, source) {
  const title = decodeHtml(stringValue(item.title));
  const link = linkValue(item.link);
  const publishedAt = decodeHtml(stringValue(item.pubDate ?? item.published ?? item.updated ?? item['dc:date']));

  if (!title || !link) {
    return null;
  }

  const summary = decodeHtml(cleanSummary(item.description ?? item.summary ?? item.content ?? item['content:encoded']));
  const scoreText = `${title} ${summary}`;
  const marketScore = scoreMarketContent(scoreText, source);

  return {
    title,
    link,
    source: source.name,
    region: source.region,
    category: source.category,
    publishedAt: publishedAt || new Date().toISOString(),
    summary: summary || fallbackSummaryForSource(source),
    marketScore,
  };
}

async function fetchFeedText(source) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(source.url, {
        headers: {
          'user-agent': 'personal-site-editor/1.0',
          accept: 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(18000),
      });

      if (!response.ok) {
        throw new Error(`${source.name} returned ${response.status}`);
      }

      return response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function stringValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value.text === 'string') return value.text.trim();
  return String(value).trim();
}

function linkValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) {
    return linkValue(value.find((item) => item.href) ?? value[0]);
  }
  return value.href ?? value.text ?? '';
}

function cleanSummary(value) {
  return stringValue(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\bThe post\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function isRelevantNews(item, source) {
  if (!item) return false;
  const content = `${item.title} ${item.summary}`.toLowerCase();
  const phoneKeywords = [
    'phone',
    'mobile',
    'smartphone',
    'iphone',
    'samsung',
    'fairphone',
  ];

  if (source.category === 'technical-repair') {
    return scoreTechnicalContent(content) >= 1;
  }

  if (source.category === 'peer-video' || source.category === 'peer-blog') {
    return scoreMarketContent(content, source) >= 4;
  }

  if (source.category === 'demand-signal') {
    return scoreDemandSignalContent(content) >= 2;
  }

  if (source.category === 'phone-repair') {
    return phoneKeywords.some((keyword) => content.includes(keyword));
  }

  return [
    'repair',
    'right to repair',
    ...phoneKeywords,
    'parts',
    'refurb',
    'reuse',
    'device',
    'electronics',
    'e-waste',
    'circular',
  ].some((keyword) => content.includes(keyword));
}

function scoreMarketContent(value, source) {
  const sourceBoost = source.priority ?? 1;
  return sourceBoost + scoreDiyPartsContent(value) + scoreTechnicalContent(value) + scoreDemandSignalContent(value);
}

function scoreDiyPartsContent(value) {
  const content = String(value ?? '').toLowerCase();
  const keywords = [
    'diy',
    'repair kit',
    'tool kit',
    'parts',
    'replacement',
    'screen',
    'display',
    'battery',
    'charging port',
    'back glass',
    'camera',
    'lens',
    'adhesive',
    'screwdriver',
    'opening tool',
    'spudger',
    'flex cable',
    'connector',
    'wholesale',
    'supplier',
    'iphone',
    'samsung',
    'pixel',
    'huawei',
    'xiaomi',
  ];

  return keywords.reduce((score, keyword) => (content.includes(keyword) ? score + 2 : score), 0);
}

function scoreTechnicalContent(value) {
  const content = String(value ?? '').toLowerCase();
  const keywords = [
    'teardown',
    'repair guide',
    'diagnostic',
    'diagnostics',
    'logic board',
    'motherboard',
    'microsoldering',
    'soldering',
    'charging port',
    'usb-c',
    'screen replacement',
    'battery replacement',
    'display',
    'oled',
    'lcd',
    'camera module',
    'face id',
    'touch id',
    'firmware',
    'ios',
    'android',
    'parts',
    'replacement',
    'water damage',
    'data recovery',
    'connector',
    'flex cable',
    'back glass',
    'calibration',
    'serialisation',
    'serialization',
    'pairing',
    'iphone',
    'samsung',
    'pixel',
    's23',
    's24',
    'ultra',
    'smartphone',
    'mobile',
    'refurbished',
    'renewed',
    'fake',
  ];

  return keywords.reduce((score, keyword) => (content.includes(keyword) ? score + 1 : score), 0);
}

function scoreDemandSignalContent(value) {
  const content = String(value ?? '').toLowerCase();
  const keywords = [
    'iphone',
    'samsung',
    'pixel',
    'oneplus',
    'xiaomi',
    'oppo',
    'honor',
    'fairphone',
    'smartphone',
    'phone',
    'display',
    'battery',
    'camera',
    'chip',
    'soc',
    'usb-c',
    'charging',
    'android',
    'ios',
    'foldable',
    'repair',
    'parts',
    'teardown',
    'launch',
    'leak',
    'rumor',
    'rumour',
    'price',
    'preorder',
    'best-selling',
    'market',
    'demand',
  ];

  return keywords.reduce((score, keyword) => (content.includes(keyword) ? score + 1 : score), 0);
}

function decodeHtml(value) {
  return String(value ?? '')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_match, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function selectMarketRadarItems(items, limit) {
  const selected = [];
  const peers = items.filter((item) => item.category === 'peer-video' || item.category === 'peer-blog');
  const technical = items.filter((item) => item.category === 'technical-repair' || item.category === 'phone-repair');
  const demand = items.filter((item) => item.category === 'demand-signal');

  const peerTarget = Math.min(5, limit);
  addOnePerSource(selected, peers, peerTarget);
  addDiversified(selected, peers, peerTarget - selected.length, 2);
  addDiversified(selected, technical, Math.min(2, limit - selected.length), 2);
  addDiversified(selected, demand, limit - selected.length, 3);
  addDiversified(selected, items, limit - selected.length, 3);

  return selected.slice(0, limit);
}

function addDiversified(selected, items, countToAdd, perSourceLimit) {
  if (countToAdd <= 0) return;
  const initialLength = selected.length;
  const selectedKeys = new Set(selected.map(newsKey));
  const sourceCounts = new Map();

  for (const item of items) {
    if (selectedKeys.has(newsKey(item))) continue;
    const count = sourceCounts.get(item.source) ?? 0;
    if (count >= perSourceLimit) continue;
    selected.push(item);
    selectedKeys.add(newsKey(item));
    sourceCounts.set(item.source, count + 1);
    if (selected.length - initialLength >= countToAdd) return;
  }
}

function addOnePerSource(selected, items, countToAdd) {
  if (countToAdd <= 0) return;
  const selectedKeys = new Set(selected.map(newsKey));
  const seenSources = new Set();

  for (const item of items) {
    if (selected.length >= countToAdd) return;
    if (selectedKeys.has(newsKey(item)) || seenSources.has(item.source)) continue;
    selected.push(item);
    selectedKeys.add(newsKey(item));
    seenSources.add(item.source);
  }
}

function newsKey(item) {
  return item.link || `${item.source}-${item.title}`;
}

function fallbackSummaryForSource(source) {
  if (source.category === 'peer-video') {
    return 'Latest peer video signal for DIY repair, parts demand, repair kits, tools, and customer interest.';
  }

  return '';
}

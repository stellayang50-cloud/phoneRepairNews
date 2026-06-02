export const competitorSources = [
  {
    competitor: 'ReplaceBase',
    brand: 'iPhone',
    url: 'https://www.replacebase.co.uk/apple/iphone',
  },
  {
    competitor: 'ReplaceBase',
    brand: 'Samsung',
    url: 'https://www.replacebase.co.uk/samsung',
  },
  {
    competitor: 'ReplaceBase',
    brand: 'Google Pixel',
    url: 'https://www.replacebase.co.uk/google/google-pixel',
  },
  {
    competitor: 'ReplaceBase',
    brand: 'Huawei',
    url: 'https://www.replacebase.co.uk/huawei',
  },
  {
    competitor: 'ReplaceBase',
    brand: 'Xiaomi',
    url: 'https://www.replacebase.co.uk/xiaomi',
  },
];

export async function fetchCompetitorProducts({ limitPerSource = 12 } = {}) {
  const fetchedAt = new Date().toISOString();
  const results = await Promise.allSettled(
    competitorSources.map((source) => fetchCompetitorSource(source, { limitPerSource, fetchedAt })),
  );

  return {
    fetchedAt,
    sources: competitorSources,
    products: results.flatMap((result, index) => {
      if (result.status === 'fulfilled') return result.value;

      const source = competitorSources[index];
      return [
        {
          id: `${source.competitor}-${source.brand}-blocked`,
          competitor: source.competitor,
          brand: source.brand,
          productName: 'Automatic scrape blocked',
          price: '',
          availability: 'Manual review required',
          url: source.url,
          sourceUrl: source.url,
          fetchedAt,
          status: 'blocked',
          note: shortError(result.reason),
        },
      ];
    }),
  };
}

async function fetchCompetitorSource(source, { limitPerSource, fetchedAt }) {
  const html = await fetchSourceHtml(source);
  const products = extractJsonLdProducts(html, source, fetchedAt);
  const extracted = products.length ? products : extractGenericProducts(html, source, fetchedAt);

  if (!extracted.length) {
    return [
      {
        id: `${source.competitor}-${source.brand}-empty`,
        competitor: source.competitor,
        brand: source.brand,
        productName: 'No products detected',
        price: '',
        availability: 'Needs selector tuning',
        url: source.url,
        sourceUrl: source.url,
        fetchedAt,
        status: 'needs-review',
        note: 'The page loaded, but no product cards or JSON-LD products were detected.',
      },
    ];
  }

  return extracted.slice(0, limitPerSource);
}

async function fetchSourceHtml(source) {
  const response = await fetch(source.url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; DIYPartsMarketRadar/1.0)',
      accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(18000),
  });

  if (!response.ok) {
    throw new Error(`${source.competitor} ${source.brand} returned ${response.status}`);
  }

  return response.text();
}

function extractJsonLdProducts(html, source, fetchedAt) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const products = [];

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(stripHtml(script[1]));
      collectProducts(parsed, products, source, fetchedAt);
    } catch {
      // Some sites include invalid JSON-LD. Ignore and keep looking for usable data.
    }
  }

  return products;
}

function collectProducts(value, products, source, fetchedAt) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectProducts(item, products, source, fetchedAt));
    return;
  }

  if (value['@graph']) collectProducts(value['@graph'], products, source, fetchedAt);
  if (value.itemListElement) collectProducts(value.itemListElement, products, source, fetchedAt);
  if (value.item) collectProducts(value.item, products, source, fetchedAt);

  const type = Array.isArray(value['@type']) ? value['@type'].join(' ') : value['@type'];
  if (!String(type ?? '').toLowerCase().includes('product')) return;

  const offer = Array.isArray(value.offers) ? value.offers[0] : value.offers;
  products.push({
    id: stableProductId(source, value.url || value.name),
    competitor: source.competitor,
    brand: source.brand,
    productName: cleanText(value.name),
    price: formatPrice(offer?.price, offer?.priceCurrency),
    availability: cleanText(offer?.availability ?? ''),
    url: absolutizeUrl(value.url || offer?.url || source.url, source.url),
    sourceUrl: source.url,
    fetchedAt,
    status: 'ok',
    note: 'Extracted from product structured data.',
  });
}

function extractGenericProducts(html, source, fetchedAt) {
  const anchors = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]{20,800}?)<\/a>/gi)];
  const candidates = [];

  for (const anchor of anchors) {
    const text = cleanText(anchor[2]);
    const price = text.match(/(?:£|GBP\s*)\s?\d+(?:[.,]\d{2})?/i)?.[0] ?? '';
    const looksLikePart = /(iphone|samsung|pixel|huawei|xiaomi|screen|battery|charging|camera|lcd|oled|replacement|assembly)/i.test(text);

    if (!price || !looksLikePart) continue;

    candidates.push({
      id: stableProductId(source, anchor[1]),
      competitor: source.competitor,
      brand: source.brand,
      productName: text.replace(price, '').slice(0, 120).trim(),
      price,
      availability: '',
      url: absolutizeUrl(anchor[1], source.url),
      sourceUrl: source.url,
      fetchedAt,
      status: 'ok',
      note: 'Extracted from visible product link text.',
    });
  }

  return dedupeProducts(candidates);
}

function dedupeProducts(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function stableProductId(source, value) {
  return `${source.competitor}-${source.brand}-${String(value ?? source.url).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80)}`;
}

function cleanText(value) {
  return stripHtml(String(value ?? ''))
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&pound;/g, '£')
    .replace(/&nbsp;/g, ' ');
}

function formatPrice(price, currency) {
  if (!price) return '';
  const prefix = currency === 'GBP' || !currency ? '£' : `${currency} `;
  return String(price).startsWith('£') ? String(price) : `${prefix}${price}`;
}

function absolutizeUrl(url, base) {
  try {
    return new URL(url, base).toString();
  } catch {
    return base;
  }
}

function shortError(error) {
  return String(error?.message ?? error ?? 'Fetch failed').slice(0, 180);
}

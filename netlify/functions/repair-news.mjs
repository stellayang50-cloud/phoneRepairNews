import { fetchRepairNews } from '../../lib/repairNews.mjs';

export async function handler() {
  try {
    const data = await fetchRepairNews({ limit: 8 });
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=900, stale-while-revalidate=3600',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

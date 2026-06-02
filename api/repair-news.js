import { fetchRepairNews } from '../lib/repairNews.mjs';

export default async function handler(request, response) {
  try {
    const data = await fetchRepairNews({ limit: 8 });
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

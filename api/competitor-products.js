import { fetchCompetitorProducts } from '../lib/competitorProducts.mjs';

export default async function handler(request, response) {
  try {
    const data = await fetchCompetitorProducts({ limitPerSource: 12 });
    response.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

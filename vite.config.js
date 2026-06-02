import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fetchCompetitorProducts } from './lib/competitorProducts.mjs';
import { fetchRepairNews } from './lib/repairNews.mjs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'repair-news-api',
      configureServer(server) {
        server.middlewares.use('/api/repair-news', async (_request, response) => {
          try {
            const data = await fetchRepairNews({ limit: 8 });
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(data));
          } catch (error) {
            response.statusCode = 500;
            response.end(JSON.stringify({ error: error.message }));
          }
        });

        server.middlewares.use('/api/competitor-products', async (_request, response) => {
          try {
            const data = await fetchCompetitorProducts({ limitPerSource: 12 });
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(data));
          } catch (error) {
            response.statusCode = 500;
            response.end(JSON.stringify({ error: error.message }));
          }
        });
      },
    },
  ],
});

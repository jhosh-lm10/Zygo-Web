// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://zygo.com',
  integrations: [sitemap()],
  image: {
    domains: ['lh3.googleusercontent.com'],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // Performance: Prefetch pages when links enter viewport
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport', // Prefetch when link is visible (faster than hover)
  },
});

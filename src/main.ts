import { PuppeteerGoodreads } from 'puppeteer-goodreads';

import { KingleHighlightsSyncService } from './service/kindleHighlightsSyncService';

// Read secure keys from .env
const results = require('dotenv').config();
const { GOODREADS_LOGIN: login, GOODREADS_PASSWORD: password } = results.parsed;

(async (): Promise<void> => {
  const goodreadsScraper = new PuppeteerGoodreads({
    puppeteer: { headless: true },
  });

  await goodreadsScraper.signin(login, password);

  const syncService = new KingleHighlightsSyncService(goodreadsScraper);
  await syncService.sync();

  await goodreadsScraper.close();
})();

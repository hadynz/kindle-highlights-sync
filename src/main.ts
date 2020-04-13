import { PuppeteerGoodreads } from 'puppeteer-goodreads';
import { KindleHighlightsApi } from './services/kindleHighlightsApi';

// Read secure keys from .env
const results = require('dotenv').config();
const { GOODREADS_LOGIN: login, GOODREADS_PASSWORD: password } = results.parsed;

(async (): Promise<void> => {
  const defaultOptions = { headless: true };
  const goodreads = new PuppeteerGoodreads({
    puppeteer: defaultOptions,
  });

  const api = new KindleHighlightsApi();

  await goodreads.signin(login, password);

  const books = await goodreads.getMyBooks();
  books.forEach(api.createBook);

  await goodreads.close();
})();

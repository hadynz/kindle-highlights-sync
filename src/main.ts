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

  // Loop in reverse order since list of books scraped from Goodreads is ordered (desc)
  for (let i = books.length; i > 0; i--) {
    const book = books[i - 1];
    await api.createBook(book);
  }

  await goodreads.close();
})();

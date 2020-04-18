import { PuppeteerGoodreads } from 'puppeteer-goodreads';

import { KindleHighlightsApi } from './services/kindleHighlightsApi';
import reduceListForSync from './utils/reduceListForSync';

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

  // Latest list of GoodReadsBooks
  const goodreadBooks = await goodreads.getMyBooks();

  // Latest list of ApiBooks. Interested in what's the last ApiBook saved.
  const lastSyncedBook = (await api.getBooks())[0];
  console.log('Last Synced Book:', lastSyncedBook);

  const booksToSync = reduceListForSync(goodreadBooks, lastSyncedBook);
  console.log(
    `Books in Goodreads: ${goodreadBooks.length}. Books to sync: ${booksToSync.length}`,
  );

  // Loop in reverse order since list of books scraped from Goodreads is ordered (desc)
  for (let i = booksToSync.length - 1; i >= 0; i--) {
    const book = booksToSync[i];
    try {
      await api.createBook(book);
    } catch (err) {
      console.error(`Couldn't sync book: ${book.title}. Error: ${err}`);
    }
  }

  await goodreads.close();
})();

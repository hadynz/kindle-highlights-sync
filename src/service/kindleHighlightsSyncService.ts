import { PuppeteerGoodreads } from 'puppeteer-goodreads';

import { KindleHighlightsApi } from '../repository/kindleHighlightsApi';
import reduceListForSync from '../util/reduceListForSync';

class KingleHighlightsSyncService {
  private _goodreadsScraper: PuppeteerGoodreads;

  constructor(goodreadsScraper: PuppeteerGoodreads) {
    this._goodreadsScraper = goodreadsScraper;
  }

  public async sync(): Promise<void> {
    const api = new KindleHighlightsApi();

    // Latest list of GoodReadsBooks
    const goodreadBooks = await this._goodreadsScraper.getMyBooks();

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
  }
}

export { KingleHighlightsSyncService };

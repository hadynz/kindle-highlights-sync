import { PuppeteerGoodreads, Book as GoodreadsBook } from 'puppeteer-goodreads';

import { KindleHighlightsApi } from '../repository/kindleHighlightsApi';
import reduceListForSync from '../util/reduceListForSync';

class KingleHighlightsSyncService {
  private _goodreadsScraper: PuppeteerGoodreads;
  private _api: KindleHighlightsApi;

  constructor(goodreadsScraper: PuppeteerGoodreads) {
    this._goodreadsScraper = goodreadsScraper;
    this._api = new KindleHighlightsApi();
  }

  public async syncBook(book: GoodreadsBook): Promise<void> {
    try {
      await this._api.createBook(book);
    } catch (err) {
      console.error(`Couldn't sync book: ${book.title}. Error: ${err}`);
    }
  }

  public async sync(): Promise<void> {
    // Scrape complete list of GoodReadsBooks
    const goodreadBooks = await this._goodreadsScraper.getMyBooks();

    // Latest list of ApiBooks. Interested in what's the last ApiBook saved.
    const lastSyncedBook = (await this._api.getBooks())[0];
    console.log('Last Synced Book:', lastSyncedBook);

    const booksToSync = reduceListForSync(goodreadBooks, lastSyncedBook);
    console.log(
      `Books in Goodreads: ${goodreadBooks.length}. Books to sync: ${booksToSync.length}`,
    );

    // Loop in reverse order since list of books scraped from Goodreads is ordered (desc)
    for (let i = booksToSync.length - 1; i >= 0; i--) {
      const book = booksToSync[i];
      await this.syncBook(book);
    }
  }
}

export { KingleHighlightsSyncService };

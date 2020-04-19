import { PuppeteerGoodreads, Book as GoodreadsBook } from 'puppeteer-goodreads';
import { Guid } from 'guid-typescript';

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
      const { bookId: createdBookId } = await this._api.createBook(book);
      await this.syncBookHighlights(book, (createdBookId as unknown) as Guid);
    } catch (err) {
      console.error(`Couldn't sync book: ${book.title}. Error: ${err}`);
    }
  }

  private async syncBookHighlights(
    book: GoodreadsBook,
    createdBookId: Guid,
  ): Promise<void> {
    try {
      const highlights = await this._goodreadsScraper.getBookHighlights(book);
      await this._api.createBookHighlights(createdBookId, highlights);
    } catch (err) {
      console.error(
        `Couldn't sync book highlights: ${book.title}. Error: ${err}`,
      );
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
      break;
    }
  }
}

export { KingleHighlightsSyncService };

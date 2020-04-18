import { Book as GoodreadsBook } from 'puppeteer-goodreads';

import { Book } from '../../src/interface/Book';
import reduceListForSync from '../../src/util/reduceListForSync';

const getDefaults = (): GoodreadsBook => ({
  asin: '',
  title: '',
  author: '',
  imageUrl: '',
  bookUrl: '',
});

const getFakeBook = (p?: Partial<GoodreadsBook>): GoodreadsBook => ({
  ...getDefaults(),
  ...p,
});

describe('Reducing list of books required to sync their book highlights', () => {
  const books: Array<GoodreadsBook> = [
    getFakeBook({ asin: '1234', title: 'Book A' }),
    getFakeBook({ asin: '7H23', title: 'Book B' }),
    getFakeBook({ asin: '23AB', title: 'Book C' }),
    getFakeBook({ asin: '55HJ', title: 'Book D' })
  ];

  it('Reduce list of books when no sync has happened before', () => {
    const lastSyncBook: Book = undefined;

    const list = reduceListForSync(books, lastSyncBook);

    expect(list).toHaveLength(4);
    expect(list[0]).toEqual(books[0]);
    expect(list[1]).toEqual(books[1]);
    expect(list[2]).toEqual(books[2]);
    expect(list[3]).toEqual(books[3]);
  });

  it('Reduce list of books always includes the last book', () => {
    const lastSyncBook: Book = {
      ...books[0],
      bookId: '',
      createdAt: null,
      updatedAt: null,
    };

    const list = reduceListForSync(books, lastSyncBook);

    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(books[0]);
  });

  it('Reduce list of books works if only one book was synced before', () => {
    const lastSyncBook: Book = {
      ...books[3],
      bookId: '',
      createdAt: null,
      updatedAt: null,
    };

    const list = reduceListForSync(books, lastSyncBook);

    expect(list).toHaveLength(4);
    expect(list[0]).toEqual(books[0]);
    expect(list[1]).toEqual(books[1]);
    expect(list[2]).toEqual(books[2]);
    expect(list[3]).toEqual(books[3]);
  });

  it('Reduce list of books works if three books were synced before', () => {
    const lastSyncBook: Book = {
      ...books[1],
      bookId: '',
      createdAt: null,
      updatedAt: null,
    };

    const list = reduceListForSync(books, lastSyncBook);

    expect(list).toHaveLength(2);
    expect(list[0]).toEqual(books[0]);
    expect(list[1]).toEqual(books[1]);
  });
});

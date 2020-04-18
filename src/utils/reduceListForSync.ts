import { Book as GoodreadsBook } from 'puppeteer-goodreads';

import { Book } from '../interfaces/Book';

export default function reduceListForSync(
  books: Array<GoodreadsBook>,
  book: Book,
): Array<GoodreadsBook> {
  for (let i = books.length - 1; i >= 0; i--) {
    if (books[i].asin === book?.asin) {
      return books.slice(0, i + 1);
    }
  }
  return books;
}

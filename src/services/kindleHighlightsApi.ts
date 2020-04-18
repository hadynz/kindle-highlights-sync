import { Book as GoodreadsBook } from 'puppeteer-goodreads';
import axios, { AxiosError } from 'axios';

import { BookCreatedResponse } from '../interfaces/BookCreatedResponse';
import { Book } from '../interfaces/Book';

class KindleHighlightsApi {
  public async getBooks(): Promise<Array<Book>> {
    try {
      const { data } = await axios.get('http://localhost:5000/api/books');
      return data.map(
        book =>
          ({
            bookId: book.bookId,
            asin: book.asin,
            title: book.title,
            author: book.author,
            imageUrl: book.imageUrl,
            bookUrl: book.bookUrl,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
          } as Book),
      );
    } catch (ex) {
      const error: AxiosError = ex;
      console.error(error);
      throw error;
    }
  }

  public async createBook(book: GoodreadsBook): Promise<BookCreatedResponse> {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/books',
        book,
      );

      const response: BookCreatedResponse = {
        bookId: data.bookId,
      };

      return response;
    } catch (ex) {
      const error: AxiosError = ex;
      console.error(error);
      throw error;
    }
  }
}

export { KindleHighlightsApi };

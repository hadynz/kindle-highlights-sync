import { Book } from 'puppeteer-goodreads';
import axios, { AxiosError } from 'axios';

import { BookCreatedResponse } from '../interfaces/BookCreatedResponse';

class KindleHighlightsApi {
  public async createBook(book: Book): Promise<BookCreatedResponse> {
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

import {
  Book as GoodreadsBook,
  Highlight as GoodreadsHighlight,
} from 'puppeteer-goodreads';
import axios, { AxiosError } from 'axios';
import { Guid } from 'guid-typescript';

import { BookCreatedResponse } from '../interface/BookCreatedResponse';
import { BookHighlightsCreatedResponse } from '../interface/BookHighlightsCreatedResponse';
import { BookHighlightCreateRequest } from '../interface/BookHighlightCreateRequest';
import { BookHighlightCreatedResponse } from '../interface/BookHighlightCreatedResponse';
import { Book } from '../interface/Book';

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

  public async createBookHighlights(
    bookId: Guid,
    highlights: Array<GoodreadsHighlight>,
  ): Promise<BookHighlightsCreatedResponse> {
    try {
      const request = highlights.map(
        h =>
          ({
            text: h.text,
            annotationId: h.annotationId,
            locationPercentage: h.locationPercentage,
          } as BookHighlightCreateRequest),
      );

      const { data } = await axios.post(
        `http://localhost:5000/api/books/${bookId}/highlights`,
        request,
      );

      const response: BookHighlightCreatedResponse = {
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

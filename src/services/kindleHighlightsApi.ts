import { Book } from 'puppeteer-goodreads';
import axios from 'axios';

class KindleHighlightsApi {
  public async createBook(book: Book): Promise<any> {
    console.log(`creating book ${book.title}`);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/books',
        book,
      );
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { KindleHighlightsApi };

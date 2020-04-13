import { PuppeteerGoodreads, Book } from 'puppeteer-goodreads';
import axios from 'axios';

// Read secure keys from .env
const results = require('dotenv').config();
const { GOODREADS_LOGIN: login, GOODREADS_PASSWORD: password } = results.parsed;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function createBook(book: Book) {
  console.log(`creating book ${book.title}`);
  try {
    const response = await axios.post('http://localhost:5000/api/books', book);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

(async (): Promise<void> => {
  const defaultOptions = { headless: true };
  const goodreads = new PuppeteerGoodreads({
    puppeteer: defaultOptions,
  });

  await goodreads.signin(login, password);

  const books = await goodreads.getMyBooks();
  books.forEach(createBook);

  await goodreads.close();
})();

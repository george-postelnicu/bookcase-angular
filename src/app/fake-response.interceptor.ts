import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {ALL_BOOKS} from "./models/book-data-common";
import {PagedBooks} from "./models/paged-books";
import {Book} from "./models/book";
import {ErrorResponse} from "./models/error";

let counter = 1;

export const fakeResponseInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api/books') && req.method === 'GET') {
    console.log(`Api call ${req.url} intercepted ${counter++}`);
    let fakeResponse: any = ALL_BOOKS;
    let status: number = 200;

    if ((req.url.match(/\//g) || []).length > 1) {
      const id: number = Number(req.url.substring(req.url.lastIndexOf("/") + 1));
      fakeResponse = getBook(id);
      if (id < 1 || id > 3) {
        status = 404;
      }
    }

    // Handle filtering when query params are provided via HttpParams (Angular keeps URL without '?')
    const hasHttpParams: boolean = req.params && req.params.keys().length > 0;
    if (hasHttpParams) {
      const usp = new URLSearchParams();
      req.params.keys().forEach(k => {
        const values = req.params.getAll(k) ?? [];
        values.forEach(v => usp.append(k, v));
      });
      fakeResponse = filterBooksByParams(usp);
    }

    return of(new HttpResponse({status: status, body: fakeResponse}));
  } else {
    return next(req);
  }
};

function getBook(id: number): Book | ErrorResponse {
  for (const book of ALL_BOOKS.content) {
    if (book.id == id) {
      return book;
    }
  }
  return {title: `Cannot find [BOOK] with [${id}]`};
}

function filterBooksByParams(params: URLSearchParams): PagedBooks {
  const getAllLower = (key: string) => params.getAll(key).map(v => v.toLowerCase());
  const getLower = (key: string) => (params.get(key) ?? '').toLowerCase();

  const name = getLower('name');
  const fullTitle = getLower('full_title');
  const description = getLower('description');
  const isbn = getLower('isbn');
  const barcode = getLower('barcode');
  const publisher = getLower('publisher');
  const authors = getAllLower('authors');
  const keywords = getAllLower('keywords');
  const languages = getAllLower('languages');
  const cover = getLower('cover_type');
  const minYear = params.get('min_year') ? Number(params.get('min_year')) : null;
  const maxYear = params.get('max_year') ? Number(params.get('max_year')) : null;
  const minPages = params.get('min_pages') ? Number(params.get('min_pages')) : null;
  const maxPages = params.get('max_pages') ? Number(params.get('max_pages')) : null;

  const filtered = ALL_BOOKS.content.filter(book => {
    const byName = !name || (book.name ?? '').toLowerCase().includes(name);
    const byFull = !fullTitle || (book.fullTitle ?? '').toLowerCase().includes(fullTitle);
    const byDesc = !description || (book.description ?? '').toLowerCase().includes(description);
    const byIsbn = !isbn || (book.isbn ?? '').toLowerCase().includes(isbn);
    const byBarcode = !barcode || (book.barcode ?? '').toLowerCase().includes(barcode);
    const byPublisher = !publisher || (book.publisher ?? '').toLowerCase().includes(publisher);
    const byAuthors = !authors.length || (book.authors ?? []).some(a => authors.includes((a.name ?? '').toLowerCase()));
    const byKeywords = !keywords.length || (book.keywords ?? []).some(k => keywords.includes((k.name ?? '').toLowerCase()));
    const byLanguages = !languages.length || (book.languages ?? []).some(l => languages.includes((l.name ?? '').toLowerCase()));
    const byCover = !cover || ((book.cover ?? '').toString().toLowerCase() === cover);
    const byYearMin = minYear == null || (book.publishYear ?? Number.MIN_SAFE_INTEGER) >= minYear;
    const byYearMax = maxYear == null || (book.publishYear ?? Number.MAX_SAFE_INTEGER) <= maxYear;
    const byPagesMin = minPages == null || (book.pages ?? Number.MIN_SAFE_INTEGER) >= minPages;
    const byPagesMax = maxPages == null || (book.pages ?? Number.MAX_SAFE_INTEGER) <= maxPages;

    return byName && byFull && byDesc && byIsbn && byBarcode && byPublisher && byAuthors && byKeywords && byLanguages && byCover && byYearMin && byYearMax && byPagesMin && byPagesMax;
  });

  return {
    content: filtered,
    pageable: ALL_BOOKS.pageable,
    totalPages: ALL_BOOKS.totalPages,
    totalElements: filtered.length,
    last: ALL_BOOKS.last,
    first: ALL_BOOKS.first,
    size: ALL_BOOKS.size,
    number: ALL_BOOKS.number,
    sort: ALL_BOOKS.sort,
    numberOfElements: filtered.length,
    empty: filtered.length === 0
  };
}

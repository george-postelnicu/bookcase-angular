import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

import { BookSearchParams, BookService } from './book.service';
import { CoverType } from './models/cover-type';
import { emptyResult, PagedBooks } from './models/paged-books';
import { Book } from './models/book';
import { StatusType } from './models/status-type';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBooks', () => {
    it('should fetch all books successfully', (done) => {
      const mockResult: PagedBooks = { ...emptyResult, totalElements: 1 };

      service.getBooks().subscribe((result) => {
        expect(result).toEqual(mockResult);
        done();
      });

      const req = httpMock.expectOne('api/books');
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    });

    it('should return emptyResult when getBooks encounters an HTTP error', (done) => {
      service.getBooks().subscribe((result) => {
        expect(result).toEqual(emptyResult);
        done();
      });

      const req = httpMock.expectOne('api/books');
      expect(req.request.method).toBe('GET');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getBook', () => {
    it('should fetch a single book by id', (done) => {
      const mockBook: Book = { id: 1, name: 'Sample Book', status: StatusType.HAVE };

      service.getBook(1).subscribe((book) => {
        expect(book).toBeTruthy();
        expect(book.id).toBe(1);
        expect(book.name).toBe('Sample Book');
        done();
      });

      const req = httpMock.expectOne('api/books/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockBook);
    });

    it('should return undefined when getBook fails with 404', (done) => {
      service.getBook(999).subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('api/books/999');
      expect(req.request.method).toBe('GET');
      req.flush(
        { title: 'Cannot find [BOOK] with [999]' },
        { status: 404, statusText: 'Not Found' },
      );
    });
  });

  describe('search', () => {
    it('should serialize search params including all primitive, number, enum, and array fields', (done) => {
      const params: BookSearchParams = {
        page: 0,
        size: 10,
        name: 'Design',
        full_title: 'Full Design Book',
        description: 'Great book',
        isbn: '1234567890',
        barcode: '987654321',
        publisher: 'Tech Books',
        cover_type: CoverType.HARDCOVER,
        min_year: 2000,
        max_year: 2025,
        min_pages: 100,
        max_pages: 500,
        authors: ['Paul', 'Ada', ''],
        keywords: ['Architecture', 'Tech'],
        languages: ['English'],
      };

      const mockResult: PagedBooks = { ...emptyResult, totalElements: 1 };

      service.search(params).subscribe((result) => {
        expect(result).toEqual(mockResult);
        done();
      });

      const req = httpMock.expectOne((r) => r.url === 'api/books');
      expect(req.request.method).toBe('GET');
      const p = req.request.params;
      expect(p.get('page')).toBe('0');
      expect(p.get('size')).toBe('10');
      expect(p.get('name')).toBe('Design');
      expect(p.get('full_title')).toBe('Full Design Book');
      expect(p.get('description')).toBe('Great book');
      expect(p.get('isbn')).toBe('1234567890');
      expect(p.get('barcode')).toBe('987654321');
      expect(p.get('publisher')).toBe('Tech Books');
      expect(p.get('cover_type')).toBe('HARDCOVER');
      expect(p.get('min_year')).toBe('2000');
      expect(p.get('max_year')).toBe('2025');
      expect(p.get('min_pages')).toBe('100');
      expect(p.get('max_pages')).toBe('500');
      expect(p.getAll('authors')).toEqual(['Paul', 'Ada']);
      expect(p.getAll('keywords')).toEqual(['Architecture', 'Tech']);
      expect(p.getAll('languages')).toEqual(['English']);

      req.flush(mockResult);
    });

    it('should handle search params with empty, null, or undefined values without appending them', (done) => {
      const params: BookSearchParams = {
        name: '',
        full_title: null,
        description: undefined,
        authors: [],
        keywords: null,
        languages: ['   ', ''],
      };

      service.search(params).subscribe((result) => {
        expect(result).toEqual(emptyResult);
        done();
      });

      const req = httpMock.expectOne((r) => r.url === 'api/books');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(emptyResult);
    });

    it('should return emptyResult when search encounters an HTTP error', (done) => {
      service.search({ name: 'Error' }).subscribe((result) => {
        expect(result).toEqual(emptyResult);
        done();
      });

      const req = httpMock.expectOne((r) => r.url === 'api/books');
      expect(req.request.method).toBe('GET');
      req.flush('Network error', { status: 500, statusText: 'Server Error' });
    });

    it('should handle non-Error objects in handleError with default operation', (done) => {
      const errorHandler = (
        service as unknown as { handleError: () => (err: unknown) => Observable<unknown> }
      ).handleError();
      errorHandler('raw string error').subscribe((result: unknown) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should handle Error instances in handleError', (done) => {
      const errorHandler = (
        service as unknown as {
          handleError: (op: string, res: PagedBooks) => (err: unknown) => Observable<PagedBooks>;
        }
      ).handleError('customOp', emptyResult);
      errorHandler(new Error('custom error message')).subscribe((result: PagedBooks) => {
        expect(result).toEqual(emptyResult);
        done();
      });
    });
  });
});

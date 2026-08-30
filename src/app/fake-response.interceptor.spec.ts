import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeResponseInterceptor } from './fake-response.interceptor';
import { Book } from './models/book';
import { PagedBooks } from './models/paged-books';
import { ALL_BOOKS } from './models/book-data-common';
import { CoverType } from './models/cover-type';

describe('fakeResponseInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([fakeResponseInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Passthrough for non-intercepted requests', () => {
    it('should pass through requests when URL does not contain api/books', (done) => {
      http.get<{ status: string }>('api/authors').subscribe({
        next: (res) => {
          expect(res.status).toBe('ok');
          done();
        },
      });

      const req = httpMock.expectOne('api/authors');
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'ok' });
    });

    it('should pass through non-GET requests to api/books', (done) => {
      http.post<{ success: boolean }>('api/books', { title: 'New Book' }).subscribe({
        next: (res) => {
          expect(res.success).toBe(true);
          done();
        },
      });

      const req = httpMock.expectOne('api/books');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });
  });

  describe('Single Book Retrieval by ID', () => {
    it('should return book details for valid book ID (1)', (done) => {
      http.get<Book>('api/books/1').subscribe({
        next: (book) => {
          expect(book).toBeTruthy();
          expect(book.id).toBe(1);
          expect(book.name).toBe('Landscapes of Identity');
          done();
        },
        error: () => {
          fail('Should not throw error for valid book ID');
        },
      });
    });

    it('should return book details for valid book ID (2)', (done) => {
      http.get<Book>('api/books/2').subscribe({
        next: (book) => {
          expect(book).toBeTruthy();
          expect(book.id).toBe(2);
          expect(book.name).toBe('Conflicts and adaptations');
          done();
        },
      });
    });

    it('should return book details for valid book ID (3)', (done) => {
      http.get<Book>('api/books/3').subscribe({
        next: (book) => {
          expect(book).toBeTruthy();
          expect(book.id).toBe(3);
          expect(book.name).toBe('100 Steps Through 20th Century Estonian Architecture');
          done();
        },
      });
    });

    it('should return 404 HttpErrorResponse for non-existent book ID (999)', (done) => {
      http.get<Book>('api/books/999').subscribe({
        next: () => {
          fail('Should not succeed for non-existent book ID');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error.title).toContain('Cannot find [BOOK] with [999]');
          done();
        },
      });
    });

    it('should return 404 HttpErrorResponse for ID < 1', (done) => {
      http.get<Book>('api/books/0').subscribe({
        next: () => {
          fail('Should not succeed for ID 0');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });
    });

    it('should return 404 HttpErrorResponse for invalid book ID string', (done) => {
      http.get<Book>('api/books/invalid').subscribe({
        next: () => {
          fail('Should not succeed for invalid book ID');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });
    });
  });

  describe('Book Collection and Filtering', () => {
    it('should return all books when calling api/books without parameters', (done) => {
      http.get<PagedBooks>('api/books').subscribe({
        next: (result) => {
          expect(result).toBeTruthy();
          expect(result.content.length).toBe(ALL_BOOKS.content.length);
          expect(result.totalElements).toBe(ALL_BOOKS.totalElements);
          done();
        },
      });
    });

    it('should filter books by name', (done) => {
      const params = new HttpParams().set('name', 'landscapes');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(1);
          done();
        },
      });
    });

    it('should filter books by full_title', (done) => {
      const params = new HttpParams().set('full_title', 'Soviet');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(2);
          done();
        },
      });
    });

    it('should filter books by description', (done) => {
      const params = new HttpParams().set('description', 'lorem');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(2);
          done();
        },
      });
    });

    it('should filter books by isbn', (done) => {
      const params = new HttpParams().set('isbn', 'ISBN 978-9949-687-32-9');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(1);
          done();
        },
      });
    });

    it('should filter books by barcode', (done) => {
      const params = new HttpParams().set('barcode', '9789949687442');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(2);
          done();
        },
      });
    });

    it('should filter books by publisher', (done) => {
      const params = new HttpParams().set('publisher', 'Estonian Museum of Architecture');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(3);
          done();
        },
      });
    });

    it('should filter books by authors', (done) => {
      const params = new HttpParams().append('authors', 'Linda Kalijundi');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(1);
          done();
        },
      });
    });

    it('should filter books by keywords', (done) => {
      const params = new HttpParams().append('keywords', '20th Century Architecture');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(2);
          done();
        },
      });
    });

    it('should filter books by languages', (done) => {
      const params = new HttpParams().append('languages', 'Estonian');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(3);
          done();
        },
      });
    });

    it('should filter books by cover_type', (done) => {
      const params = new HttpParams().set(
        'cover_type',
        CoverType.SOFTCOVER_WITH_DUST_JACKET.toLowerCase(),
      );
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(3);
          done();
        },
      });
    });

    it('should filter books by publish year range (min_year and max_year)', (done) => {
      const params = new HttpParams().set('min_year', '2020').set('max_year', '2022');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(2);
          done();
        },
      });
    });

    it('should filter books by page count range (min_pages and max_pages)', (done) => {
      const params = new HttpParams().set('min_pages', '100').set('max_pages', '150');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(2); // IDs 1 and 2 have 111 pages, ID 3 has 215, ID 4 has 253
          done();
        },
      });
    });

    it('should handle pagination parameters (page and size)', (done) => {
      const params = new HttpParams().set('page', '1').set('size', '1');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.size).toBe(1);
          expect(result.number).toBe(1);
          expect(result.pageable.pageNumber).toBe(1);
          expect(result.pageable.pageSize).toBe(1);
          expect(result.pageable.offset).toBe(1);
          expect(result.content.length).toBe(1);
          expect(result.totalPages).toBe(4);
          expect(result.totalElements).toBe(4);
          expect(result.first).toBe(false);
          expect(result.last).toBe(false);
          done();
        },
      });
    });

    it('should return empty list when no books match filters', (done) => {
      const params = new HttpParams().set('name', 'non_existent_book_title_xyz');
      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(0);
          expect(result.totalElements).toBe(0);
          expect(result.empty).toBe(true);
          done();
        },
      });
    });
  });

  describe('Sparse and optional book properties filtering', () => {
    const sparseBook1: Book = {
      id: 100,
      fullTitle: 'Sparse Book One',
    } as unknown as Book;

    const sparseBook2: Book = {
      id: 101,
      name: 'Sparse Book Two',
      fullTitle: 'Sparse Book Two Full',
      description: 'Sparse Description',
      isbn: 'SPARSE-ISBN',
      barcode: 'SPARSE-BARCODE',
      publisher: 'Sparse Publisher',
      authors: [{ id: 10 }],
      keywords: [{ id: 10 }],
      languages: [{ id: 10 }],
      cover: CoverType.HARDCOVER,
      publishYear: 2020,
      pages: 150,
    } as unknown as Book;

    beforeEach(() => {
      ALL_BOOKS.content.push(sparseBook1, sparseBook2);
      ALL_BOOKS.totalElements = ALL_BOOKS.content.length;
    });

    afterEach(() => {
      ALL_BOOKS.content = ALL_BOOKS.content.filter((b) => b.id !== 100 && b.id !== 101);
      ALL_BOOKS.totalElements = ALL_BOOKS.content.length;
    });

    it('should filter sparse books exercising fallback branches for all optional properties', (done) => {
      const params = new HttpParams()
        .set('name', 'sparse')
        .set('isbn', 'sparse')
        .set('barcode', 'sparse')
        .set('publisher', 'sparse')
        .set('cover_type', 'hardcover')
        .set('min_year', '2010')
        .set('max_year', '2030')
        .set('min_pages', '100')
        .set('max_pages', '200')
        .append('authors', 'nonexistent_author')
        .append('keywords', 'nonexistent_keyword')
        .append('languages', 'nonexistent_language');

      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(0);
          done();
        },
      });
    });

    it('should handle search queries when book fields are missing or undefined', (done) => {
      const params = new HttpParams()
        .set('min_year', '1900')
        .set('max_year', '2100')
        .set('min_pages', '1')
        .set('max_pages', '1000')
        .set('name', 'Sparse Book Two');

      http.get<PagedBooks>('api/books', { params }).subscribe({
        next: (result) => {
          expect(result.content.length).toBe(1);
          expect(result.content[0].id).toBe(101);
          done();
        },
      });
    });
  });
});

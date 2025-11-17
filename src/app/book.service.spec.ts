import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BookSearchParams, BookService } from './book.service';
import { CoverType } from './models/cover-type';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should serialize search params including arrays and numbers', () => {
    const params: BookSearchParams = {
      name: 'Design',
      authors: ['Paul', 'Ada'],
      min_year: 2000,
      max_pages: 500,
      cover_type: CoverType.HARDCOVER
    };

    service.search(params).subscribe();

    const req = httpMock.expectOne(r => r.url === 'api/books');
    expect(req.request.method).toBe('GET');
    const p = req.request.params;
    expect(p.get('name')).toBe('Design');
    expect(p.getAll('authors')).toEqual(['Paul', 'Ada']);
    expect(p.get('min_year')).toBe('2000');
    expect(p.get('max_pages')).toBe('500');
    expect(p.get('cover_type')).toBe('HARDCOVER');

    req.flush({});
    httpMock.verify();
  });
});

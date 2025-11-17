import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BooksComponent } from './books.component';
import { ALL_BOOKS } from '../models/book-data-common';
import { emptyResult, PagedBooks } from '../models/paged-books';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;

    // Initial change detection triggers constructor -> fetchAll -> GET api/books
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function makePagedBooks(contentIds: number[]): PagedBooks {
    const content = ALL_BOOKS.content.filter(b => contentIds.includes(b.id));
    return {
      ...emptyResult,
      content,
      totalElements: content.length,
      numberOfElements: content.length,
      empty: content.length === 0
    };
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    // Flush initial pending GET from constructor-triggered fetchAll to satisfy verify()
    const req = httpMock.expectOne('api/books');
    req.flush(ALL_BOOKS);
    fixture.detectChanges();
  });

  it('should display loading state while fetching initial books', () => {
    const el: HTMLElement = fixture.nativeElement;
    const section = el.querySelector('section.search') as HTMLElement;
    // Before flushing the HTTP call, loading should be true
    expect(section.getAttribute('aria-busy')).toBe('true');
    const input: HTMLInputElement = el.querySelector('#search-box')!;
    const submitBtn: HTMLButtonElement = el.querySelector('button[type="submit"]')!;
    expect(input.disabled).toBeTrue();
    expect(submitBtn.disabled).toBeTrue();

    // Now respond to initial GET
    const req = httpMock.expectOne('api/books');
    expect(req.request.method).toBe('GET');
    req.flush(ALL_BOOKS);
    fixture.detectChanges();

    expect(section.getAttribute('aria-busy')).toBe('false');
  });

  it('should render the list of books after initial load', () => {
    // Flush initial load
    const req = httpMock.expectOne('api/books');
    req.flush(ALL_BOOKS);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('ul.books li.book-item');
    expect(items.length).toBe(ALL_BOOKS.content.length);
    // spot-check for the first item text contains id and name
    expect(items[0].textContent).toContain(String(ALL_BOOKS.content[0].id));
    expect(items[0].textContent).toContain(ALL_BOOKS.content[0].name);
  });

  it('should perform search even when searching with < 3 chars', () => {
    // Flush initial load first
    httpMock.expectOne('api/books').flush(ALL_BOOKS);
    fixture.detectChanges();

    component.term.set('ab');
    component.onSubmit();
    fixture.detectChanges();

    // A search request should be made including the short name term
    const searchReq = httpMock.expectOne(r => r.url === 'api/books' && r.params.get('name') === 'ab');
    expect(searchReq.request.method).toBe('GET');
    searchReq.flush(ALL_BOOKS);
    fixture.detectChanges();
  });

  it('should perform search and render filtered results for >= 3 chars', () => {
    // Flush initial load first
    httpMock.expectOne('api/books').flush(ALL_BOOKS);
    fixture.detectChanges();

    component.term.set('Architecture');
    component.onSubmit();
    fixture.detectChanges();

    const searchReq = httpMock.expectOne(r => r.url === 'api/books' && r.params.get('name') === 'Architecture');
    expect(searchReq.request.method).toBe('GET');

    // Build a response including only the book with id 3 (Architecture)
    const filtered = makePagedBooks([3]);
    searchReq.flush(filtered);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('ul.books li.book-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('100 Steps Through 20th Century Estonian Architecture');
  });

  it('should reset term and reload all books', () => {
    // Flush initial load
    httpMock.expectOne('api/books').flush(ALL_BOOKS);
    fixture.detectChanges();

    // Do a search first
    component.term.set('Architecture');
    component.onSubmit();
    fixture.detectChanges();
    httpMock.expectOne(r => r.url === 'api/books' && r.params.get('name') === 'Architecture').flush(makePagedBooks([3]));
    fixture.detectChanges();

    // Now reset
    component.onReset();
    fixture.detectChanges();

    // Should trigger another fetchAll
    const refetch = httpMock.expectOne('api/books');
    refetch.flush(ALL_BOOKS);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const input: HTMLInputElement = el.querySelector('#search-box')!;
    expect(input.value).toBe('');
    const items = el.querySelectorAll('ul.books li.book-item');
    expect(items.length).toBe(ALL_BOOKS.content.length);
  });

  it('should perform advanced search with multiple parameters and AND semantics', () => {
    // Flush initial load
    httpMock.expectOne('api/books').flush(ALL_BOOKS);
    fixture.detectChanges();

    // Set advanced filters
    component.term.set('Metsa'); // matches book 1 name includes 'Metsa'
    component.authors.set('Artur'); // author Artur Juhkam present in book 1
    component.minYear.set(2012);
    component.maxPages.set(500);

    component.onSubmit();
    fixture.detectChanges();

    const req = httpMock.expectOne(r => {
      if (r.url !== 'api/books') return false;
      const p = r.params;
      return p.get('name') === 'Metsa'
        && (p.getAll('authors') ?? []).includes('Artur')
        && p.get('min_year') === '2012'
        && p.get('max_pages') === '500';
    });
    expect(req.request.method).toBe('GET');

    // Respond with book id 1 only, since it matches all filters
    req.flush(makePagedBooks([1]));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('ul.books li.book-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain(String(ALL_BOOKS.content[0].id));
  });
});

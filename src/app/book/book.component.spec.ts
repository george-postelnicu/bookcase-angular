import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';

import { BookComponent } from './book.component';
import { Book } from '../models/book';
import { landscapesOfIdentity } from '../models/book-data-common';
import { BookService } from '../book.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let expected: Book;
  let bookService: jasmine.SpyObj<BookService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRouteStub: { snapshot: { paramMap: Map<string, string> } };

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getBook']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    bookService.getBook.and.returnValue(of(landscapesOfIdentity()));
    activatedRouteStub = { snapshot: { paramMap: new Map([['id', '1']]) } };

    await TestBed.configureTestingModule({
      imports: [BookComponent],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expected = landscapesOfIdentity();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back when goBack() is called', () => {
    const location = TestBed.inject(Location);
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should have all elements present', () => {
    bookService.getBook.and.returnValue(of(landscapesOfIdentity()));
    fixture.detectChanges();

    const htmlElement: HTMLElement = fixture.nativeElement;
    const h2 = htmlElement.querySelector('h2')!;
    const h4 = htmlElement.querySelector('h4')!;
    const h5 = htmlElement.querySelector('h5')!;
    const divIsbn = htmlElement.querySelector('.book-isbn')!;
    const divStatus = htmlElement.querySelector('.book-status')!;
    const divCover = htmlElement.querySelector('.book-cover')!;
    expect(h2.textContent).toEqual(expected.name + ' Details');
    expect(h4.textContent).toEqual(expected.fullTitle!);
    expect(h5.textContent).toEqual(expected.description!);
    expect(divIsbn.textContent).toEqual('isbn: ' + expected.isbn);
    expect(divStatus.textContent).toEqual('status: ' + expected.status);
    expect(divCover.textContent).toContain('cover: ');
  });

  it('should redirect to page not found when book does not exist (null or empty response)', () => {
    bookService.getBook.and.returnValue(of(null as unknown as Book));
    const notFoundFixture = TestBed.createComponent(BookComponent);
    notFoundFixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should redirect to page not found when getBook throws an error', () => {
    bookService.getBook.and.returnValue(throwError(() => new Error('Not found')));
    const notFoundFixture = TestBed.createComponent(BookComponent);
    notFoundFixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should redirect to page not found when id is invalid or not a number', () => {
    bookService.getBook.calls.reset();
    activatedRouteStub.snapshot.paramMap = new Map([['id', 'invalid-id']]);
    const invalidFixture = TestBed.createComponent(BookComponent);
    invalidFixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
    expect(bookService.getBook).not.toHaveBeenCalled();
  });

  it('should redirect to page not found when id is 0 or negative', () => {
    bookService.getBook.calls.reset();
    activatedRouteStub.snapshot.paramMap = new Map([['id', '0']]);
    const zeroFixture = TestBed.createComponent(BookComponent);
    zeroFixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
    expect(bookService.getBook).not.toHaveBeenCalled();
  });

  it('should redirect to page not found when id parameter is missing', () => {
    bookService.getBook.calls.reset();
    activatedRouteStub.snapshot.paramMap = new Map();
    const missingParamFixture = TestBed.createComponent(BookComponent);
    missingParamFixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
    expect(bookService.getBook).not.toHaveBeenCalled();
  });
});

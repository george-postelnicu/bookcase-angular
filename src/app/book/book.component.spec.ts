import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookComponent} from './book.component';
import {Book} from "../models/book";
import {landscapesOfIdentity} from "../models/book-data-common";
import {BookService} from "../book.service";
import {of} from "rxjs";
import { ActivatedRoute } from '@angular/router';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let expected: Book;
  let bookService: any;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getBook']);
    // Default return to avoid undefined.subscribe during ngOnInit
    bookService.getBook.and.returnValue(of(landscapesOfIdentity()));

    await TestBed.configureTestingModule({
      imports: [BookComponent],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expected = landscapesOfIdentity();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    expect(h2.textContent).toEqual(expected.name + " Details");
    expect(h4.textContent).toEqual(expected.fullTitle!);
    expect(h5.textContent).toEqual(expected.description!);
    expect(divIsbn.textContent).toEqual("isbn: " + expected.isbn);
    expect(divStatus.textContent).toEqual("status: " + expected.status);
    expect(divCover.textContent).toContain("cover: ");
  });
});

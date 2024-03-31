import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookComponent} from './book.component';
import {Book} from "../models/book";
import {landscapesOfIdentity} from "../models/book-data-common";
import {BookService} from "../book.service";
import {Observable, of} from "rxjs";

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let expected: Book;
  let bookService: any;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getBook']);

    await TestBed.configureTestingModule({
      imports: [BookComponent],
      providers: [{ provide: BookService, useValue: bookService }],
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
    const h3 = htmlElement.querySelector('h3')!;
    const h5 = htmlElement.querySelector('h5')!;
    const divId = htmlElement.querySelector('.book-id')!;
    const divName = htmlElement.querySelector('.book-name')!;
    const divStatus = htmlElement.querySelector('.book-status')!;
    expect(h2.textContent).toEqual(expected.name + " Details");
    expect(h3.textContent).toEqual(expected.fullTitle!);
    expect(h5.textContent).toEqual(expected.description!);
    expect(divId.textContent).toEqual("id: " + expected.id);
    expect(divName.textContent).toEqual("name: " + expected.name);
    expect(divStatus.textContent).toEqual("status: " + expected.status);
  });
});

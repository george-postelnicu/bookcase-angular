import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookComponent} from './book.component';
import {Book} from "./book";
import {landscapesOfIdentity} from "./book-data-common";

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let expected: Book;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookComponent]
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
    const htmlElement: HTMLElement = fixture.nativeElement;
    const h2 = htmlElement.querySelector('h2')!;
    const divId = htmlElement.querySelector('.book-id')!;
    const divName = htmlElement.querySelector('.book-name')!;
    const divStatus = htmlElement.querySelector('.book-status')!;
    expect(h2.textContent).toEqual(expected.name + " Details");
    expect(divId.textContent).toEqual("id: " + expected.id);
    expect(divName.textContent).toEqual("name: " + expected.name);
    expect(divStatus.textContent).toEqual("status: " + expected.status);
  });
});

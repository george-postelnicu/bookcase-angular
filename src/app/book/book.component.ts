import {Component} from '@angular/core';
import {Book} from "./book";
import {landscapesOfIdentity} from "./book-data-common";

@Component({
  selector: 'book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  book: Book = landscapesOfIdentity();
}

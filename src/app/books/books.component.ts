import {Component, OnInit} from '@angular/core';
import {Book} from "../book/book";
import {NgForOf} from "@angular/common";
import {BookService} from "../book.service";
import {Observable} from "rxjs";

@Component({
  selector: 'books',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getBooks()
      .subscribe(books => this.books = books);
  }
}

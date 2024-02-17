import {Component, OnInit} from '@angular/core';
import {Book} from "./book";
import {landscapesOfIdentity} from "./book-data-common";
import {BookService} from "../book.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  book: Book = landscapesOfIdentity();

  constructor(private route: ActivatedRoute, private bookService: BookService, private location: Location) {
  }

  ngOnInit(): void {
    this.getBook();
  }

  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(id)
      .subscribe(book => this.book = book);
  }

  goBack(): void {
    this.location.back();
  }
}

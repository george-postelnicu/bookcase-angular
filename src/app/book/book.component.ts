import {Component, OnInit} from '@angular/core';
import {Book} from "./book";
import {BookService} from "../book.service";
import {ActivatedRoute} from "@angular/router";
import {Location, NgIf} from "@angular/common";

@Component({
  selector: 'book',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  book!: Book;

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

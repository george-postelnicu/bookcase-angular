import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    imports: [RouterLink],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss']
})
export class PageFooterComponent {

  constructor(
    private router: Router
  ) { }

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

}

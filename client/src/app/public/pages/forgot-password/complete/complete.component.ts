import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  goToLogin(): void {
    this.router.navigate(['../../login'], { relativeTo: this.activatedRoute });
  }

}

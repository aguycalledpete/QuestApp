import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() icon: string;
  @Input() size: string;
  @Input() height: string;
  @Input() width: string;

  ngOnInit(): void {
    if (!this.size) {
      return;
    }
    if (!this.height) {
      this.height = this.size;
    }
    if (!this.width) {
      this.width = this.size;
    }
  }

}

import { Component, HostListener } from '@angular/core';
import { DeviceDetectorService } from './services/device-detector/device-detector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private deviceDetectorService: DeviceDetectorService
  ) { 
    this.deviceDetectorService.update();
  }

  @HostListener('window.resize', ['$event'])
  onResize(event: any) {
    this.deviceDetectorService.update();
  }
}

import { Component } from '@angular/core';
import { DeviceDetectorService } from 'src/app/public/services/device-detector/device-detector.service';

@Component({
  selector: 'app-private-pages-container',
  templateUrl: './private-pages-container.component.html',
  styleUrls: ['./private-pages-container.component.scss']
})
export class PrivatePagesContainerComponent {

  IsMobileSize$ = this.deviceDetectorService.isMobileSizeObservable();

  constructor(
    private deviceDetectorService: DeviceDetectorService
  ) { }

}

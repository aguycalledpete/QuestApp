import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DeviceDetectorService } from '../device-detector/device-detector.service';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    private matSnackBar: MatSnackBar,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  displayMatSnackBar(message: string, duration: number = 3000): void {
    const isMobileSize = this.deviceDetectorService.getIsMobileSize();
    const horizontalPosition = isMobileSize ? 'center' : 'right';
    const buttonText = isMobileSize ? 'X' : 'Close';
    const matSnackBarOptions = this.createMatSnackBarConfig(duration, horizontalPosition, 'top');
    this.matSnackBar.open(message, buttonText, matSnackBarOptions);
  }

  private createMatSnackBarConfig(
    duration: number = 2000,
    horizontalPosition: MatSnackBarHorizontalPosition,
    verticalPosition: MatSnackBarVerticalPosition
  ): MatSnackBarConfig<any> {
    const config: MatSnackBarConfig<any> = {
      duration, horizontalPosition, verticalPosition
    };
    return config;
  }
}

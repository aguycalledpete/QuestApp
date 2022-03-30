import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    private matSnackBar: MatSnackBar
  ) { }

  displayMatSnackBar(message: string, duration: number = 3000): void {
    const matSnackBarOptions = this.createMatSnackBarConfig(duration, 'right', 'top');
    this.matSnackBar.open(message, 'Close', matSnackBarOptions);
  }

  private createMatSnackBarConfig(
    duration: number = 2000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'right',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ): MatSnackBarConfig<any> {
    const config: MatSnackBarConfig<any> = {
      duration, horizontalPosition, verticalPosition
    };
    return config;
  }
}

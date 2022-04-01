import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  private readonly maxMobileSize = 575;
  private isMobileSize: Observable<boolean>;
  private isMobileSizeSubject: BehaviorSubject<boolean>;

  constructor(
  ) {
    this.isMobileSizeSubject = new BehaviorSubject<boolean>(this.checkIsMobileSize());
    this.isMobileSize = this.isMobileSizeSubject.asObservable();
  }

  isMobileSizeObservable(): Observable<boolean> {
    return this.isMobileSize;
  }

  getIsMobileSize(): boolean {
    return this.isMobileSizeSubject.value;
  }

  update() {
    const isMobileSize = this.checkIsMobileSize();
    if (isMobileSize !== this.isMobileSizeSubject.value) {
      this.isMobileSizeSubject.next(isMobileSize);
    }
  }

  private checkIsMobileSize(): boolean {
    const windowSize = this.getWindowSize();
    const isMobileSize = windowSize <= this.maxMobileSize;
    return isMobileSize;
  }

  private getWindowSize(): number {
    return window.innerWidth;
  }

}

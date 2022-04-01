import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  private readonly maxMobileSize = 768;
  private isMobileSize: Observable<boolean>;
  private isMobileSizeSubject: BehaviorSubject<boolean>;

  constructor(
  ) {
    this.isMobileSizeSubject = new BehaviorSubject<boolean>(this.getIsMobileSize());
    this.isMobileSize = this.isMobileSizeSubject.asObservable();
  }

  isMobileSizeObservable(): Observable<boolean> {
    return this.isMobileSize;
  }

  private getIsMobileSize(): boolean {
    const windowSize = this.getWindowSize();
    const isMobileSize = windowSize <= this.maxMobileSize;
    return isMobileSize;
  }

  private getWindowSize(): number {
    return window.innerWidth;
  }

  update() {
    const isMobileSize = this.getIsMobileSize();
    if (isMobileSize !== this.isMobileSizeSubject.value) {
      this.isMobileSizeSubject.next(isMobileSize);
    }
  }

}

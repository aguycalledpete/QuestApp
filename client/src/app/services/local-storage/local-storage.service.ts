import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  store(key: string, value: any, stringify?: boolean): void {
    localStorage.removeItem(key);
    if (stringify) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  getValue(key: string): string {
    const value = localStorage.getItem(key);
    return value;
  }

  getValueParsed<T>(key: string): T {
    const value = this.getValue(key);
    const valueParsed: T = JSON.parse(value);
    return valueParsed;
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }

}

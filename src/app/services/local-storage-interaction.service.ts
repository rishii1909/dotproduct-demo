import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageInteractionService {

  /**
    * saveData : saves key value pair in local storage.
    */
   static saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  
  /**
   * fetchData : returns item from local storage.
   */
  static fetchData(key : string) {
    return localStorage.getItem(key);
  }

  /**
   * clearData : clears all data from local storage.
   */
  static clearData() {
    localStorage.clear();
  }

  constructor() { }
}

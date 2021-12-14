import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  /**
   * 
   * @param key string
   * @param value object
   * @returns 
   */

  public async setItem(key: string, value: any): Promise<boolean> {
    let result: boolean = false;
    try {
      await Storage.set({
        key: key,
        value: JSON.stringify(value)
      })
    } catch (err) {
      console.log(err);


    }
    return Promise.resolve(result);

  }

  public async getItem(key: string): Promise<any> {
    let value = null;
    try {
      value = await Storage.get({ key: key });
      value=value.value
      if(value!=null)
        value = JSON.parse(value);

    } catch (err) {
      console.log(err);
    }
    return Promise.resolve(value);

  }

  public async removeItem(key: string): Promise<boolean> {
    let result = false;
    try {
      await Storage.remove({ key: key });
      result = true
    } catch (err) {
      console.log(err);

    }
    return Promise.resolve(result);
  }
}

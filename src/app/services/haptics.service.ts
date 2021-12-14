import { Injectable } from '@angular/core';
import { Haptics,ImpactStyle } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class HapticsService {

  constructor() { }
  async vibrate(){
    Haptics.vibrate({duration:50000});
    Haptics.impact({
      style:ImpactStyle.Heavy
    });
    
  }
}

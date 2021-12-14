import { Component, ElementRef, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonToggle } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('map')mapView:ElementRef;
  public image:any;

  constructor( private traductor:TranslateService,
    private storage:LocalStorageService) {
   /* traductor.setDefaultLang("en");
    traductor.use("es");
    traductor.get("TAKE A PICTURE").toPromise().then((data=>{
      console.log(data);
      
    }))*/
  }
  public async cambiaIdioma(event){
    console.log(event);
    if(event&& event.detail && event.detail.checked){
     await this.storage.setItem('lang',{lang:'en'});
      this.traductor.use('en');
    } else{
      await this.storage.setItem('lang',{lang:'es'});
      this.traductor.use('es');
    }
    
  }
  ionViewDidEnter(){
    //this.createMap();
    
  }/*
  createMap(){
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect()as DOMRect;
    CapacitorGoogleMaps.
  }
*/

  public async hazFoto(){
    let options:ImageOptions={
      resultType:CameraResultType.Uri,
      allowEditing:false,
      quality:90,
      source:CameraSource.Camera
    }
    let result:Photo= await Camera.getPhoto(options);
    this.image=result.webPath;

  }

}

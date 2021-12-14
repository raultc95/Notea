import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private traductor: TranslateService,
    private storage: LocalStorageService,
    private authS:AuthService,
    private platform:Platform
    ) {
      this.platform.backButton.subscribeWithPriority(1, () => {
        navigator['app'].exitApp();
 });
     
    let tmp = (async () => {
      let lang = await storage.getItem("lang");
      if (lang == null) {
        lang = this.traductor.getBrowserLang();
      } else {
        lang=lang.lang;
      }
    })();

  }
  async ngOnInit() {
    await this.authS.loadSession();
    
  }
  ionViewDidEnter(){
    navigator[''].clearHistory();    
  }
  
  
  
}

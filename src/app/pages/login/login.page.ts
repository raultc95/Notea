import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
public userinfo:User;
private isAndroid:boolean;
  constructor(private plataform:Platform,
    private authS:AuthService,
    private router:Router) {

    this.isAndroid=plataform.is("android");
    if(!this.isAndroid)
    GoogleAuth.init();//lee la config clientid del meta de index.html
   
      
    
   }

  ngOnInit() {
  }
  ionViewWillEnter(){
    if(this.authS.isLogged){
      this.router.navigate(['private/tabs/tab1']);
    }
  }
 
  public async signin(){
    try{
      await this.authS.login();
      this.router.navigate(['private/tabs/tab1']);

    } catch(err){
      console.log(err);
      
    }
    
  }

}

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ToastController } from '@ionic/angular';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';
import { AlertController } from '@ionic/angular';
import { HapticsService } from '../services/haptics.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;
  public notas: Note[] = [];
  private miLoading: HTMLIonLoadingElement;
  public searchTerm:string;

  constructor(private ns: NoteService,
    private loading: LoadingController,
    private toast: ToastController,
    private authS: AuthService,
    private router: Router,
    public alertController: AlertController,
    public vibration:HapticsService) { }

  async ionViewDidEnter() {
    await this.cargaNotas();

  }
  public async edita(note: Note) {
    this.router.navigate(['private/tabs/tab2'], { state: { note: note } });
  }

  public async borra(nota: Note) {
    this.vibration.vibrate();
     this.alertController.create({
      header: 'ALERTA',
      subHeader: 'Borrado de Notas',
      message: '¿Quiere eliminar esta Nota?',
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.ns.remove(nota.key);
             
            
            let i = this.notas.indexOf(nota, 0)
            if (i > -1) {
              this.notas.splice(i, 1);
            }
            console.log('SI');

          }
        },
        {
          text: 'NO',
          handler: () => {

            console.log('NO');

          }
        }
      ]
    }).then(res => {
      res.present();
      
      
    });
    await this.presentLoading();
   // await this.ns.remove(nota.key);
      await this.miLoading.dismiss();
    //await this.cargaNotas();
  }
  public async cargaNotas(event?) {
    if (this.infinite) {
      this.infinite.disabled = false;
    }
    if (!event) {
      await this.presentLoading();
    }
    this.notas = [];
    try {
      this.notas = await this.ns.getNotesByPage('algo').toPromise();
    } catch (err) {
      console.error(err);
      await this.presentToast("Error cargando datos", "danger");
    } finally {
      if (event) {
        event.target.complete();
      } else {
        await this.miLoading.dismiss();
      }
    }


  }
  public async logout() {
    await this.authS.logout();
    this.router.navigate(['']);
  }
  async presentLoading() {
    this.miLoading = await this.loading.create({
      message: ''
    });
    await this.miLoading.present();
  }

  async presentToast(msg: string, clr: string) {
    const miToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    miToast.present();
  }
  public async cargaInfinita($event) {
    console.log("CARGANDO");
    let nuevasNotas = await this.ns.getNotesByPage().toPromise();
    if (nuevasNotas.length < 10) {
      $event.target.disabled = true;
    }
    this.notas = this.notas.concat(nuevasNotas);
    $event.target.complete();

  }


}

import { computeMsgId } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Color } from '@ionic/core';
import { Note } from '../model/Note';
import { NoteService } from '../services/note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public formNota:FormGroup;
  private miLoading:HTMLIonLoadingElement;
  private miToast:HTMLIonToastElement;
  private note:Note;
  public title:string;
  public button:string;


  constructor(private fb:FormBuilder,private noteS:NoteService,
    private loading:LoadingController,private toast:ToastController, private router:Router) {
      this.note = { title: '', description: '' }
     
      this.formNota=this.fb.group({
        title:[this.note.title,Validators.required],
        description:[this.note.description]
      });

    
  }
  ionViewDidEnter(){
    this.note = history.state.note;
 
   
    if(this.note==undefined){
      this.note = { title: '', description: '' }
      this.title='Nueva nota';
      this.button='AGREGAR';
    } else{
      this.title='Editar nota';
      this.button='EDITAR';
    }
    this.formNota=this.fb.group({
      title:[this.note.title,Validators.required],
      description:[this.note.description]
    });  
    
  }
  public async addNote(){
    this.note.title = this.formNota.get("title").value;
    this.note.description = this.formNota.get("description").value;

    await this.presentLoading();
    if(this.note==undefined){
      try{
        let id = await this.noteS.addNote(this.note);
        this.miLoading && this.miLoading.dismiss();
        await this.presentToast("Nota agregada correctamente","success");
        this.formNota.reset();
      }catch(err){
        console.log(err); //<--no en produccion
        this.miLoading && this.miLoading.dismiss();
        await this.presentToast("Error al agregar nota","danger");
      }
    } else{
      try{
        await this.noteS.edit(this.note);
        this.miLoading && this.miLoading.dismiss();
        await this.presentToast("Nota editada correctamente","success");
        this.formNota.reset();
      }catch(err){
        console.log(err); //<--no en produccion
        this.miLoading && this.miLoading.dismiss();
        await this.presentToast("Error al editar nota","danger");
      }
    }
    
  }
  async presentLoading(){
    this.miLoading = await this.loading.create({
      message:''
    });
    await this.miLoading.present();
  }

  async presentToast(msg:string,clr:string){
    this.miToast = await this.toast.create({
      message: msg,
      duration:2000,
      color:clr
    });
    this.miToast.present();
  }

}

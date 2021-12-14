import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/compat/firestore';
import { Note } from '../model/Note';
//import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';



@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private last=null;
  private myCollection:AngularFirestoreCollection;

  constructor(private db:AngularFirestore) { 
    this.myCollection=db.collection<any>(environment.firebaseConfig.notesCollection)
  }

  public addNote(note:Note):Promise<string>{
    return new Promise(async(resolve, reject)=>{
      try{
        let response:DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add({title:note.title,description:note.description});
        resolve(response.id);
      }catch(err){
        reject(err);
      }
    });
  }/**
   * getNotesByPage()->page=1,criteria=undefined
   * getNotesBypage(2)->page=2,criteria=undefined
   * getNotesBypage(2,'title')   
   * @param page 
   * @param criteria 
   */
public getNotesByPage(all?):Observable<Note[]>{
  if(all){
    this.last=null;
  }
  return new Observable((observer) => {
    let result: Note[] = [];
    let query=null;
    if(this.last){
      query=this.db.collection<any>(environment.firebaseConfig.notesCollection,
        ref => ref.limit(10).startAfter(this.last));
    }else{
      query=this.db.collection<any>(environment.firebaseConfig.notesCollection,
        ref => ref.limit(10));
    }
    
      
      query.get()
      .subscribe(
        (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
          data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
            this.last=d;
            let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
            let id = d.id; //devuelve la key del objeto
            result.push({ 'key': id, ...tmp });
            //operador spread-> 'title':tmp.title,'description':tmp.description
          })
          observer.next(result);  ///este es el return del observable que devolvemos
          observer.complete();
        }) //final del subscribe
  }); //final del return observable

}


  public getNotes():Observable<Note[]>{

    return new Observable((observer)=>{
      let result:Note[]=[];
      this.myCollection.get().subscribe(
        (data:firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>)=>{
          data.docs.forEach((d:firebase.default.firestore.DocumentData)=>{
            let tmp=d.data();//devuelve el objeto almacenado -> la nota con title
            let id=d.id;//devuelve la key del objeto
            result.push({'key': d.id,...tmp});
            //operador spread-> 'title' : tmp.title,'descripcion': tmp.description
          })
          observer.next(result);
          observer.complete();
        })//final del subscribe
      
    });// final del return observable   
  } // final del metodo getNotes
  public getNote(id:string) :Promise<Note>{
    return new Promise (async (resolve,reject)=>{
      let note:Note=null;
      try {
        let result: firebase.default.firestore.DocumentData=await this.myCollection.doc(id).get().toPromise();
        note={
          id:result.id,
          ...result.data()
        }
        resolve(note);
      } catch (err) {
        reject(err);
      }
    })
  }

  public remove(id:string):Promise<void>{
    return this.myCollection.doc(id).delete();
  }
  public edit(note:Note):Promise<void>{

    return this.myCollection.doc(note.key).set(note);
  }
  
}

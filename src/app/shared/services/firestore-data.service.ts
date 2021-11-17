import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {

  constructor(
    private firestore: AngularFirestore
  ) { }
  createData(data, collectionName): any {
    data.createdAt = new Date();
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(collectionName)
        .add(data)
        .then(res => { }, err => reject(err));
    });
  }
}

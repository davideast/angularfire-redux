import { Action } from './interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  CollectionReference,
  DocumentReference,
  Query
} from '@firebase/firestore-types';
import { 
  AngularFirestore, 
  AngularFirestoreCollection, 
  AngularFirestoreDocument 
} from 'angularfire2/firestore';

export class ActionsCol extends Observable<Action> {

  constructor(private path: string, private afs: AngularFirestore) {
    super();
    this.source = afs.collection(path).stateChanges();
  }

}

export class ActionsDoc extends Observable<Action> {

  constructor(private path: string, private afs: AngularFirestore) {
    super();
    this.source = afs.doc(path).snapshotChanges();
  }

}
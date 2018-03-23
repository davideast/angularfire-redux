import { Action } from './interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

@Injectable()
export class Store {

  constructor(private afs: AngularFirestore) { }

  selectCol(
    path: string,
    queryCb?: (ref: CollectionReference) => Query,
    selectorCb?: (
      obs$: Observable<any>,
      col: AngularFirestoreCollection<any>,
      afs: AngularFirestore
    ) => Observable<any>
  ): Observable<any> { 
    const collection = this.afs.collection<any>(path, queryCb);
    const obs$ = collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const { type, payload } = action;
          const data = payload.doc.data();
          const id = payload.doc.id;
          return { id, type, ...data };
        });
      })
    );

    if (typeof selectorCb === 'function') {
      return selectorCb(obs$, collection, this.afs);
    }

    return obs$;
  }

  selectDoc(
    path: string,
    selectorCb?: (
      obs$: Observable<any>,
      col: AngularFirestoreDocument<any>,
      afs: AngularFirestore
    ) => Observable<any>
  ): Observable<any> {
    const doc = this.afs.doc<any>(path);
    return doc.snapshotChanges().pipe(
      map(action => {
        const { type, payload } = action;
        const data = payload.data();
        const id = payload.id;
        return { id, type, ...data };
      })
    );
  }

  dispatch(action: Action) {
    const { path, type, payload } = action;
    switch(type) {
      case 'add':
        return this.afs.collection(path).add(payload);
      case 'update':
        return this.afs.doc(path).update(payload);
      case 'set':
        return this.afs.doc(path).set(payload);
      case 'delete':
        return this.afs.doc(path).delete();
    }
  }
}

import { Action } from './interfaces';
import { Actions } from './actions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class Store {

  constructor(
    private afs: AngularFirestore,
    private actions$: Actions,
  ) { }

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
    const snapChanges$ = collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const { type, payload } = action;
          const data = payload.doc.data();
          const id = payload.doc.id;
          return { id, type, ...data };
        });
      }),
      tap(payload => {
        const type = `${path}_value`.toUpperCase();
        this.actions$.next({ type, payload });
      }),
    );

    if (typeof selectorCb === 'function') {
      return selectorCb(snapChanges$, collection, this.afs);
    }

    return snapChanges$;
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
        // hack until AF publishes w/ `-types` packages
        return this.afs.collection(path)
          .add(payload) as Promise<DocumentReference>;
      case 'update':
        return this.afs.doc(path).update(payload);
      case 'set':
        return this.afs.doc(path).set(payload);
      case 'delete':
        return this.afs.doc(path).delete();
    }
  }
}

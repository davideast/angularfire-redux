import { Action } from './interfaces';
import { AngularFirestore } from 'angularfire2/firestore';

export class Dispatcher {
  constructor(private path: string, private afs: AngularFirestore) { }

  dispatch(action: Action) {
    const { type, payload } = action;
    switch(type) {
      case 'add':
        this.afs.collection(this.path).add(payload);
        break;
      case 'update':
        this.afs.doc(this.path).update(payload);
        break;
      case 'set':
        this.afs.doc(this.path).set(payload);
        break;
      case 'delete':
        this.afs.doc(this.path).delete();
        break;
    }
  }
}

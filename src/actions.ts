import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

export const INIT = 'angularfire-redux/init' as 'angularfire-redux/init';

export interface Action {
  type: string;
  payload?: any;
}

@Injectable()
export class Actions extends BehaviorSubject<any> 
  implements OnDestroy {

  constructor() {
    super({ INIT });
  }

  next(action: Action): void {
    if (typeof action === 'undefined') {
      throw new TypeError(`Actions must be objects`);
    } else if (typeof action.type === 'undefined') {
      throw new TypeError(`Actions must have a type property`);
    }

    super.next(action);
  }

  complete() {
    /* noop */
  }

  ngOnDestroy() {
    super.complete();
  }

}

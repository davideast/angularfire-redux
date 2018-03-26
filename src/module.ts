import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Store } from './store';
import { Actions } from './actions';

@NgModule({
  imports: [
    AngularFirestoreModule,
  ],
  providers: [
    Store,
    Actions,
  ],
})
export class AngularFireReduxModule { }

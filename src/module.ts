import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Store } from './store';

@NgModule({
  imports: [
    AngularFirestoreModule
  ],
  providers: [
    Store
  ]
})
export class AngularFireReduxModule { }

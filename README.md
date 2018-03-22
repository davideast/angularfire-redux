# AngularFire Redux

### Realtime NgRx without the reducers.

## Description
This is an experimental library for making AngularFire more NgRx-like. It's not a replacement for AngularFire, it's an additive piece. AngularFire already works in a redux-ish fashion. This library changes the API surface so it more closely matches NgRx. However, since the Firebase SDK handles the synchronization of data and remote updates reducers and custom actions are not needed to manage data.

## Install
```
yarn add angularfire-redux
```

## Example
```ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from 'angularfire-redux';
import { FieldValue } from '@firebase/firestore-types';
import { 
  AngularFirestore, 
  AngularFirestoreCollection 
} from 'angularfire2/firestore';

export interface Item {
  name: string;
  id: string;
  type: string;
  date: FieldValue;
}

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor="let item of items$ | async">
        <span>{{ item.name }}</span>
        <button (click)="delete(item)">Delete</button>
      </li>
    </ul>
  `
})
export class AppComponent implements OnInit {
  items$: Observable<Item[]>;
  constructor(private store: Store) { }

  ngOnInit() {
    this.items$ = this.store.selectCol('items', r => r.orderBy('date'));
  }

  delete(item: Item) {
    this.store
        .path(`items/${item.id}`)
        .dispatch({ type: 'delete' });
  }

}
```

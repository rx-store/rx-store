import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RootRxStore {
  counterChange$ = new Subject<number>();
  count$ = new BehaviorSubject<number>(0);
}

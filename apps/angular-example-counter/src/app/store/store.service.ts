import { Injectable, OnDestroy } from '@angular/core';
import { Effect } from '@rx-store/rx-store';

@Injectable({
  providedIn: 'root'
})
export class StoreService implements OnDestroy {

  appEffect: any;

  init(storeValue: any, storeEffect: Effect<any>): void {
    this.appEffect = storeEffect(storeValue);
  }

  ngOnDestroy(): void {
    if (this.appEffect){
      this.appEffect();
    }
  }

}

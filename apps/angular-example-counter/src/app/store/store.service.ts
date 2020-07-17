import { Injectable, OnDestroy } from '@angular/core';
import { RxStoreEffect } from '@rx-store/rx-store';

@Injectable({
  providedIn: 'root'
})
export class StoreService implements OnDestroy {

  appEffect: any;

  init(storeValue: any, storeEffect: RxStoreEffect<any>): void {
    this.appEffect = storeEffect(storeValue);
  }

  ngOnDestroy(): void {
    if (this.appEffect){
      this.appEffect();
    }
  }

}

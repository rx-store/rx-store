import { Injectable, OnDestroy } from '@angular/core';
import { Effect, spawnRootEffect } from '@rx-store/core';
import { Observable, Subscription } from 'rxjs';
import { AppStoreValue } from '../types';

@Injectable({
  providedIn: 'root',
})
export class StoreManagerService implements OnDestroy {
  rootEffect: Observable<any>;
  rootEffectSubscription: Subscription;
  store: AppStoreValue;
  init(storeValue: AppStoreValue, storeEffect: Effect<any>): void {
    this.store = storeValue;
    this.rootEffect = spawnRootEffect(storeValue, storeEffect);
    this.rootEffectSubscription = this.rootEffect.subscribe();
  }

  ngOnDestroy(): void {
    this.rootEffectSubscription.unsubscribe();
  }
}

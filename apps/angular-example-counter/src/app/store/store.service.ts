import { Injectable, OnDestroy } from '@angular/core';
import { Effect, spawnRootEffect } from '@rx-store/core';
import { Observable, Subscription } from 'rxjs';
import { RootAppStore } from '../types';

@Injectable({
  providedIn: 'root',
})
export class StoreService implements OnDestroy {
  rootEffect: Observable<any>;
  rootEffectSubscription: Subscription;
  store: RootAppStore;
  init(storeValue: RootAppStore, storeEffect: Effect<any>): void {
    this.store = storeValue;
    this.rootEffect = spawnRootEffect(storeValue, storeEffect);
    this.rootEffectSubscription = this.rootEffect.subscribe();
  }

  ngOnDestroy(): void {
    this.rootEffectSubscription.unsubscribe();
  }
}

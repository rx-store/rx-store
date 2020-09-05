import { Injectable, OnDestroy } from '@angular/core';
import { Effect, spawnRootEffect } from '@rx-store/core';
import { Observable, Subscription } from 'rxjs';
import { AppStoreValue } from '../types';

@Injectable({
  providedIn: 'root',
})
export class StoreManagerService implements OnDestroy {
  rootEffect!: Observable<never>;
  rootEffectSubscription!: Subscription;
  store!: AppStoreValue;
  init(value: AppStoreValue, effect: Effect<AppStoreValue, never>): void {
    this.store = value;
    this.rootEffect = spawnRootEffect<AppStoreValue>({ value, effect });
    this.rootEffectSubscription = this.rootEffect.subscribe();
  }

  ngOnDestroy(): void {
    this.rootEffectSubscription.unsubscribe();
  }
}

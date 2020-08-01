import { Injectable } from '@angular/core';
import { RootRxStore } from '../root-rx-store';
import { scanSum } from '../store/operators/scan-sum';

@Injectable()
export class CounterStoreService {
  count$ = this.rootStore.counterChange$.pipe(scanSum());
  constructor(public readonly rootStore: RootRxStore) {}
}

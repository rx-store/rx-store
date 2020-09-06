import { expect } from '@jest/globals';
import { ReplaySubject, Observable } from 'rxjs';
import { spawnRootEffect } from './effect';
import { SpawnRootEffectArgs, resetIds } from '..';
import { TestScheduler } from 'rxjs/testing';
import { StoreValue } from './store-value';
import { StoreEvent } from './store-arg';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';

interface CallbackArgs extends RunHelpers {
  storeEvent$: Observable<StoreEvent>;
  effect$: Observable<unknown>;
}

export const setup = <T extends StoreValue>(
  setupArgs: SpawnRootEffectArgs<T>,
  cb: (args: CallbackArgs) => void
) => {
  resetIds();
  const storeEvent$ = new ReplaySubject<StoreEvent>();
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const effect$ = spawnRootEffect<T>({ ...setupArgs, observer: storeEvent$ });
  testScheduler.run((runHelpers) => {
    cb({ ...runHelpers, storeEvent$, effect$ });
  });
};

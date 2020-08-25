import { expect } from '@jest/globals';
import { ReplaySubject, Observable } from 'rxjs';
import { spawnRootEffect } from './effect';
import { RootEffectArgs, resetIds } from '..';
import { TestScheduler } from 'rxjs/testing';
import { StoreValue } from './store-value';
import { StoreEvent } from './store-arg';

interface CallbackArgs {
  expectObservable: typeof TestScheduler.prototype.expectObservable;
  storeEvent$: Observable<StoreEvent>;
  effect$: Observable<unknown>;
}

export const setup = <T extends StoreValue>(
  args: RootEffectArgs<T>,
  cb: (args: CallbackArgs) => void
) => {
  resetIds();
  const storeEvent$ = new ReplaySubject<StoreEvent>();
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const effect$ = spawnRootEffect<T>({ ...args, observer: storeEvent$ });
  testScheduler.run(({ expectObservable }) => {
    cb({ expectObservable, storeEvent$, effect$ });
  });
};

import { of, ReplaySubject, timer, Observable } from 'rxjs';
import { spawnRootEffect } from './effect';
import { Effect, RootEffectArgs } from '..';
import { TestScheduler } from 'rxjs/testing';
import { StoreValue } from './store-value';
import { StoreEvent } from './store-arg';

interface CallbackArgs {
  expectObservable: typeof TestScheduler.prototype.expectObservable;
  storeEvent$: Observable<StoreEvent>;
  effect$: Observable<unknown>;
}

const setup = <T extends StoreValue>(
  args: RootEffectArgs<T>,
  cb: (args: CallbackArgs) => void
) => {
  const storeEvent$ = new ReplaySubject<StoreEvent>();
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const effect$ = spawnRootEffect<T>({ ...args, observer: storeEvent$ });
  testScheduler.run(({ expectObservable }) => {
    cb({ expectObservable, storeEvent$, effect$ });
  });
};

it('spawns and tears down an empty effect', () => {
  const effect: Effect<{}> = () => of();
  setup({ value: {}, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('|');
    expectObservable(storeEvent$).toBe('(ab)', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

it('spawns and tears down an effect with a timer', () => {
  const effect: Effect<{}> = () => timer(10);
  setup({ value: {}, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('----------(a|)', { a: 0 });
    expectObservable(storeEvent$).toBe('  a---------(bc)', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: {
        type: 'value',
        from: { name: '', type: 'effect' },
        to: { name: 'root', type: 'effect' },
        value: 0,
      },
      c: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

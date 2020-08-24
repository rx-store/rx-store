import { of, ReplaySubject, timer, Observable } from 'rxjs';
import { spawnRootEffect } from './effect';
import { Effect, RootEffectArgs, resetIds } from '..';
import { TestScheduler } from 'rxjs/testing';
import { StoreValue } from './store-value';
import { StoreEvent } from './store-arg';
import { toArray, take, takeUntil } from 'rxjs/operators';

interface CallbackArgs {
  expectObservable: typeof TestScheduler.prototype.expectObservable;
  storeEvent$: Observable<StoreEvent>;
  effect$: Observable<unknown>;
}

const setup = <T extends StoreValue>(
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

it('spawns an effect that spawns a child effect', () => {
  const effect: Effect<{}> = ({ spawnEffect }) => {
    spawnEffect(() => of(), { name: 'child' });
    return of();
  };
  setup({ value: {}, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('|');
    expectObservable(storeEvent$).toBe('(abcd)', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: { event: 'spawn', name: 'child', type: 'effect' },
      c: {
        from: { name: 'child', type: 'effect' },
        to: { name: 'root', type: 'effect' },
        type: 'link',
      },
      d: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

it('numbers the child effects', () => {
  const effect: Effect<{}> = ({ spawnEffect }) => {
    spawnEffect(() => of(), { name: 'child' });
    spawnEffect(() => of(), { name: 'child' });
    spawnEffect(() => of(), { name: 'child' });
    return of();
  };
  setup({ value: {}, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('|');
    expectObservable(storeEvent$).toBe('(abcdefgh)', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: { event: 'spawn', name: 'child', type: 'effect' },
      c: {
        from: { name: 'child', type: 'effect' },
        to: { name: 'root', type: 'effect' },
        type: 'link',
      },
      d: { event: 'spawn', name: 'child2', type: 'effect' },
      e: {
        from: { name: 'child2', type: 'effect' },
        to: { name: 'root', type: 'effect' },
        type: 'link',
      },
      f: { event: 'spawn', name: 'child3', type: 'effect' },
      g: {
        from: { name: 'child3', type: 'effect' },
        to: { name: 'root', type: 'effect' },
        type: 'link',
      },
      h: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

it('spawns an effect that spawns grand children effects', () => {
  const grandchild: Effect<{}> = () => {
    return of();
  };
  const child: Effect<{}> = ({ spawnEffect }) => {
    spawnEffect(grandchild, { name: 'grandchild' });
    return of();
  };
  const root: Effect<{}> = ({ spawnEffect }) => {
    spawnEffect(child, { name: 'child' });
    return of();
  };
  setup(
    { value: {}, effect: root },
    ({ expectObservable, effect$, storeEvent$ }) => {
      expectObservable(effect$).toBe('|');
      expectObservable(storeEvent$).toBe('(abcdef)', {
        a: { type: 'effect', name: 'root', event: 'spawn' },
        b: { type: 'effect', name: 'child', event: 'spawn' },
        c: {
          type: 'link',
          to: { type: 'effect', name: 'root' },
          from: { type: 'effect', name: 'child' },
        },
        d: { type: 'effect', name: 'grandchild', event: 'spawn' },
        e: {
          type: 'link',
          to: { type: 'effect', name: 'child' },
          from: { type: 'effect', name: 'grandchild' },
        },
        f: { type: 'effect', name: 'root', event: 'teardown' },
      });
    }
  );
});

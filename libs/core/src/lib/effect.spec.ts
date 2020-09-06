import { of, timer, BehaviorSubject } from 'rxjs';
import { Effect, RootEffect } from './effect';
import { setup } from './test-helper';
import { ignoreElements, toArray } from 'rxjs/operators';
import { StoreValue } from './store-value';

it('does nothing and just completes immediately for a no-op effect', () => {
  const effect: RootEffect<{}> = () => of();
  setup({ value: {}, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('|');
    expectObservable(storeEvent$).toBe('(ab)', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

it('does nothing and completes after the effect when an effect uses no sink', () => {
  const effect: RootEffect<{}> = () => timer(10).pipe(ignoreElements());
  setup({ value: {}, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('----------|');
    expectObservable(storeEvent$).toBe('  a---------b', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

it('links the subject the effect and sinks the values onto it', () => {
  const value: StoreValue = { count$: new BehaviorSubject(0) };
  const effect: RootEffect<typeof value> = ({ sinks }) =>
    timer(10).pipe(sinks.count$(), ignoreElements());
  setup({ value, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('----------|');
    expectObservable(storeEvent$).toBe('(ab)------(cd)', {
      a: { event: 'spawn', name: 'root', type: 'effect' },
      b: {
        type: 'link',
        to: { type: 'subject', name: 'count$' },
        from: { type: 'effect', name: 'root' },
      },
      c: {
        type: 'value',
        to: { type: 'subject', name: 'count$' },
        from: { type: 'effect', name: 'root' },
        value: 0,
      },
      d: { event: 'teardown', name: 'root', type: 'effect' },
    });
  });
});

it('spawns an effect that spawns a child effect', () => {
  const effect: RootEffect<{}> = ({ spawnEffect }) => {
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
  const effect: RootEffect<{}> = ({ spawnEffect }) => {
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
  const grandchild: Effect<{}, never> = () => {
    return of();
  };
  const child: Effect<{}, never> = ({ spawnEffect }) => {
    spawnEffect(grandchild, { name: 'grandchild' });
    return of();
  };
  const root: RootEffect<{}> = ({ spawnEffect }) => {
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

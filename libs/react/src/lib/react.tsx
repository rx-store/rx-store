import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  Context,
} from 'react';
import { Observable, Observer } from 'rxjs';
import {
  StoreValue,
  StoreEventType,
  StoreEvent,
  RootEffect,
} from '@rx-store/core';
import { createManager } from './manager';

/**
 * A React hook that consumes from the passed Rx Store context,
 * asserts the store value is present, and returns it.
 */
export const useStore = <T extends StoreValue>(context: Context<T>): T => {
  const value = useContext(context);
  if (!value) throw new Error();
  return value;
};

export interface StoreReturn<T> {
  Manager: React.ComponentType<{}>;
  context: Context<T>;
}

export interface StoreFn {
  <T extends StoreValue>(arg: StoreArg<T>): StoreReturn<T>;

  /** @deprecated - created 1.0.0 release a bit prematurely, decided this should take a single object instead of positional args  */
  <T extends StoreValue>(
    value: StoreArg<T>['value'],
    effect: StoreArg<T>['effect']
  ): StoreReturn<T>;
}

export interface StoreArg<T extends StoreValue> {
  effect?: undefined | RootEffect<T>;
  value: T;
  observer?: Observer<StoreEvent>;
  onSelect?: (type: 'subject' | 'effect', name: string) => void;
}

/**
 * Creates a store, with the provided value & optional effect.
 * Returns a Manager component, that when mounted will subscribe
 * to your effect.
 *
 * Also returns a React context, to be re-exported
 * by the consuming code, for downstream components to import in
 * order for them to consume & publish to streams in the store value.
 */
export const store: StoreFn = <T extends StoreValue>(
  storeArgOrValue: StoreArg<T> | T,
  deprecatedEffect?: RootEffect<T>
) => {
  let value: T;
  let effect: RootEffect<T> | undefined;
  let observer: StoreArg<T>['observer'] | undefined;
  if (
    storeArgOrValue &&
    Object.values(storeArgOrValue).every(
      (value: unknown) =>
        // this is only here to supporte deprecated functionality
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        typeof value === 'object' && value['next'] !== undefined
    )
  ) {
    value = storeArgOrValue as T;
    effect = deprecatedEffect;
  } else {
    value = storeArgOrValue.value as T;
    effect = storeArgOrValue.effect as StoreArg<T>['effect'] | undefined;
    observer = storeArgOrValue.observer;
  }

  /** Each store gets a React context */
  const context = createContext<T>(value);

  if (observer) {
    Object.keys(value).forEach((name) => {
      if (observer) {
        observer.next({ type: StoreEventType.subject, name });
      }
    });
  }

  const Manager = createManager(
    {
      value,
      effect: effect as RootEffect<T>,
      observer,
    },
    context
  );

  return { Manager, context };
};

/**
 * A react hook for subscribing to an observable
 * it will subscribe to an observable given to it &
 * it will re-render your component anytime the observable
 * emits a value, produces an error, or completes.
 *
 * It will return a tuple of the latest value, the error
 * value, and the completion status (boolean):
 *
 * eg:
 *
 * subject.next(1)
 * subject.next(2)
 * subject.next(3)
 * subject.error('foo')
 *
 * In your component:
 *
 * const [count, error, complete] = useSubscription(obs$)
 * console.log({count, error, complete})
 *
 * Your component will render & log: 1, 2, 3, foo...
 */
export function useSubscription<T>(
  source: Observable<T>
): [T | undefined, any, boolean] {
  const [next, setNext] = useState<T | undefined>();
  const [error, setError] = useState<any>();
  const [complete, setComplete] = useState<boolean>(false);
  useEffect(() => {
    const subscription = source.subscribe(
      (value) => setNext(value),
      (error) => setError(error),
      () => setComplete(true)
    );
    return () => subscription.unsubscribe();
  }, [source]);
  return [next, error, complete];
}

export function withSubscription<T>(
  WrappedComponent: React.ComponentType<{
    next?: T;
    error: any;
    complete: boolean;
  }>,
  source: Observable<T>
) {
  const [next, error, complete] = useSubscription<T>(source);
  return (
    <WrappedComponent
      next={next}
      error={error}
      complete={complete}
    ></WrappedComponent>
  );
}

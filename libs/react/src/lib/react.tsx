import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  Context,
} from 'react';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import {
  spawnRootEffect,
  StoreValue,
  StoreEventType,
  StoreEvent,
  Effect,
} from '@rx-store/core';
import { map, take, filter, finalize } from 'rxjs/operators';

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
  effect?: undefined | Effect<T, unknown>;
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
  deprecatedEffect?: StoreArg<T>['effect']
) => {
  let value: T;
  let effect: StoreArg<T>['effect'] | undefined;
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

  /**
   * This Manager must be mounted at most once, wrap your children
   * where you want the store to be accessible within (eg. top of app).
   *
   * It subscribes your store's root effect, and provides a context
   * allowing children components to subscribe to the streams in the
   * context value.
   */
  let mounted = 0;
  const Manager: React.FC<{}> = ({ children }) => {
    // Enforce singleton component instance of the Manager
    // within the store closure, [<=1 manager per store may be mounted].
    useEffect(() => {
      mounted++;
      if (mounted > 1) {
        throw new Error('The Manager component must only be mounted once!');
      }
      return () => {
        mounted--;
      };
    }, []);

    // handle subscribing / unsubscribing to the store's effect, if any
    // also does some runtime validation checks
    useEffect(() => {
      if (!effect) {
        return;
      }
      const subscription = spawnRootEffect({
        value,
        effect,
        observer,
      }).subscribe();
      return () => subscription.unsubscribe();
    }, []);

    // Wraps the children in the context provider, supplying
    // the Rx store value.
    return <context.Provider value={value}>{children}</context.Provider>;
  };

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

/**
 * Given a behavior subject, and an optional project function
 * checks if the state defined by the projection fn exists
 * and suspends if not, by throwing a promise that resolves
 * only once it does exist.
 *
 * It returns the resource.
 *
 * This is meant to take a stream that emits a hash table
 * accumulating resources, eg. {1: {user: 'bob'}, 2: {user: 'sally'}}
 * and a projection function, eg hash => hash[1]
 *
 * If the resource in the hash table exists, it will be returned,
 * if not, the component will suspend.
 *
 * WARNING: Do not use this with mutable data, if the value at any
 * key is replaced you will get tearing in your app when the value is
 * sampled at different points in time by React.
 */
export function getResource<T, R>(
  subject: BehaviorSubject<T>,
  projectFn: (value: T) => R
) {
  // This is needed because the stream may use a non synchronous scheduler to deliver values
  // which would otherwise infinitely render, since we create a new promise each time
  // this hook renders, which will be 1 tick in the future, even if the value exists
  // therefore, we access it synchronously on this tick & return it if it exists
  const maybeValue: R | undefined = projectFn(subject.getValue());
  if (maybeValue) return { read: () => maybeValue };

  // Creates a promise that resolves when the user defined state exists on the BehaviorSubject
  const promise: Promise<R> = subject
    .pipe(
      map(projectFn),
      filter((value) => !!value),
      take(1)
    )
    .toPromise();

  // Yes, we copy pasted the thing React said not to copy paste...
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: R;

  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );

  return {
    read(): R {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      }
      // We did modify this from the React demo, to placate Typescript
      return result;
    },
  };
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

import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  Context,
} from 'react';
import { Observable } from 'rxjs';
import { spawnRootEffect, StoreValue, StoreArg } from '@rx-store/core';

/**
 * A React hook that consumes from the passed Rx Store context,
 * asserts the store value is present, and returns it.
 */
export const useStore = <T extends {}>(context: Context<T>): T => {
  const value = useContext(context);
  if (!value) throw new Error();
  return value;
};

export interface StoreReturn<T> {
  Manager: React.ComponentType<{}>;
  context: Context<T>;
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
export const store = <T extends StoreValue>({
  value,
  effect,
  observer,
}: StoreArg<T>): StoreReturn<T> => {
  /** Each store gets a React context */
  const context = createContext<T>(value);

  if (observer) {
    Object.keys(value).forEach((name) => {
      observer.next({ type: 'subject', name });
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
      // TODO - https://github.com/microsoft/TypeScript/issues/40034
      // if (!effect) {
      //   return null;
      // }
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

export function withSubscription<T>(
  WrappedComponent: React.ComponentType<{
    next: T;
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

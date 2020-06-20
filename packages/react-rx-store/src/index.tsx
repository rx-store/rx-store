import React, { createContext, useEffect, useState, useContext } from "react";
import { Observable } from "rxjs";
import { RxStoreEffect } from "@rx-store/rx-store";

export const context = createContext<any>(null);

export const createStore = <T extends {}>(
  value: T,
  rootEffect?: RxStoreEffect<T>
) => {
  const context = createContext<T>(value);

  /**
   * Mount this at the top of your app, or nest them to build a tree of stores.
   *
   * It subscribes your Rx Store's root effect, and provides a context
   * allowing children components to subscribe to the streams in the
   * context value.
   */
  const Manager: React.FC<{}> = ({ children }) => {
    if (!rootEffect) {
      if (typeof rootEffect !== "function") {
        throw new Error("rootEffect, if supplied, must be a function");
      }
      rootEffect = () => () => null;
    }
    useEffect(() => {
      const cleanupFn = rootEffect!(value);
      if (typeof cleanupFn !== "function") {
        throw new Error("rootEffect must return a cleanup function");
      }
      return cleanupFn;
    }, [value]);
    return <context.Provider value={value}>{children}</context.Provider>;
  };

  /**
   * Re-export this for children to consume the store value off the context
   */
  const useStore = (): T => {
    const value = useContext(context);
    if (!value) throw new Error();
    return value;
  };

  return { Manager, useStore };
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
    return subscription.unsubscribe;
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

import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  Context,
  useMemo,
} from "react";
import { Observable } from "rxjs";
import { RxStoreEffect } from "@rx-store/rx-store";

export const _context = createContext<any>({});

const useStore = <T extends {}>(context: Context<T> = _context): T => {
  const value = useContext(context);
  if (!value) throw new Error();
  return value;
};

export const createStore = <T extends {}, P>(
  value: T,
  rootEffect?: RxStoreEffect<T & { parent: P }>,
  context: Context<P> = _context
) => {
  /**
   * Mount this at the top of your app, or nest them to build a tree of stores.
   *
   * It subscribes your store's root effect, and provides a context
   * allowing children components to subscribe to the streams in the
   * context value.
   */
  const Manager: React.FC<{}> = ({ children }) => {
    const parent: P = useStore<P>(context);
    const extendedValue = useMemo(() => ({ ...value, parent }), [
      value,
      parent,
    ]);

    useEffect(() => {
      if (!rootEffect) {
        if (typeof rootEffect !== "function") {
          throw new Error("rootEffect, if supplied, must be a function");
        }
        rootEffect = () => () => null;
      }
      const cleanupFn = rootEffect(extendedValue);
      if (typeof cleanupFn !== "function") {
        throw new Error("rootEffect must return a cleanup function");
      }
      return cleanupFn;
    }, [extendedValue]);

    const extendedContext = (context as unknown) as Context<T>;
    return (
      <extendedContext.Provider value={extendedValue}>
        {children}
      </extendedContext.Provider>
    );
  };

  return { Manager };
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

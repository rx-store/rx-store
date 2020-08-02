import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  Context,
} from 'react';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RxStoreEffect, createSinks, createSources } from '@rx-store/rx-store';

/**
 * A React hook that consumes from the passed Rx Store context,
 * asserts the store value is present, and returns it.
 */
export const useStore = <T extends {}>(context: Context<T>): T => {
  const value = useContext(context);
  if (!value) throw new Error();
  return value;
};

/**
 * The spawnRootEffect runs the root effect which means the effectFn is called
 * with curried sources, sinks, and its own spawnEffect function used
 * to spawn child effects recursively.
 *
 * Running effects does not involve subscribing to the observables they return,
 * which is the responsibility of the <Manager /> component to subscribe/unsubscribe.
 * Running the effects only involves calling the effectFn, passing in curried sources, sinks
 * and spawnEffect function.
 *
 * @param debugKey
 * @param storeValue
 * @param rootEffectFn
 */
export const spawnRootEffect = <T extends {}>(
  debugKey: string,
  storeValue: T,
  rootEffectFn: RxStoreEffect<T>
) => {
  /**
   * spawnEffect closes over the `storeValue` and parent `debugKey`.
   * Runs the effectFn w / curried sources, sinks, and spawnEffect
   * function. Appends the given debugKey to the curried effect
   * from the parent effect.
   */
  const spawnEffect = (debugKey: string, effectFn: RxStoreEffect<T>) => {
    // TODO - add a devtools hook here
    console.log('spawnEffect:', debugKey);

    // Curries the sources and sinks with the debug key, to track this
    // effects "inputs" and "outputs" in the devtools.
    const sources = createSources(debugKey, storeValue);
    const sinks = createSinks(debugKey, storeValue);

    // Keeps the "context" intact, by appending to debugKey to create a path
    // each time an effect creates a child effect by running it's curried `spawnEffect()`
    const childspawnEffect = (childDebugKey, childEffectFn: RxStoreEffect<T>) =>
      spawnEffect(debugKey + '-' + childDebugKey, childEffectFn);

    // Run the effect function passing in the curried sources, sinks, and
    // spawnEffect function for the effectFn to run any of its children effectFn
    return effectFn(sources, sinks, childspawnEffect);
  };

  return spawnEffect(debugKey, rootEffectFn);
};

/**
 * Creates a store, with the provided value & optional effect.
 * Returns a Manager component, that when mounted will subscribe
 * to your effect.
 *
 * Also returns a React context, to be re-exported
 * by the consuming code, for downstream components to import in
 * order for them to consume & publish to streams in the store value.
 */
export const store = <T extends {}>(
  value: T,
  rootEffect?: RxStoreEffect<T>
): { Manager: React.ComponentType<{}>; context: Context<T> } => {
  /** Each store gets a React context */
  const context = createContext<T>(value);

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
      return () => mounted--;
    }, []);

    // handle subscribing / unsubscribing to the store's effect, if any
    // also does some runtime validation checks
    useEffect(() => {
      if (!rootEffect) {
        return null;
      }
      const subscription = spawnRootEffect(
        'root',
        value,
        rootEffect
      ).subscribe();
      return () => subscription.unsubscribe();
    }, [value]);

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

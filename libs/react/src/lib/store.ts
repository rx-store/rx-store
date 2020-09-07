import React, { createContext, Context } from 'react';
import { Observer } from 'rxjs';
import {
  StoreValue,
  StoreEventType,
  StoreEvent,
  RootEffect,
} from '@rx-store/core';
import { createManager } from './manager';

/**
 * This is the single argument passed to the {@link store} function to create a new store.
 *
 * @typeparam Value the type declaration of your {@link StoreValue}, so that when Rx Store calls your
 * effects with curried helper functions, sources, and sinks, your effects will receive the proper typings.
 * Also ensures the returned context and {@link Manager} component have proper typings.
 */
export interface StoreArg<Value extends StoreValue> {
  /**
   * effect {@link RootEffect} A function that when called, returns an observable that
   * when subscribed to, runs side effects encapsulated by that stream for the remainder
   * of duration the store exists (which is until the {@link Manager} component unmounts)
   */
  effect?: undefined | RootEffect<Value>;

  /**
   * value The {@link StoreValue} is a plain javascript object (containing
   * [RxJS subjects](https://rxjs-dev.firebaseapp.com/guide/subject)).
   */
  value: Value;
  observer?: Observer<StoreEvent>;
}

export interface StoreReturn<Value extends StoreValue> {
  Manager: React.ComponentType<{}>;
  context: Context<Value>;
}

/**
 * Creates a store, with the provided value & optional effect.
 * Returns a Manager component, that when mounted will subscribe
 * to your effect.
 *
 * Also returns a React context, to be re-exported
 * by the consuming code, for downstream components to import in
 * order for them to consume & publish to streams in the store value.
 *
 * You create your store value, which is a plain old javascript object (containing [RxJS subjects](https://rxjs-dev.firebaseapp.com/guide/subject), then use `createStore()` passing in the store value, and the optional root effect.
 *
 * You get back a {@link Manager} component, for providing the store and it's context, and you also get back the React context itself, for consuming from and emitting to the store directly from outside of Rx Store (such as in your components).
 *
 * ```typescript
 * import { Provider } from '@rx-store/react';
 *
 * const storeValue = { count$: new Subject() };
 * const { Manager, context } = store({ value, effect: appRootEffect });
 * export const rootContext = context;
 * ```
 *
 * @typeparam Value the type declaration of your {@link StoreValue}, so that when Rx Store calls your effects with curried helper functions, sources, and sinks, your effects will receive the proper typings. Also ensures the returned context and {@link Manager} component have proper typings.
 * @param arg an object containing your {@link RootEffect}, {@link StoreValue}, and optional {@link StoreEvent} observer
 */
export function store<Value extends StoreValue>(
  arg: StoreArg<Value>
): StoreReturn<Value>;

/**
 * @deprecated - created 1.0.0 release a bit prematurely, decided this should
 * take a single object instead of positional args
 */
export function store<Value extends StoreValue>(
  value: Value,
  effect: RootEffect<Value>
): StoreReturn<Value>;

export function store<Value extends StoreValue>(
  storeArgOrValue: any,
  deprecatedEffect?: any
): any {
  let value: Value;
  let effect: RootEffect<Value> | undefined;
  let observer: Observer<StoreEvent> | undefined;
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
    value = storeArgOrValue as Value;
    effect = deprecatedEffect;
  } else {
    value = storeArgOrValue.value as Value;
    effect = storeArgOrValue.effect as StoreArg<Value>['effect'] | undefined;
    observer = storeArgOrValue.observer;
  }

  /** Each store gets a React context */
  const context = createContext<Value>(value);

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
      effect: effect as RootEffect<Value>,
      observer,
    },
    context
  );

  return { Manager, context };
}

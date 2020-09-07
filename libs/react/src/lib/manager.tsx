import React, { useEffect } from 'react';
import {
  spawnRootEffect,
  SpawnRootEffectArgs,
  StoreValue,
} from '@rx-store/core';

/**
 * Each store has a `<Manager />`. The store's manager is responsible for:
 *
 * - Providing the [store value](#store-value) to the component(s) below it.
 * - For subscribing to (and unsubscribing from) the store's [root effect](#effects).
 *
 * You may choose to:
 *
 * - Wrap your entire application in a single global store, and use [RxJS operators to
 * manage the lifecycle of your effects](../guides/control-when-effects-run.md).
 *
 * - Have multiple stores scoped to specific subtrees or areas of your application,
 * tying the lifecycle of the effects to the lifecycle of your component tree(s).
 *
 * The `<Manager />` is returned from [the store() factory](./store). Wrap your
 * app at the top level, or wrap the part of your app where you want the store to run
 * and be available.
 *
 * If the `Manager` unmounts, the store's effect's will all be unsubscribed (torn down).
 * To start out, it's recommended to use the `Manager`, at the top level of your app
 * and re-export the context as `rootContext`.
 *
 * This Manager must be mounted at most once per store instance. If your app tries to mount
 * a second `<Manager />` for the same store instance, an error will be thrown. You can create stores
 * dynamically as shown below in Example 2.
 *
 * When the Manager mounts, it subscribes to it's store's root effect, and provides a context
 * allowing children components to subscribe to the streams in the
 * context value, and emit onto the subjects. It also does some runtime
 * validation checks that the effect you passed in returns a proper cleanup function.
 *
 * ### Example 1 - A single Store
 *
 * ```jsx
 * import { Provider } from '@rx-store/react';
 * const storeValue = { $foo: new Subject() };
 * const { Manager, context } = store({ value: storeValue });
 * export const rootContext = context;
 *
 * <Manager>
 *   <ComponentThatUsesRxStore />
 * </Manager>;
 * ```
 *
 * ### Example 2 - Dynamic / Multiple Child Stores
 *
 * ```jsx
 * const childEffect = (i) => ({sources, sinks}) =>
 *   merge(
 *     sources.child$().pipe(
 *       tap(value) =>
 *         console.log(`child ${i} received child value ${value}`)
 *     ),
 *     sources.parent$().pipe(
 *       tap(value) =>
 *         console.log(`child ${i} received parent value ${value}`)
 *     )
 *   )
 *
 * const childValue = (parentStore, i) => ({
 *   parent$: parentStore.count$,
 *   foo$: interval(1000 * (i + 1)),
 * });
 *
 * const Child = ({ i }) => {
 *   // use the parent store
 *   const rootStore = useStore(parentContext);
 *
 *   // create a child store, which knows its index & has a
 *   // access to a subject provided by the parent store
 *   const { Manager } = useMemo(
 *     () => store(childValue(rootStore, i), childEffect(i)),
 *     [i, rootStore]
 *   );
 *
 *   // Each child must mount its [dynamically created]
 *   // Manager exactly once!
 *   return (
 *     <Manager>
 *       child {i}
 *       <hr />
 *     </Manager>
 *   );
 * };
 * ```
 *
 */
export type Manager = React.FC<{}>;

/**
 * @internal
 */
export const createManager = <Subjects extends StoreValue>(
  spawnRootEffectArgs: SpawnRootEffectArgs<Subjects>,
  context: React.Context<Subjects>
) => {
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
      if (!spawnRootEffectArgs.effect) {
        return;
      }
      const subscription = spawnRootEffect(spawnRootEffectArgs).subscribe();
      return () => subscription.unsubscribe();
    }, []);

    // Wraps the children in the context provider, supplying
    // the Rx store value.
    return (
      <context.Provider value={spawnRootEffectArgs.value}>
        {children}
      </context.Provider>
    );
  };
  return Manager;
};

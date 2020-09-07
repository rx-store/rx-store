import React, { useEffect } from 'react';
import {
  spawnRootEffect,
  SpawnRootEffectArgs,
  StoreValue,
} from '@rx-store/core';

/**
 * This Manager must be mounted at most once, wrap your children
 * where you want the store to be accessible within (eg. top of app).
 *
 * It subscribes your store's root effect, and provides a context
 * allowing children components to subscribe to the streams in the
 * context value.
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

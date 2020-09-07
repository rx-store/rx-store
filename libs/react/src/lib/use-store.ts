import { useContext, Context } from 'react';
import { StoreValue } from '@rx-store/core';

/**
 * A React hook that consumes from the passed Rx Store context,
 * asserts the store value is present, and returns it.
 *
 * @param context The context returned from the [store] function, corresponding
 * to the store instance you want to use.
 *
 * ## Example
 *
 * ```jsx
 * import { rootContext } from './index';
 * import { useSubscription, useStore } from '@rx-store/react';
 *
 * function Component() {
 *   const store = useStore(rootContext);
 *
 *   // do something w/ the store, such as creating a subscription!
 *
 *   return null;
 * }
 * ```
 *
 */
export const useStore = <Value extends StoreValue>(
  context: Context<Value>
): Value => {
  const value = useContext(context);
  if (!value) throw new Error();
  return value;
};

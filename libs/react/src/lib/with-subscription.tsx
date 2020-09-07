import React from 'react';
import { Observable } from 'rxjs';
import { useSubscription } from './use-subscription';

/**
 * A HOC for consuming from a stream.
 *
 * ```
 * const WrappedComponent = withSubscription(MyComponent, store.count$)
 * ```
 *
 * Your component will be rendered with `next`, `error` & `complete` props:
 *
 * ```jsx
 * <WrappedComponent
 *   next={next}
 *   error={error}
 *   complete={complete}
 * ></WrappedComponent>
 * ```
 */
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

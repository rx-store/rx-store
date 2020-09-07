import React from 'react';
import { Observable } from 'rxjs';

export { useStore } from './use-store';
export { useSubscription } from './use-subscription';
export { store, StoreArg, StoreReturn } from './store';

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

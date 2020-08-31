import React, { Suspense } from 'react';
import { useStore, useSubscription } from '@rx-store/react';
import { rootContext } from '../main';
import { take, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export const App = () => {
  const store = useStore(rootContext);
  const [searchInput] = useSubscription(store.searchInput$);
  return (
    <>
      <input
        type="text"
        value={searchInput || ''}
        onChange={(event) => {
          store.searchInput$.next(event.target.value);
        }}
      />
      <br />
      <Suspense fallback={<>suspended. wait.</>}>
        <ResultImage />
      </Suspense>
    </>
  );
};

const ResultImage = () => {
  const { resultImage$ } = useStore(rootContext);
  const resultImage = useResource(resultImage$, (v) => v);
  return resultImage ? <img src={resultImage.url} alt="" /> : null;
};

/**
 * Given a behavior subject, and an optional project function
 * checks if the state defined by the projection fn exists
 * and suspends if not, by throwing a promise that resolves
 * only once it does exist.
 *
 * It returns the resource.
 *
 * This is meant to take a stream that emits a hash table
 * accumulating resources, eg. {1: {user: 'bob'}, 2: {user: 'sally'}}
 * and a projection function, eg hash => hash[1]
 *
 * If the resource in the hash table exists, it will be returned,
 * if not, the component will suspend.
 *
 * WARNING: Do not use this with mutable data, if the value at any
 * key is replaced you will get tearing in your app when the value is
 * sampled at different points in time by React.
 */
function useResource<T, R>(
  subject: BehaviorSubject<T>,
  projectFn: (value: T) => R
) {
  if (!projectFn(subject.getValue())) {
    throw subject.pipe(map(projectFn), take(1)).toPromise();
  }
  return projectFn(subject.getValue());
}

export default App;

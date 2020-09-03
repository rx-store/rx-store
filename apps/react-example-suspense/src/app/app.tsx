import React, { Suspense } from 'react';
import { useStore, useSubscription, useResource } from '@rx-store/react';
import { rootContext } from '../main';

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
  // This is just standard Rx Store stuff, access some streams from the store...
  const { resultImage$, searchInput$ } = useStore(rootContext);

  // This is not a promise, although it does represent a future value we can act like we have now
  const resource = useResource(
    resultImage$,
    (hashMap) => hashMap[searchInput$.getValue()]
  );

  // Because of how suspense works, we are able to render this "even if its not there", this may throw a promise!
  const resultImage = resource.read();

  // React will wait for that promise to resolve, then retry rendering, so we can just "pretend" we always read the value!
  return resultImage ? <img src={resultImage.url} alt="" /> : null;
};

export default App;

import React, { Suspense } from 'react';
import { useStore, useSubscription } from '@rx-store/react';
import { rootContext } from '../main';
import { take } from 'rxjs/operators';

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
  const store = useStore(rootContext);
  if (!store.resultImage$.getValue()) {
    throw store.resultImage$.pipe(take(1)).toPromise();
  }
  const [resultImage] = useSubscription(store.resultImage$);
  return resultImage ? <img src={resultImage.url} alt="" /> : null;
};

export default App;

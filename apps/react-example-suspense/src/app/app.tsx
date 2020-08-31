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
  const { resultImage$ } = useStore(rootContext);
  const resultImage = useResource(resultImage$, (v) => v);
  return resultImage ? <img src={resultImage.url} alt="" /> : null;
};

export default App;

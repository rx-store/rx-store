import React, { Suspense } from 'react';
import { useStore, useSubscription } from '@rx-store/react';
import { rootContext, ResultImage } from '../main';

export const App = () => {
  const store = useStore(rootContext);
  const [searchInput] = useSubscription(store.searchInput$);
  const [resultImage] = useSubscription(store.resultImage$);
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
        <Result resultImage={resultImage} />
      </Suspense>
    </>
  );
};

const Result = ({ resultImage }: { resultImage?: ResultImage }) => {
  if (!resultImage)
    throw new Promise(() => {
      //
    });
  return resultImage ? <img src={resultImage.url} alt="" /> : null;
};

export default App;

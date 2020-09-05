// import { Devtools } from '@rx-store/devtools';
import React from 'react';
import ReactDOM from 'react-dom';
import { StoreValue, StoreEvent, RootEffect, Effect } from '@rx-store/core';
import { store } from '@rx-store/react';
import { BehaviorSubject, Subject, ReplaySubject, from } from 'rxjs';
import App from './app/app';
import { switchMap, debounceTime, delay, ignoreElements } from 'rxjs/operators';

import { GiphyFetch } from '@giphy/js-fetch-api';

export const devTools$ = new ReplaySubject<StoreEvent>(5000);

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch('');

export interface ResultImage {
  url: string;
}

const fetchGif = async (
  searchInput: string
): Promise<ResultImage | undefined> => {
  const result = await gf.search(searchInput, { limit: 1 });
  const images = result.data.map((data) =>
    Object.entries(data.images).find(([key]) => key === 'preview_gif')
  );
  if (images.length === 0) {
    return undefined;
  } else {
    if (images[0]?.length) return images[0][1];
    return undefined;
  }
};

interface AppStoreValue extends StoreValue {
  searchInput$: Subject<string>;
  resultImage$: Subject<undefined | ResultImage>;
}

const storeValue: AppStoreValue = {
  searchInput$: new BehaviorSubject(''),
  resultImage$: new BehaviorSubject<undefined | ResultImage>(undefined),
};

const createFetchEffect: (
  seachInput: string
) => Effect<AppStoreValue, ResultImage | undefined> = (searchInput) => () => {
  return from(fetchGif(searchInput)).pipe(delay(1000 + Math.random() * 5000));
};

const effect: RootEffect<AppStoreValue> = ({ sources, sinks, spawnEffect }) =>
  sources.searchInput$().pipe(
    debounceTime(1200),
    switchMap((searchInput) =>
      spawnEffect<ResultImage | undefined>(createFetchEffect(searchInput), {
        name: 'fetch-effect',
      })
    ),
    sinks.resultImage$(),
    ignoreElements()
  );

const { Manager, context } = store({
  value: storeValue,
  effect,
  observer: devTools$,
});
export const rootContext = context;

ReactDOM.render(
  <React.StrictMode>
    <Manager>
      <App />
    </Manager>
  </React.StrictMode>,
  document.getElementById('root')
);
// ReactDOM.unstable_createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Manager>
//       <App />
//     </Manager>
//   </React.StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
    {/* <Devtools observable={devTools$} /> */}
  </React.StrictMode>,
  document.getElementById('devtools')
);

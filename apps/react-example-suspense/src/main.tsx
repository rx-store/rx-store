// import { Devtools } from '@rx-store/devtools';
import React from 'react';
import ReactDOM from 'react-dom';
import { StoreValue, Effect, StoreEvent } from '@rx-store/core';
import { store } from '@rx-store/react';
import {
  combineLatest,
  BehaviorSubject,
  ReplaySubject,
  from,
  of,
  Observable,
} from 'rxjs';
import App from './app/app';
import {
  switchMap,
  debounceTime,
  delay,
  scan,
  ignoreElements,
  catchError,
} from 'rxjs/operators';

import { GiphyFetch } from '@giphy/js-fetch-api';

export const devTools$ = new ReplaySubject<StoreEvent>(5000);

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch('');

const fetchGif = async (searchInput: string) => {
  const result = await gf.search(searchInput, { limit: 1 });
  const images = result.data.map((data) =>
    Object.entries(data.images).find(([key]) => key === 'preview_gif')
  );
  if (images.length === 0) {
    throw new Error('no results');
  } else {
    if (images[0]?.length) return images[0][1];
    throw new Error('no results');
  }
};

export interface ResultImage {
  url: string;
}

// Search input will be a string, of course
type SearchInput = string;

interface AppStoreValue extends StoreValue {
  // Store the users latest/current `SearchInput`
  searchInput$: BehaviorSubject<SearchInput>;
  // Accumulate a hash map of `SearchInput` to `ResultImage` as a cache
  resultImage$: BehaviorSubject<Record<SearchInput, ResultImage>>;
}

// Create the empty BehaviorSubjects to represent stream(s) of our latest state(s)
const storeValue: AppStoreValue = {
  searchInput$: new BehaviorSubject(''),
  resultImage$: new BehaviorSubject<Record<string, ResultImage>>({}),
};

// A function that given some search input, returns an Rx Store effect
const createFetchEffect = (
  searchInput: string
): Effect<AppStoreValue, ResultImage> => (): Observable<ResultImage> => {
  // Creates a promise (starting the fetch), then creates a (hot) stream wrapping it
  return from(fetchGif(searchInput)).pipe(
    // Add a random amount of delay after the promise resolves, before we emit the value
    delay(1000 + Math.random() * 500),
    // If there are errors, log them to console, and don't emit anything on the stream
    catchError((error) => {
      console.error(error);
      return of<ResultImage>();
    })
  );
};

// The demo app's "root" Rx Store effect
const effect: Effect<AppStoreValue, never> = ({
  sources,
  sinks,
  spawnEffect,
}) =>
  // Given the stream of search inputs
  sources.searchInput$().pipe(
    // debounce them for 200ms
    debounceTime(200),
    // then cancel any in-flight requests, and start a new request on an inner
    // stream that emits the response & the original search term as a tuple
    switchMap((searchInput) => {
      return combineLatest(
        of(searchInput),
        spawnEffect<ResultImage>(createFetchEffect(searchInput), {
          name: 'fetch-effect',
        })
      );
    }),
    // Accumulate a hash map of `searchInput` to `ResultImage` in a hash map
    // to build up a cache within the context of this stream, emitting the
    // latest cache state each time it is modified
    scan(
      (hashMap, [searchInput, resultImage]) => ({
        ...hashMap,
        [searchInput]: resultImage,
      }),
      {}
    ),
    // Emit the latest cache object onto the `resultImage$` subject in the store
    sinks.resultImage$(),
    // This is a root effect, it doesn't need to project any values upwards as theres no parent effect
    ignoreElements()
  );

const { Manager, context } = store({
  value: storeValue,
  effect,
  observer: devTools$,
});
export const rootContext = context;

// Uncomment for running React in legacy mode

// ReactDOM.render(
//   <React.StrictMode>
//     <Manager>
//       <App />
//     </Manager>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// Uncomment for running React in concurrent mode

ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Manager>
      <App />
    </Manager>
  </React.StrictMode>
);

// Uncomment to render Rx Store devtools!

// ReactDOM.render(
//   <React.StrictMode>
//     <Devtools observable={devTools$} />
//   </React.StrictMode>,
//   document.getElementById('devtools')
// );

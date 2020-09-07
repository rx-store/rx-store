---
id: autocomplete
title: Autocomplete App
---

## Create a React app

We'll assume you already have a React app setup, if not [create one now](https://reactjs.org/docs/create-a-new-react-app.html), [and install `Rx Store`](../installation.md). We'll use [create react app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app). You'll also need to install the Giphy JS SDK and [create an API key](https://developers.giphy.com/) to follow this tutorial.

```
npx create-react-app rx-store-autocomplete-test --template typescript
yarn add @rx-store/react @rx-store/core rxjs @giphy/js-fetch-api
```

## Store Value (subjects)

The store value is where we'll store our sources of truth. We'll use two [subjects](https://rxjs.dev/guide/subject), one called `searchInput$` which emits a string with the latest values of the text input, and one called `resultImage$` that emits an object of the shape `{url: string}` each time we get back a result from the API.

We'll declare the typings here, but if you're not using typescript you can skip this step.

```ts
interface AppStoreValue extends StoreValue {
  searchInput$: Subject<string>;
  resultImage$: Subject<undefined | ResultImage>;
}
```

Next, we'll implement this interface, or create the store value. For both subjects we will [BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject) so they act stateful.

```ts
const storeValue: AppStoreValue = {
  searchInput$: new BehaviorSubject(''),
  resultImage$: new BehaviorSubject<undefined | ResultImage>(undefined),
};
```

## API Helper

We'll create a helper function that takes in a search term, and returns a promise that eventually resolves to an object of shape `{url: string}`.

```ts
const fetchGif = async (searchInput: string) => {
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
```

## Effect

We'll write an effect that takes the `searchInput$` events, and [debounces](https://rxjs.dev/api/operators/debounceTime) them for 1.2 seconds, then converts them to network request and cancels any previous in flight request with [switchMap](https://rxjs.dev/api/operators/switchMap).

```ts
const effect: Effect<AppStoreValue> = ({ sources, sinks, spawnEffect }) =>
  sources.searchInput$().pipe(
    debounceTime(1200),
    switchMap((searchInput) =>
      return fetchGif(searchInput)
    ),
    sinks.resultImage$()
  );
```

## Spawn Effects

If we want, instead of having one effect like in the previous examlpe, we wrap part of the root effect's observable sequence in `spawnEffect`, which allows Rx Store to track the lifecycle of the subscriptions to the inner effect, for use cases such as devtools and more granular logging.

Here we have also added random amounts of delay within the inner effect and we have given it a name of `fetch-effect` which is how Rx Store will internally identify the effect. It is a good idea to break the effects up to modularize your logic.

```ts
const createFetchEffect = (searchInput: string) => () => {
  return from(fetchGif(searchInput)).pipe(delay(1000 + Math.random() * 5000));
};

const effect: Effect<AppStoreValue> = ({ sources, sinks, spawnEffect }) =>
  sources.searchInput$().pipe(
    debounceTime(1200),
    switchMap((searchInput) =>
      spawnEffect(createFetchEffect(searchInput), { name: 'fetch-effect' })
    ),
    sinks.resultImage$()
  );
```

## Create Store

We'll simply pass in the `storeValue` (subjects) and the `effect` to the `store()` method:

```tsx
const { Manager, context } = store({ value: storeValue, effect });
```

## Wrap App in the &lt;Manager&gt;

Next, we'll take the `Manager` component returned by the `store()` method & wrap our app with it:

```tsx
<Manager>
  <>your app goes here</>
</Manager>
```

## Text Input & Suspense Results

We'll now implement the text input, which nexts values onto the `searchInput$` subject, which is received by our root effect. After some time, these are mapped to inner effects that eventually emit the results of the network request. Until the first value(s) arrive, React will suspend using the `<Suspense />` boundary. More robust React suspense patterns are under development.

```tsx
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
```

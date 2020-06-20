---
id: react
title: Usage with React
---

## Manager

You create your store value, which is a plain old javascript object, then use `createStore()` passing in the store value, and the optional root effect.

You get back a `Manager` and a hook. Wrap your app at the top level using the `Manager` as shown here, and ex-export the hook:

```tsx
import { Provider } from "@rx-store/react-rx-store";

const storeValue = {};

const { Manager, useStore } = createStore(value, appRootEffect);

export const useRootStore = useStore;

<Manager>
  <App />
</Manager>;
```

## Subscribing

### useSubscription hook

In your components, you can access the store, and subscribe to any observable or subject in your store, using the provided hooks:

```tsx
import { useSubscription } from "@rx-store/react-rx-store";

function Component() {
  const store = useRootStore();

  // consume just the value(s)
  const [count] = useSubscription(store.count$);

  // or also render error / completion information
  const [next, error, complete] = useSubscription(store.websocketMessage$);

  return (
    <>
      Counter: {count}
      Websockets value: {next}
      Websockets error: {error}
      Websockets complete: {complete}
    </>
  );
}
```

Your component will re-render whenever each stream emits, errors, or completes.

You can also modify observables inline with `.pipe()`:

```tsx
import { useRxStore, useSubscription } from "@rx-store/react-rx-store";

function Component() {
  const store = useRootStore();

  // create an observable inline, just memoize it otherwise
  // useSubscription() hook will re-subscribe on every render!
  const allClick$ = useMemo(() => merge(store.myClick$, store.yourClick$), [
    store.myClick$,
    store.yourClick$,
  ]);

  // consume the inline observable
  const [click] = useSubscription(allClick$);
  console.log(click);

  return null;
}
```

### withSubscription HOC

```
const WrappedComponent = withSubscription(MyComponent, store.count$)
```

Your component will be rendered with `next`, `error` & `complete` props:

```jsx
<WrappedComponent
  next={next}
  error={error}
  complete={complete}
></WrappedComponent>
```

## React Example app

Check out the full [example counter app](https://github.com/rx-store/rx-store/tree/master/packages/react-rx-store-example-counter)

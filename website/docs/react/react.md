---
id: react
title: Usage with React
---

## store() factory

```tsx
import { store } from "@rx-store/react-rx-store";

const storeValue = {};
const { Manager, context } = store(storeValue);
```

You may have one, or multiple stores. You can nest stores. Child stores can share references to parent store's streams, [as shown in the Manager docs](../api-reference/manager#example-2---dynamic--multiple-child-stores).

## Nesting Stores

Creating a child store essentially seals off the entire sub-tree mounted within the store's `<Manager />` component. Other components within the app that are mounted outside of or above where the `<Manager />` component are mounted in the tree cannot access the internal RxJS subjects for the child store, nor can they emit values onto them.

Communication upward works much like a callback prop in React. You must explicitly pass subject(s) and observable(s) down from parent store(s) to child store(s), if you want to allow the child store to communicate up to, or consume streams provided by the parent store(s), respectfully.

We recommend starting out with one root store, and nesting stores only tactfully after considering the tradeoffs, so as to avoid the pitfalls of unintenionally building a "spider web" of streams with uneccessary complexity. [Read more about nesting stores, to "seal off" a sub-tree](../api-reference/manager#example-2---dynamic--multiple-child-stores).

## &lt;Manager /&gt; Component

You create a store using the `store()` factory function, passing in the store value, which is plain javascript object containing RxJs Subjects & Observables. The `store()` factory also accepts an optional [root effect](../../basics/effects) as the second argument.

You get back a `Manager` component, and a React context. Wrap your app at the top level, or wrap the part of your app where you want the store to run & be available. If the `Manager` unmounts, the store's effect's will all be unsubscribed (torn down). To start out, it's recommended to use the `Manager` as shown here, at the top level of your app and re-export the context:

```tsx
export const rootContext = context;

export default = (
  <Manager>
    <App />
  </Manager>;
)
```

Read more about the [&lt;Manager /&gt; component](../api-reference/manager) in the API reference.

## Subscribing

### useSubscription hook

In your components, you can access the store, and subscribe to any observable or subject in your store, using the provided hooks:

```tsx
import { useSubscription, useStore } from "@rx-store/react-rx-store";

function Component() {
  const store = useStore(rootContext);

  // render error / completion information
  const [next, error, complete] = useSubscription(store.websocketMessage$);

  return (
    <>
      Websockets value: {next}
      Websockets error: {error}
      Websockets complete: {complete}
    </>
  );
}
```

Read more about the [useSubscription hook](../api-reference/use-subscription) in the API reference.

### withSubscription HOC

There is also a [HOC provided](../api-reference/with-subscription) if you want to use class based components or do not want to use hooks.

## React Example app

Check out the full [example counter app](https://github.com/rx-store/rx-store/tree/master/packages/react-rx-store-example-counter)

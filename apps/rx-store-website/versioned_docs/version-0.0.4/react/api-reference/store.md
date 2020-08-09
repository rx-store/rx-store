---
id: store
title: store()
---

**Args**:

- `value`: {}
  - The store value is a plain javascript object (containing [RxJs subjects](../../basics/subjects) & [observables](../../basics/observables)).
- `effect`: `() => () => void`
  - A function that when called, subscribes to the streams in your store value, runs side effects for the duration it is subscribed. The [effect function](../../basics/effects) should return another function that calls unsubscribe on it's RxJs subscription(s) to tear down any effects once the [Manager unmounts](./manager).

You create your store value, which is a plain old javascript object (containing [RxJs subjects](../../basics/subjects) & [observables](../../basics/observables)), then use `createStore()` passing in the store value, and the optional root effect.

You get back a [&lt;Manager /&gt;](./manager) component, for providing the store and it's context, and you also get back the React context itself, for conuming from and emitting to the store.

```tsx
import { Provider } from "@rx-store/react-rx-store";

const storeValue = { count$: new Subject() };
const { Manager, context } = store(value, appRootEffect);
export const rootContext = context;
```

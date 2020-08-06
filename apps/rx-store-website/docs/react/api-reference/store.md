---
id: store
title: store()
---

**Args**:

- `value`: {}
  - The store value is a plain javascript object (containing [RxJs subjects](../../basics/subjects) & [observables](../../basics/observables)).
- `effect`: `({sources, sinks, spawnEffect}) => Observable`
  - A function that when called, returns an observable that when subscribed to, runs side effects encapsulated by that stream for the remainder of duration the store exists (until the [Manager unmounts](./manager))

You create your store value, which is a plain old javascript object (containing [RxJs subjects](../../basics/subjects), then use `createStore()` passing in the store value, and the optional root effect.

You get back a [&lt;Manager /&gt;](./manager) component, for providing the store and it's context, and you also get back the React context itself, for consuming from and emitting to the store directly from outside of Rx Store (such as in your components).

```tsx
import { Provider } from "@rx-store/react-rx-store";

const storeValue = { count$: new Subject() };
const { Manager, context } = store(value, appRootEffect);
export const rootContext = context;
```

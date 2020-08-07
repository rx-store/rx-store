---
id: manager
title: <Manager />
---

Wraps the children in the context provider, supplying
the Rx store value, manages the root effect.

---

The `<Manager />` is returned from [the store() factory](./store). Wrap your app at the top level, or wrap the part of your app where you want the store to run & be available.

If the `Manager` unmounts, the store's effect's will all be unsubscribed (torn down). To start out, it's recommended to use the `Manager`, at the top level of your app and re-export the context as `rootContext`.

This Manager must be mounted at most once per store instance. If your app tries to mount a second `<Manager />` for the same store instance, an error will be thrown. You can create stores dynamically as shown below in Example 2.

When the Manager mounts, it subscribes to it's store's root effect, and provides a context
allowing children components to subscribe to the streams in the
context value, and emit onto the subjects. It also does some runtime validation checks that the effect you passed in returns a proper cleanup function.

**Props**:

None.

### Example 1 - A single Store

```jsx
import { Provider } from '@rx-store/react-rx-store';
const storeValue = { $foo: new Subject() };
const { Manager, context } = store(storeValue);
export const rootContext = context;

<Manager>
  <ComponentThatUsesRxStore />
</Manager>;
```

### Example 2 - Dynamic / Multiple Child Stores

```jsx
const childEffect = (i) => ({sources, sinks}) =>
  merge(
    sources.child$().pipe(
      tap(value) =>
        console.log(`child ${i} received child value ${value}`)
    ),
    sources.parent$().pipe(
      tap(value) =>
        console.log(`child ${i} received parent value ${value}`)
    )
  )

const childValue = (parentStore, i) => ({
  parent$: parentStore.count$,
  foo$: interval(1000 * (i + 1)),
});

const Child = ({ i }) => {
  // use the parent store
  const rootStore = useStore(parentContext);

  // create a child store, which knows its index & has a
  // access to a subject provided by the parent store
  const { Manager } = useMemo(
    () => store(childValue(rootStore, i), childEffect(i)),
    [i, rootStore]
  );

  // Each child must mount its [dynamically created]
  // Manager exactly once!
  return (
    <Manager>
      child {i}
      <hr />
    </Manager>
  );
};
```

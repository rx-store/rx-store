## Components

You can subscribe to the subjects in your [store value](#store-value) directly from your components. This allows you to render your component(s) in reaction to a subject emitting a value, synchronizing your component's state with your subject(s).

React Example:

```js
function ViewerCount() {
  const store = useStore(rootContext);
  const [next, error] = useSubscription(store.viewerCount$);
  return (
    <>
      Latest viewer count: {next}
      Stream had an error?: {error}
    </>
  );
}
```

Read more about the [useSubscription hook](./react/api-reference/use-subscription.md) in the API reference.

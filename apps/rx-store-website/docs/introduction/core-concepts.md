---
id: getting-started
title: Getting Started with Rx Store
---

`Rx Store` is a reactive store for frontend UI libraries (such as React), making it easy for you to build your application's logic using [RxJs](https://rxjs.dev/) streams. If you are not yet familiar with RxJs, [this video](https://www.youtube.com/watch?v=ewcoEYS85Co) is a great introduction!

Unlike a state management library, `Rx Store` is a stream management library. It is better suited to managing data that changes frequently or in complex ways over time, such as in real-time applications.

## Concepts

Let's walk through the `Rx Store` concepts using some examples:

### Store

In `Rx Store` you can have one or many stores. Each store contains a `value` object, where you define various [subjects](./rxjs-concepts.md):

```
{
  // This stream will emit the latest chat messages!
  chatMessage$: new Subject(),

  // This stream will emit the latest viewer count!
  viewerCount$: new Subject(),
}
```

### Manager

Each store has a `Manager` component. The `Manager` component is responsible for providing the store's `value` object to its descendant components.

You may choose to wrap your entire app in a single global store, or you may choose to have multiple stores scoped to specific sub-trees of your app, for example to give each team or feature its own store.

When the `Manager` component is mounted, it runs or *subscribe*s to the `effects` attached to it's store. When it is unmounted, it stops or *unsubscribe*s from the `effects`.

### Effects

Effects are functions that return observables, which RxStore subscribes to. Effects react to events emitted by their `sources`, they can react by running any side effects, such as an http request. Effects can trigger events of their own by emitting on the `sinks`. To emit onto the `sinks`, just include the operator, such as `sinks.chatMessage$()` anywhere in your pipeline.

Here is an example of an effect that echos the messages emitted on the `chatMessage$` source back onto the `chatMessage$` sink with 1 second delay:

```tsx
export const effect = ({sources, sinks}) =>
  sources.chatMessage$()
    .pipe(
      filter(message => message === 'ping')
      mapTo('pong')
      delay(1000),
      sinks.chatMessage$()
    )
```

The store's subjects are accessed via sources and sinks, which are read only and write only interfaces for the subjects. This allows Rx Store to track your data flow.

### Components

You can subscribe directly from your components. This allows you to re-render a component whenever a subject emits a value, or synchronize your component's state with your subject(s).

React Example:

```js
function Component() {
  const store = useStore(rootContext);

  // render error / completion information
  const [next, error, complete] = useSubscription(store.viewerCount$);

  return (
    <>
      Latest viewer count: {next}
      Stream had an error?: {error}
      Stream is ended?: {complete}
    </>
  );
}
```

Read more about the [useSubscription hook](./react/api-reference/use-subscription.md) in the API reference.

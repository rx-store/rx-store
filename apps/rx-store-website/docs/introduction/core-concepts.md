---
id: getting-started
title: Getting Started with Rx Store
---

`Rx Store` is a reactive store for frontend UI libraries (such as React), making it easy for you to build your application's logic using [RxJs](https://rxjs.dev/) streams. If you are not yet familiar with RxJs, [this video](https://www.youtube.com/watch?v=ewcoEYS85Co) is a great introduction!

Unlike a state management library, `Rx Store` is a stream management library. It is better suited to managing data that changes frequently or in complex ways over time, such as in real-time applications.

## Concepts

Let's walk through the `Rx Store` concepts using some examples:


### Store

In `Rx Store` you can have one or many stores. Each store contains a `value` object, where you define various [streams](./rxjs-concepts.md):

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

Effects produce side effects. These are functions called by `Rx Store` that subscribe to the stream(s) in the store. When your stream(s) emit, you can run some side effect like a http request, or emitting onto another stream.

Here is an example of an effect that subscribes to the `count$` stream, and emits the values onto the `countCopy$` subject with 1 second delay:

```tsx
export const effect = (store) => {
  const subscription = store.count$
    .pipe(delay(1000))
    .subscribe((count) => {
      store.countCopy$.next(count);
    });
  return () => subscription.unsubscribe();
};
```

### Components

In addition to subscribing to the stream(s) in your store as part of an effect, you can subscribe directly from your components. This allows you to re-render a component whenever a stream emits a value, or synchronize your component's state with your stream(s).
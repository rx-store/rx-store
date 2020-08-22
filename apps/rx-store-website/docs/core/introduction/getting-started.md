---
id: getting-started
title: Getting Started
---

Rx Store is a reactive state management solution for frontend component libraries such as [React](../react/installation.md) &amp; [Angular](../angular/angular.md), allowing you to build your application's logic using [RxJs](https://rxjs.dev/). If you are not yet familiar with RxJs, [the Fireship Youtube video](https://www.youtube.com/watch?v=ewcoEYS85Co) is a great introduction!

Compared with most state management libraries, Rx Store:

- Is well suited to managing data that changes frequently or in complex ways over time.
- Is purpose built for real-time, modern event driven applications.
- Allows writing boilerplate free logic with pure functions [that are easily tested](https://rxjs.dev/guide/testing/marble-testing).
- Introduces very few new concepts to learn beyond RxJS itself.
- Plays nicely with code splitting.
- Has dev tools allowing to visualize at a glance the high level data flow in your application.

## Store Value

In Rx Store, each store has a store value, which is an object. It is where you define your RxJS [subjects](https://rxjs.dev/guide/subject) which are your applications event emitters:

```js
{
  // This stream will emit the latest chat messages!
  chatMessage$: new Subject(),

  // This stream will emit the latest viewer count!
  viewerCount$: new BehaviorSubject(0),
}
```

## Effects

Effects are functions that encapsulate some unit of logic as an [observable](https://rxjs.dev/guide/observable). Just like functions represent a unit of computation in a regular program, and just like components represent the smallest "atom" in a UI library, effects are the main unit of computation of Rx Store. Effects are just functions which return observables, effects can:

- React to your application's events
- Run asynchronous logic
- Trigger side effects (such as an http request)
- Spawn other effects
- Emit new event(s) in your application

Here is an example of an effect that emits a "pong" `chatMessage` in response to a "ping" `chatMessage`, after a one second delay:

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

The subjects in your [store value](#store-value) are accessed via _sources_ and _sinks_, which:

- Are read &amp; write only interfaces for reacting to and publishing events
- Are unique for each effect, allowing Rx Store to track your data flow
- Makes the data flow uni-directional and explicit

## Manager

Each store has a manager. A manager is responsible for:

- Providing the [store value](#store-value) to the component(s) below it
- For subscribing to (and unsubscribing from) [effects](#effects)

You may choose to:

- wrap your entire application in a single global store, and use RxJS to manage the lifecycle of your effects.
- have multiple stores scoped to specific subtrees or areas of your application, tying the lifecycle of the effects to the lifecycle of your component tree(s).

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

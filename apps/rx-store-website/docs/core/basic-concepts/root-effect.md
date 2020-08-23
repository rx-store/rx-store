---
id: root-effect
title: Root Effect
---

Each store has one root one effect. If you want multiple effects, you must [use the `spawnEffect` function](../guides/nesting-effects.md) together with [RxJS operators](https://rxjs-dev.firebaseapp.com/guide/operators) to nest effects under the root effect.

## What are effects?

Effects are functions that encapsulate a unit of logic as an [observable](https://rxjs.dev/guide/observable). Just like functions represent a unit of computation in a regular program, and a component is the smallest "atom" in a UI library, effects are the main unit of computation of Rx Store. Effects can:

- React to your application's events
- Run asynchronous logic
- Trigger side effects (such as an http request)
- Spawn other effects
- Emit new event(s) in your application

## Basic Example

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

## Sources &amp; Sinks

The subjects in your [store value](#store-value) are accessed by your effects via _sources_ and _sinks_, which:

- Are read &amp; write only interfaces for reacting to and publishing events
- Are unique for each effect, allowing Rx Store to track your data flow
- Makes the data flow uni-directional and explicit

Sources and sinks are both functions, which allows Rx Store to keep track of which subject(s) your effect(s) react to and emit on to. This proves to be incredibly useful for being able to observe the store, such as for logging and debugging.

Sources are [observables](), they are essentially the result of calling [asObservable](https://rxjs.dev/api/index/class/Subject#asobservable-) to "seal off" the subjects and make them read only.

Sinks are [RxJS operators](https://rxjs-dev.firebaseapp.com/guide/operators), meaning you place them directly in a pipeline. They will take the values emitted on the source observable (the observable returned by the operator preceding it in the pipeline) and emit them onto the corresponding [subject](https://rxjs.dev/guide/subject) on your [store value](./store-value.md). The value will be passed through unmodified by the sinks if there are any additional operators in your pipeline.

## Typescript

If you are using Typescript, you'll be pleased to know that Rx Store uses [mapped types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) so you automatically get [intellisense](https://code.visualstudio.com/docs/editor/intellisense), type safety, and auto-completion out of the box for sources &amp; sinks, corresponding to each subject in the [store value](./store-value.md).

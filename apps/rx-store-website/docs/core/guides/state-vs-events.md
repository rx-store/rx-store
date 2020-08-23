---
id: state-vs-events
title: State vs Events
---

## State values

State can be modeled as a stream, where an event is emitted onto the stream each time the state changes, where the event itself is the latest value of the state.

One good pattern for this is to use a [behavior subject](https://rxjs-dev.firebaseapp.com/guide/subject#behaviorsubject).

The `BehaviorSubject` is a subject, which has a notion of "the current value". It stores the latest value emitted to its consumers, and whenever a new `Observer` subscribes, it will immediately receive the "current value" from the BehaviorSubject.

```ts
count$ = new BehaviorSubject(1);
count$.subscribe((value) => console.log(`subscription 1: ${value}`));
count$.next(2);
count$.subscribe((value) => console.log(`subscription 2: ${value}`));
count$.next(3);

// subscription 1: 1
// subscription 1: 2
// subscription 2: 2
// subscription 1: 3
// subscription 2: 3
```

## State changes

State can be modeled as a stream, by having each event describe the changes to the state surfaced as an event. This is called [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html).

Here is an effect that reacts to the `counterChange$`, each time it emits `1` or `-1`, it'll add that to an accumulator with a `scan()` operator, and emit the running total onto the `count$` sink.

```tsx
export const effect = ({sources, sinks}) =>
  sources.counterChange$()
    .pipe(
      scan((acc, val) => acc + val, 0)
      startWith(0),
      sinks.count$()
    )
};
```

You may want to make your subject a [replay subject](https://rxjs-dev.firebaseapp.com/guide/subject#replaysubject) if you want late subscriber to receive all of the events that occurred before they subscribed.

:::danger
Use a replay subject without passing in a maximum buffer size only after considering that it internally stores every event by default, which can easily cause memory leaks that cause your app to consume infinite amounts of memory and crash over time.
:::

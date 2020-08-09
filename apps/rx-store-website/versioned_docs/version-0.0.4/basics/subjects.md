---
id: subjects
title: "Subjects"
---

There are different types of [subjects in Rxjs](https://rxjs-dev.firebaseapp.com/guide/subject). Subjects should be a single source of truth in your `Rx Store`,
you emit values onto them which are then multi-cast to all subscribers.

### Subjects

```tsx
store.count$.subscribe((x) => console.log(`subscriber A ${x}`));
store.count$.next(1);
store.count$.subscribe((x) => console.log(`subscriber B ${x}`));
store.count$.next(2);
store.count$.next(3);

// subscriber A 1
// subscriber A 2
// subscriber B 2
// subscriber A 3
// subscriber B 3
```

Notice that only `subscriber A` received the first value, but after `subscriber B` subscribed, both subscribers received the following values.

## Behavior Subject

A behavior subject should be used when you want subscribers to get the latest value when they first subscribe. If your subject models a stream of the latest state of something, you probably want a `behavior subject`.

```tsx
const store = {
    // doesn't emit any value upon subscription,
    // until user acts, producing the next value.
  counterChange$: new Subject();

  // emits the latest value on initial subscription,
  // rather than waiting for next value.
  count$: new BehaviorSubject(0);
};

// emits the last [initital] value on subscribe (outputs 0!)
store.count$.subscribe(value => console.log(value));

// does not emit anything, yet.
store.counterChange$.subscribe(value => console.log(value));
```

## Replay Subject

A [ReplaySubject](https://rxjs-dev.firebaseapp.com/guide/subject#replaysubject) records multiple values from the Observable execution and replays them to new subscribers.

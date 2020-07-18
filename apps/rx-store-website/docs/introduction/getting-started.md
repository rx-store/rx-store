---
id: getting-started
title: Getting Started
---

`Rx Store` is a reactive store for frontend UI libraries (such as React), allowing you to model apps using [RxJs](https://rxjs-dev.firebaseapp.com/) streams. If you are not yet familiar with RxJs, [this video](https://www.youtube.com/watch?v=ewcoEYS85Co) is a great introduction!

## Concepts

Let's walk through the `Rx Store` concepts using some examples:

### Subjects

[RxJS Subjects](https://rxjs-dev.firebaseapp.com/guide/subject) are simple event emitters. In `Rx Store`, these event emitters are the most primitive source of truth for your app.

To see how you can model state with a stream, we'll create a counter app where we will use a subject acting as a stream of the latest state, in this case a `count`. We suffix the name `count$` with `$` to indicate it is a stream of `count` values that can be subscribed to.

```tsx
import { Subject } from "rxjs";

const store = {
  count$: new Subject(),
};

store.count$.subscribe(console.log);

store.count$.next(123);
```

[Read more about subjects in Rx Store](basics/subjects.md).

### Observables

With observables, we will combine, process, and manipulate time declaratively. Observables can source data from subjects, as well as any external sources of data coming from outside of `Rx Store` including but not limited to callbacks, promises, other streams libraries, etc.

```tsx
const myClicks$ = new Subject();
const yourClicks$ = new Subject();

// observable derived from 2 subjects:
const bothClicks$ = merge(myClick$, yourClick$).pipe(delay(100));

const store = {
  myClick$,
  yourClick$,
  bothClick$,
  timerA$,
  timerB$,
};
```

Observables, just like subjects, can be subscribed to, [read more about observables in Rx Store](basics/observables.md).

### Effects

Effects are functions called by `Rx Store` that handle subscriptions, normally producing side effects, or handling some cross cutting concerns.

Here is an effect that subscribes to the `count$` stream, and emits the values onto the `countCopy$` subject:

```tsx
export const effect = (store) => {
  const subscription = store.count$.subscribe((count) => {
    store.countCopy$.next(count);
  });
  return () => subscription.unsubscribe();
};
```

---
id: observables
title: Observables
---

## Sort of like selectors, except not

With other state management like Redux, you receive the top level state and must pare it down to select just the part(s) of the state you need. The pared down state is then diffed immutably, which has various pitfalls like running every `mapStateToProps` on every change to any state, and re-rendering large lists when only one element changed in a large array.

## Building up streams

With observables, we will work backwards from the stream we want by building "up" lower level streams.

- We can combine multiple streams, for example with [merge](https://rxjs-dev.firebaseapp.com/api/index/function/merge), or [combineLatest](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest),
- We can transform values, for example with [bufferTime](https://rxjs-dev.firebaseapp.com/api/operators/bufferTime) or [map](https://rxjs-dev.firebaseapp.com/api/operators/map)
- We can reduce a stream of events to a latest state with [scan](https://rxjs-dev.firebaseapp.com/api/operators/scan)
- So much more!

## Example

Here we create an observable `bothClick$`. Just like subjects, it can be subscribed to, however there is no `.next()` method.

```tsx
const myClicks$ = new Subject();
const yourClicks$ = new Subject();

// observable derived from 2 subjects:
const bothClicks$ = merge(myClick$, yourClick$).pipe(delay(100));
```

## Imperative Example

As you learn RxJs, if you ever get stuck, you can always revert to writing imperative code, for example with the [observable constructor](https://rxjs-dev.firebaseapp.com/guide/observable#creating-observables) which may look familiar if you're experienced with the [promise constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise).

```tsx
const timer$ = new Observable((subscriber) => {
  let i = 0;
  const int = setInterval(() => {
    i++;
    subscriber.next(i);
  }, 1000);
  return () => clearInterval(int);
});
```

## Declarative Example

Its often much nicer to make it declarative! This does the same thing!

```tsx
const timer$ = interval(1000)
```

## Uni-cast vs Multi-cast

Each subscriber will get its own instance of stream state. In both of the above two examples, each time you `subscribe()` to `timer$`, it runs a new `setInterval()`, and each time you `unsubscribe()` it runs the corresponding `clearInterval()`. You will have `N` number of intervals going, where `N` is the number of subscriptions. Each subscription's callback will run in a separate tick of the event loop.

You could use the [share](https://rxjs.dev/api/operators/share) operator in your observable pipeline, which internally uses a subject, it would make all subscribers share a single `setInterval` callback running in the same event loop tick.

For more on [multi casting, see the RxJs docs.](https://rxjs-dev.firebaseapp.com/guide/subject#multicasted-observables)

---
id: effects
title: Effects
---

`Rx Store` effects are simply functions that subscribe to [RxJs subscriptions](https://rxjs-dev.firebaseapp.com/guide/subscription), and return functions to unsubscribe.

---

Each store has one root effect, and you may nest them, building a directed cyclic graph your data flows through, triggering side effects as they go!

Effects will normally produce side effects, or handle some cross cutting concern. Effects are long lived, until your store is torn down & disposed of. You can use filtering operators in RxJS such as `skipWhile()`, `takeUntil()` to use other streams in the store to control & limit when & how your effect does work.

## Processing a stream of changes, and creating a stream of state

Here is an effect that subscribes to the `counterChange$`, each time it emits `1` or `-1`, it'll add that to an accumulator with a `scan()` operator, and emit the running total onto the `count$` subject. It returns a function that calls unsubscribe on the subscription:

```tsx
export const effect = (store) => {
  const subscription = store.counterChange$
    .pipe(scan((acc, val) => acc + val, 0))
    .subscribe((count) => store.count$.next(count));
  return () => subscription.unsubscribe();
};
```

## Effects that manipulate time

Here is an effect that subscribes to the `count$` stream, it delays each value by one second, and logs them to console.

```tsx
export const effect = (store) => {
  const subscription = store.count$.pipe(delay(1000)).subscribe((count) => {
    console.log({ count });
  });
  return () => subscription.unsubscribe();
};
```

## Recursive effects

Here is an effect that resets the count back to 1 with a 50% probability anytime it emits. Be careful not to create an infinite loop by having a stream recursively emit back onto itself with 100% probability, with no base case to stop it!

```tsx
export const effect = (store) => {
  const subscription = store.count$.subscribe((count) => {
    if (Math.random() > 0.5 && count !== 1) {
      store.count$.next(1);
    }
  });
  return () => subscription.unsubscribe();
};
```

## Combining data producers in complex ways

We can subscribe directly to subjects, observables, or create combos and higher order streams by combining them and using creation operators such as `merge()`, `combineLatest()`, and higher order operators such as `bufferWhen()`:

```tsx
export const effect = (store) => {
  const subscription = merge(store.myClick$, store.yourClick$).subscribe(
    (clickEvent) => {
      console.log({ clickEvent });
    }
  );
  return () => subscription.unsubscribe();
};
```

## Nesting multiple effects

If you want multiple effects & subscriptions, it is up to you to nest them like so:

```tsx
export const effect = (store) => {
  const subscriptions = []
  subscriptions.push(
    store.count$.subscribe((count) => console.log({ count })),
    store.count$.subscribe((count) => console.log({ count })),
    store.count$.subscribe((count) => console.log({ count })),
  });
  return () => subscriptions.forEach(s => s.unsubscribe());
};
```

Although you can also choose to do this declaratively, with RxJs!

```tsx
export const effect = (store) => {
  const subscription = merge(
    ...new Array(3).fill(store.count$)
  ).subscribe((count) => console.log({ count }));
  return () => subscription.unsubscribe());
};
```

## Other Examples

### Example 1

Your effect will more commonly emit onto some other subject, for example you might often subscribe to a `request$` subject in your effect, and for each value emitted on that `subject` you might start a network request, and you might emit the responses onto a `response$` subject.

### Example 2

In a social network app you may have "trigger" effect, for example a `refetchNewsFeed$` subject, when the user scrolls up a value is emitted on this subject, which triggers an effect to fetch the latest news feed posts & emit them onto a `newsFeedPost$` subject, a stream of the latest news feed posts.

### Example 3

In a video game, you might have a "game loop" effect wherein you subscribe to the latest `x$`, `y$` mouse position, and a stream of the latest `click$`. You might emit onto a stream of `hit$` & `miss$` depending on if the latest values on the `x$`, `y$` streams collide with any enemy positions at the points in time that the `click$` stream emitted values. Furthermore you might skip emitting these values while the `ammo$` stream has 0 values, by using RxJs control flow operators such as [takeUntil](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil)

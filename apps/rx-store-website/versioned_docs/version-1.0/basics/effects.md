---
id: effects
title: Effects
---

`Rx Store` effects are functions that return observables. Rx Store [subscribes](https://rxjs-dev.firebaseapp.com/guide/subscription) to these for you.

---

Each store has only one root effect, you may nest effects with Rx operators, building a tree of effects your data flows through, triggering side effects as the data flows!

Effects will normally produce side effects, or handle some cross cutting concern. Effects are long lived, until your store is torn down & disposed of. You can use filtering operators in RxJS such as `skipWhile()`, `takeUntil()` to use other streams in the store to control & limit when & how your effect does work.

## Processing a stream of changes, and creating a stream of state

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

`Sources` are like the inputs, where the data flows from Rx Store into the effect. `Sinks` are like the outputs, where the data can flow out of the effect (back into your Rx Store). Separating the sources and sinks allows Rx Store to track all data flow in your app, enabling things such as devtools to assist in debugging.

## Effects that manipulate time

Here is an effect that subscribes to the `count$` source, it delays each value by one second, and logs them to console as a side effect.

```tsx
export const effect = ({ sources }) =>
  sources.count$().pipe(delay(1000), tap(console.log));
```

## Recursive effects

Here is an effect that resets the count back to 1 with a 50% probability anytime it emits. Be careful not to create an infinite loop by having a stream recursively emit back onto itself with 100% probability, with no base case to stop it!

```tsx
export const effect = ({sources, sinks}) =>
  sources.count$().pipe(
    filter((count) => Math.random() > 0.5 && count !== 1))
    sinks.count$()
  )
```

## Combining data producers in complex ways

We can subscribe directly to subjects, observables, or create combos and higher order streams by combining them and using creation operators such as `merge()`, `combineLatest()`, and higher order operators such as `bufferWhen()`:

```tsx
export const effect = ({ sources }) =>
  merge(sources.myClick$(), sources.yourClick$()).pipe(
    tap((clickEvent) => {
      console.log({ clickEvent });
    })
  );
```

## Nesting multiple effects

If you want multiple effects & subscriptions, it is up to you to nest them using RxJs operators. Rx Store just expects to have one root subscription, and it does not care about values emitted on this subscription. Each effect is passed a `spawnEffect` function which allows `Rx Store` to track the parent child relationship between effects, essentially keeping an internal "stack trace" of effects.

```tsx
export const appRootEffect = ({ spawnEffect }) =>
  merge(
    spawnEffect(time, { name: 'time' }),
    spawnEffect(counter, { name: 'counter' })
  );
```

## Other Examples

### Example 1

Your effect will more commonly emit onto some other subject, for example you might often subscribe to a `request$` subject in your effect, and for each value emitted on that `subject` you might start a network request, and you might emit the responses onto a `response$` subject.

### Example 2

In a social network app you may have "trigger" effect, for example a `refetchNewsFeed$` subject, when the user scrolls up a value is emitted on this subject, which triggers an effect to fetch the latest news feed posts & emit them onto a `newsFeedPost$` subject, a stream of the latest news feed posts.

### Example 3

In a video game, you might have a "game loop" effect wherein you subscribe to the latest `x$`, `y$` mouse position, and a stream of the latest `click$`. You might emit onto a stream of `hit$` & `miss$` depending on if the latest values on the `x$`, `y$` streams collide with any enemy positions at the points in time that the `click$` stream emitted values. Furthermore you might skip emitting these values while the `ammo$` stream has 0 values, by using RxJs control flow operators such as [takeUntil](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil)

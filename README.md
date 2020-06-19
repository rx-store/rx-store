# RX Store

Reactive store for frontend UI libraries, like React, using Rxjs.

# Motivation

Existing "reactive" stores exist, built with RxJS, but all were all inherently built with "state" instead of "streams", or uses a single global event emitter with a single root state that changes on every update, like ngRx store or redux-observable.

In larger redux apps, even with memoization, running every mapStateToProps on every action can be expensive. It is especially problematic if you have lots of things happening over time. For these use cases, it is better to deal with "streams" instead of with "state".

# Principles

- Only render/deliver updates for what changed, nothing more.
- Only deals with events, not state.
- Work with the RxJS API directly, this is not a "wrapper" on top of Rxjs.
- Derive state "up" instead of "down" (read on).

# Concepts

Let's walk through the Rx Store concepts using a counter app.

## Subjects

These "subjects" are closest to what you're used to calling your app's "state". Instead of state, they are event emitters.

Our counter app will use an event bus where we will emit values, in this case a `count`!

```tsx
const appSubjects: AppSubjects = {
  count$: new Subject()
};
```

Subjects should be a single source of truth,
they are multi-cast, both read & write. That is, you can subscribe to them, and emit values on them which will be multi-cast to all the subscribers.

```tsx
appSubjects.subscribe(x => console.log(`subscriber A ${x}`));
appSubjects.count$.next(1);
appSubjects.subscribe(x => console.log(`subscriber B ${x}`));
appSubjects.count$.next(2);
appSubjects.count$.next(3);

// subscriber A 1
// subscriber A 2
// subscriber B 2
// subscriber A 3
// subscriber B 3
```

Notice that only `subscriber A` received the first value, but after `subscriber B` subscribed, both subscribers received all subsequent events. This is all just core RxJS so far, you can run the example code here:

https://stackblitz.com/edit/rxjs-szr5f9

### Observables

These "observables" are your app's "selectors".

They derive state, manipulate time, are lazy &
uni-cast, and are read only.

```tsx
const appObservables: AppObservables = {
  evenCount$: appSubjects.count$.asObservable().pipe(
    delay(500),
    filter((x: number) => x % 2 === 0)
  ),

  oddCount$: appSubjects.count$.asObservable().pipe(
    delay(500),
    filter((x: number) => x % 2 !== 0)
  )
};
```

Observables, just like subjects, can be subscribed to, however they are uni-cast & lazy, meaning the timer for the `delay` will not start a timer until something subscribes, and each subscriber will get its own timer.

## Effects

Effects are where we actually subscribe. We can subscribe directly to our subjects (event emitters), subscribe directly to observables, or create combos using creating operators such as `merge()`, `combineLatest()`, `bufferWhen()` etc.

Here is an effect that subscribes to the `count$` stream of events, delays the events by 1s, and logs them to console.

Your subscription could emit values back onto the `count$` subject if you wanted, which would create an infinite loop.

```tsx
export const appRootEffect: RxStoreEffect<AppContextValue> = ({ subjects }) => {
  const subscription = subjects.count$
    .pipe(delay(1000))
    .subscribe(count => console.log({ count }));
  return () => subscription.unsubscribe();
};
```

Your subscription will more commonly emit onto some other subject, or run some sort of side effect. For example you could subscribe to a subject, and for each event send a network request, and emit the network responses onto some other subject.

## React Example app

Check out the full [example counter app](https://github.com/rx-store/rx-store/tree/master/packages/react-rx-store-example-counter)

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
const appSubjects = {
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
const appObservables = {
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
export const appRootEffect = ({ subjects }) => {
  const subscription = subjects.count$
    .pipe(delay(1000))
    .subscribe(count => console.log({ count }));
  return () => subscription.unsubscribe();
};
```

Your subscription will more commonly emit onto some other subject, or run some sort of side effect. For example you could subscribe to a subject, and for each event send a network request, and emit the network responses onto some other subject.

## State vs Streams

### Subject

Let's rename our `count$` subject to `countChange$`. We're going to switch our thinking from state to streams. No longer will this be a stream of state, it will be a stream of changes!

```tsx
const appSubjects = {
  countChange$: new Subject()
};
```

### Behavior Subject

```tsx
const appSubjects = {
  countChange$: new Subject()
  count$: new BehaviorSubject(0)
};

// emits the last [initital] value on subscribe
appSubjects.count$.subscribe(value => console.log(value));
```

Lastly, we add an effect that subscribes to the `countChange$`, each time it emits `1` or `-1`, we'll add that to an accumulator with a `scan()` operator, and emit the running total back onto `count$` subject:

```tsx
export const appRootEffect = ({ subjects }) => {
  const subscription = subjects.streamCounterChange$
    .asObservable()
    .pipe(scan((acc, val) => acc + val, 0))
    .subscribe(count => appSubjects.count$.next(count));
  return () => subscription.unsubscribe();
};
```

## Deriving state "up"

In a traditional Redux app, you may be used to paring down the state using selectors, or deriving state "down".

When thinking & working reactively, first think about the stream you want, and work backwards from that. The result is you write code that builds the state "up".

Example:

```tsx
const allClick$ = merge(myClick$, yourClick$);
```

In this example we're working backwards, we wanted a stream of all the clicks, so we defined it. Then we assigned the result of merging two other streams. This merge operator builds "up" the state.

Compare this to Redux change detection:

```tsx
const mapStateToProps = state => ({
  user: state.user,
  page: state.page
});
```

With Redux, you start out with the top level state, and pared it "down" to the subset of state you wanted. This works fine until you have a larger app where running all `mapStateToProps` on every state change in the entire app becomes unwieldy. It is also prone to unwanted renders, imagine the `page` state looks like this:

```
{
    name: 'Test',
    url: '/test',
}
```

Now imagine someone comes along & adds the current time to this object, in a manner where it updates every 100ms (10x a second):

```
{
    name: 'Test',
    url: '/test',
    time: 1592539673319
}
```

With the naive `mapStateToProps` function above, your component would re-render with a new `page` object 10x a second, even if all the component actually renders is the page's `name`.

With `Rx Store`, we do not have 1 top level state object that is always changing, which we have to pare down & memoize. Instead, we have many low level things updating independantly, and we must subscribe to, merge, or combine them individually, allowing fine grained control of what updates.

## React Example app

Check out the full [example counter app](https://github.com/rx-store/rx-store/tree/master/packages/react-rx-store-example-counter)

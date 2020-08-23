---
id: counter
title: Counter App
---

## Create a React app

We'll assume you already have a React app setup, if not [create one now](https://reactjs.org/docs/create-a-new-react-app.html), [and install `Rx Store`](../installation.md). We'll use [create react app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app):

```
npx create-react-app rx-store-counter-test --template typescript
yarn add @rx-store/react @rx-store/core rxjs
```

## Store Value (subjects)

The store value is where we'll store our sources of truth. We'll use two [subjects](https://rxjs-dev.firebaseapp.com/guide/subject), one called `counterChange$` which will be a stream that emits the user's intent to increment or decrement the counter by emitting a `1` or a `-1` value, and one subject called `count$` where we will emit the latest value of the counter each time it is calculated. We'll declare the typings here, but if you're not using typescript you can skip this step.

```tsx
interface AppStoreValue extends StoreValue {
  counterChange$: Subject<1 | -1>;
  count$: Subject<number>;
}
```

Next, we'll implement this interface, or create the store value. For `counterChange$` we will use a regular [subject](https://rxjs-dev.firebaseapp.com/guide/subject#subject) and for `count$` we'll use a [behavior subject](https://rxjs-dev.firebaseapp.com/guide/subject#behaviorsubject) so that it keeps track of the "latest" value and acts more stateful instead of just being an event emitter, we'll also give it an initial value of `0`.

```tsx
const storeValue: AppStoreValue = {
  counterChange$: new Subject(),
  count$: new BehaviorSubject(0),
};
```

## Effect

Next, we'll add an effect for our store. This is where we put business logic and side effects. Effects are functions that are passed `sources` and `sinks`. We'll access the `counterChange$` source, use the [RxJS scan operator to put some state in our stream that sums the values](), giving us a stream that emits the latest count. We'll then pipe this through to our `count$` sink. `sources` and `sinks` are just ways to react to & emit events back onto the subjects.

```tsx
const effect: Effect<AppStoreValue> = ({ sources, sinks }) =>
  sources.counterChange$().pipe(
    scan((acc, value) => acc + value, 0),
    sinks.count$()
  );
```

[Read more about effects in Rx Store](../../core/basic-concepts/root-effect).

## Create Store

We'll simply pass in the `storeValue` (subjects) and the `effect` to the `store()` method:

```tsx
const { Manager, context } = store({ value: storeValue, effect });
```

## Wrap App in the &lt;Manager&gt;

Next, we'll take the `Manager` component returned by the `store()` method & wrap our app with it:

```tsx
<Manager>
  <>your app goes here</>
</Manager>
```

## Add buttons

We can use the `useStore` hook to consume the `storeValue` from the [React context](https://reactjs.org/docs/context.html) that was returned by the `store()` method. Once we have the `storeValue` we can reference the subjects & emit values onto them. Here we have created 2 buttons that emit a `1` or a `-1` value onto the subject when clicked.

```tsx
const store = useStore(context);
<button onClick={() => store.counterChange$.next(1)}>+</button>
<button onClick={() => store.counterChange$.next(-1)}>-</button>
```

## Display count

We can display the current count by accessing the subject, and subscribing to it with the `useSubscription()` hook provided by `Rx Store`:

```tsx
const store = useStore(context);
const [next] = useSubscription(store.count$);
return <div>count: {next}</div>;
```

[Read more about the useSubscription hook](../api-reference/use-subscription.md)

## Summary

That's all there is to creating a simple counter app in `Rx Store`! Checkout the [example app here on GitHub](https://github.com/rx-store/rx-store/tree/master/apps/react-example-counter). Here's the full code including the imports:

```tsx
import React from 'react';
import './App.css';
import { store, useStore, useSubscription } from '@rx-store/react';
import { Subject, BehaviorSubject } from 'rxjs';
import { scan } from 'rxjs/operators';
import { StoreValue, Effect } from '@rx-store/core';

interface AppStoreValue extends StoreValue {
  counterChange$: Subject<1 | -1>;
  count$: Subject<number>;
}

const storeValue: AppStoreValue = {
  counterChange$: new Subject(),
  count$: new BehaviorSubject(0),
};

const effect: Effect<AppStoreValue> = ({ sources, sinks }) =>
  sources.counterChange$().pipe(
    scan((acc, value) => acc + value, 0),
    sinks.count$()
  );

const { Manager, context } = store({ value: storeValue, effect });

function App() {
  const store = useStore(context);
  const [next] = useSubscription(store.count$);

  return (
    <div className="App">
      <Manager>
        count: {next}
        <button onClick={() => store.counterChange$.next(1)}>+</button>
        <button onClick={() => store.counterChange$.next(-1)}>-</button>
      </Manager>
    </div>
  );
}

export default App;
```

---
id: manipulate-time
title: Manipulating Time
---

Here is an effect that subscribes to the `count$` source, it delays each value by one second, and logs them to console as a side effect.

```tsx
export const effect = ({ sources }) =>
  sources.count$().pipe(delay(1000), tap(console.log));
```

Here is an effect that emits a monotonically increasing value onto `count$`, every second:

```ts
export const effect = ({ sinks }) => timer(1000).pipe(sinks.count$());
```

You can also use any of the plethora of [RxJS operators](https://rxjs-dev.firebaseapp.com/guide/operators) or make your own operators that wrap some imperative async logic.

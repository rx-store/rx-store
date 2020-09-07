---
id: combining-in-effects
title: Combining in Effects
---

We can subscribe directly to subjects, observables, or create combos and higher order streams by combining them and using creation operators such as `merge()`, `combineLatest()`, and higher order operators such as `bufferWhen()`:

```tsx
export const effect = ({ sources }) =>
  merge(sources.myClick$(), sources.yourClick$()).pipe(
    tap((clickEvent) => {
      console.log({ clickEvent });
    })
  );
```

You can also use any of the plethora of [RxJS operators](https://rxjs.dev/guide/operators) or make your own operators that encapsulate combining logic.

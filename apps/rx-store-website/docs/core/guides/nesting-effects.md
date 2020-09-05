---
id: nesting-effects
title: Nesting Effects
---

Each store has only one root effect, you may nest effects with Rx operators, building a tree of effects your data flows through, triggering side effects as the data flows!

You can use the `spawnEffect` function within an effect to create new effects. Combine this with any of the [RxJS operators](https://rxjs.dev/guide/operators) like `merge`:

```ts
export const appRootEffect = ({ spawnEffect }) =>
  merge(
    spawnEffect(time, { name: 'time' }),
    spawnEffect(counter, { name: 'counter' })
  );
```

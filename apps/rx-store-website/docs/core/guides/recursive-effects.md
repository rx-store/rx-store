---
id: recursive-effects
title: Recursive Effects
---

Here is an effect that resets the count back to 1 with a 50% probability anytime it emits. Be careful not to create an infinite loop by having a stream recursively emit back onto itself with 100% probability, with no base case to stop it!

```tsx
export const effect = ({sources, sinks}) =>
  sources.count$().pipe(
    filter((count) => Math.random() > 0.5 && count !== 1))
    sinks.count$()
  )
```

---
id: effect-creators
title: Effect Creators
---

Often, as shown in the [nesting effects](./nesting-effects.md) guide, you may need to have an effect that spawns inner effects using the `spawnEffect` function. Sometimes, you may need to pass a value to the inner effect. To do this, wrap your effect in a function which we'll call the `effect creator`

## Example

First, we'll create the Typescript typing for the effect creator (if you're not using Typescript skip this part). The effect creator is a function that returns an effect (which itseslf is a function that returns an observable). In this example, the effect creator takes in a single argument, a number called `i`. It returns the effect (which is a function).

```ts
type CreateEffect = (i: number) => Effect<ContextValue, never>;
```

To implement this effect creator, we'll create a higher order function that takes in the `i` number, and returns a function that closes over `i` and return the observable that encapsulates the effect's logic:

```ts
const createEffect: CreateEffect = (i) => ({ sources }) => {
  // your effect code here
};
```

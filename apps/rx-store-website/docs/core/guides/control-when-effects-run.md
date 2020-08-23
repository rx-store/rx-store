---
id: control-when-effects-run
title: Control when effects run
---

Effects are just functions which return observables. Rx Store [subscribes](https://rxjs-dev.firebaseapp.com/guide/subscription) to your effects in the [store's manager.](./manager.md) The logic in your observable will not run until the [manager](./manager.md) subscribes, just like a function does not do any work until called, and a component does nothing until rendered in a UI library.

Effects are long lived, until your store is torn down & disposed of. You can use filtering operators in RxJS such as `skipWhile()`, `takeUntil()` to use other streams in the store to control & limit when & how your effect does work.

In a video game, you might have a "game loop" effect wherein you subscribe to the latest `x$`, `y$` mouse position, and a stream of the latest `click$`. You might emit onto a stream of `hit$` & `miss$` depending on if the latest values on the `x$`, `y$` streams collide with any enemy positions at the points in time that the `click$` stream emitted values. Furthermore you might skip emitting these values while the `ammo$` stream has 0 values, by using RxJs operators such as [takeUntil](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil)

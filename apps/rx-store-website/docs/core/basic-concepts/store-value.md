---
id: store-value
title: Store Value
---

In Rx Store, each store has a store value, which is an object. It is where you define your RxJS [subjects](https://rxjs.dev/guide/subject) which are your applications event emitters:

```js
{
  // This stream will emit the latest chat messages!
  chatMessage$: new Subject(),

  // This stream will emit the latest viewer count!
  viewerCount$: new BehaviorSubject(0),
}
```

They type of subject you want most likely [depends on what you're modeling, state or events](../guides/state-vs-events.md)

---
id: manager
title: Store Manager
---

Each store has a manager. The store's manager is responsible for:

- Providing the [store value](#store-value) to the component(s) below it.
- For subscribing to (and unsubscribing from) the store's [root effect](#effects).

You may choose to:

- Wrap your entire application in a single global store, and use [RxJS operators to manage the lifecycle of your effects](../guides/control-when-effects-run.md).
- Have multiple stores scoped to specific subtrees or areas of your application, tying the lifecycle of the effects to the lifecycle of your component tree(s).

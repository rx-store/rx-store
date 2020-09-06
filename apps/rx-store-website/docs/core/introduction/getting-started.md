---
id: getting-started
title: Getting Started
---

Rx Store is a reactive state management solution for frontend component libraries such as [React](../../react/installation.md) &amp; [Angular](../../angular/angular.md), allowing you to build your application's logic using [RxJS](https://rxjs.dev/). If you are not yet familiar with RxJS, [the Fireship Youtube video](https://www.youtube.com/watch?v=ewcoEYS85Co) is a great introduction!

---

Compared with most state management libraries, Rx Store:

- Is well suited to managing data that changes frequently or in complex ways over time.
- Is purpose built for real-time, modern event driven applications.
- Allows writing boilerplate free logic with pure functions [that are easily tested](https://rxjs.dev/guide/testing/marble-testing).
- Introduces very few new concepts to learn beyond RxJS itself.
- Plays nicely with code splitting.
- Has dev tools allowing to visualize at a glance the high level data flow in your application.

# Basic Concepts

These are the key basic concepts in Rx Store, learning these concepts will give you a high level overview of how Rx Store works.

- The [Store Value](../basic-concepts/store-value) is an object where you define [RxJS subjects](https://rxjs-dev.firebaseapp.com/guide/subject) for your application's events.
- [Effects](../basic-concepts/root-effect.md) are functions that encapsulate some unit of logic as an [observable](https://rxjs.dev/guide/observable), effects react to and emit events onto the subjects in your store value.
- The [Store Manager](../basic-concepts/manager.md) manages the lifecycle of the effects and provide the store value to your components.
- [Components](../basic-concepts/components.md) can subscribe to, react to, and emit events onto the subjects in your store value.

# Additional Reading

- Read up on [basic usage of Rx Store with React](../../react/react.md)
- Read a [tutorial on making a counter app with RxStore and React](../../react/guides/counter.md)
- Read up on [using Rx Store with Angular](../../angular/angular.md)
- Read the ["frequently asked questions"](../../faq.md)
- View the [source code and contribute](https://github.com/rx-store/rx-store)

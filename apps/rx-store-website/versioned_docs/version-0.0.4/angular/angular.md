---
id: angular
title: Angular
---

Angular support is still a work in progress. We do have an example app thanks to a wonderful contribution on GitHub, which can be found here: https://github.com/rx-store/rx-store/pull/17 thanks to https://github.com/gennadypolakov

If you'd like to help us build out Angular support, PRs to do so are most welcome! https://github.com/rx-store/rx-store/pulls

In React, we mount a `Manager` component which provides the store & runs it's effects. In Angular, this is like using the injector to provide a service. Angular support could rely on Angular's DI, or a `Manager` component could be created that more closely mimics the React context.
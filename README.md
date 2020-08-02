# RX Store

Reactive store for frontend UI libraries, like React, using Rxjs. https://rx-store.github.io/rx-store/docs/

# Motivation

Existing "reactive" stores exist, built with RxJS, but all were all inherently built with "state" instead of "streams", or uses a single global event emitter with a single root state that changes on every update, like ngRx store or redux-observable.

In larger redux apps, even with memoization, running every mapStateToProps on every action can be expensive. It is especially problematic if you have lots of things happening over time. For these use cases, it is better to deal with "streams" instead of with "state".

# Principles

- Only render/deliver updates for what changed, nothing more.
- Only deals with events, not state.
- Work with the RxJS API directly, this is not a "wrapper" on top of Rxjs.
- Derive state "up" instead of "down" (read on).

## Deriving state "up"

In a traditional Redux app, you may be used to paring down the state using selectors, or deriving state "down".

When thinking & working reactively, first think about the stream you want, and work backwards from that. The result is you write code that builds the state "up".

Example:

```tsx
const allClick$ = merge(myClick$, yourClick$);
```

In this example we're working backwards, we wanted a stream of all the clicks, so we defined it. Then we assigned the result of merging two other streams. This merge operator builds "up" two smaller streams into one larger combined stream.

Compare this to Redux change detection:

```tsx
const mapStateToProps = (state) => ({
  user: state.user,
  page: state.page,
});
```

With Redux, you start out with the top level state, and pared it "down" to the subset of state you wanted. This works fine until you have a larger app where running all `mapStateToProps` on every state change in the entire app becomes unwieldy. It is also prone to unwanted renders, imagine the `page` state looks like this:

```
{
    name: 'Test',
    url: '/test',
}
```

Now imagine someone comes along & adds the current time to this object, in a manner where it updates every 100ms (10x a second):

```
{
    name: 'Test',
    url: '/test',
    time: 1592539673319
}
```

With the naive `mapStateToProps` function above, your component would re-render with a new `page` object 10x a second, even if all the component actually renders is the page's `name`. In other words, Redux gives you every change by default, for you to pare down & memoize (otherwise your components may wastefully render). In Rx Store your components make specific granular subscriptions, the only way to get every change would be to manually `merge()` together everything in your app & subscribe to it.

With `Rx Store`, we do not have 1 top level state object that is always changing, which we have to pare down & memoize. Instead, we have many low level things updating independently, that we can subscribe to selectively, and we can combine these data sources, and have fine grained control of how those updates are pushed to our UI components over time.

## React Example app

Check out the full [example counter app](https://github.com/rx-store/rx-store/tree/master/apps/react-example-counter

Head on over to the website to [Get Started](https://rx-store.github.io/rx-store/)!

## Development

First, clone the monorepo onto your machine:

```
git clone git@github.com:rx-store/rx-store.git
```

Then, install the monorepo dependencies:

```
yarn
```

This monorepo uses [Nx](https://nx.dev/react), which allows:

- Visualizing the dependencies between packages
- Automatically compiling affected packages when there are changes
- Run CI checks only for affected packages when there are changes.

To develop locally, you may install `Nx` globally:

```
npm install -g @nrwl/cli
```

The packages are organized into `apps` folder, which are runnable, and `libs` for library code. To generate a new app or lib, see the [Nx docs](https://nx.dev/react/cli/generate).

### Running the "Examples" in the "apps" folder

Replace `rx-store-counter-example` with the name of the project in the `apps` folder you want to run.

Develop:

```
nx serve rx-store-counter-example
```

When editing files in the core during development, the example you are running will re-compile. Nx builds a dependency graph, and runs webpack from the top level. If changes are made in a package that the example app depends on, or any package it in turn depends on, Nx will figure it out & re-build the affected packages.

Build:

```
nx build --with-deps rx-store-counter-example
```

By passing `--with-deps`, we are telling Nx to build a dependency graph & compile all of the package(s) the example project depends on, and all of the package(s) those in turn depend on.

### Developing on the Website / Docs

Develop:
```
nx run rx-store-website:docusaurus
```

Build:
```
nx build rx-store-website:docusaurus
```

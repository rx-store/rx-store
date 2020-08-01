---
id: faq
title: FAQ
---

## How does this compare to Redux?

[Redux is a "stupid" event emitter](https://twitter.com/acdlite/status/1024852895814930432). With Redux, you affect state by dispatching actions which are objects with a `type` property, for example `{type: "COUNTER-INCREMENT"}`. Later, a reducer, which is a pure function will reduce the current state to the new state when it receives the action. There is also the concept of middleware where you can intercept actions & run your async logic, perhaps dispatching new actions. The idea of middleware is open ended and there are libraries to use regular functions or thunks, generators or sagas, and observables (rxJS) for your Redux middlewares.

Criticisms of Redux are boilerplate required, the fact all data must be orgnaized into one global store, and it does not have affordances for subscribing to subsets of the global state, you must use selectors & then compare the values, which in RxJS is like doing `state$.pipe(map(state => state.user.name), distinctUntilChanged())`. You can actually [build Redux in a few lines of RxJS](https://ngrx.io/). Drawbacks though, would be you're running functions all over your app to essentially do the `distinctUntilChanged` operation, even if your implementation of this is [`react-redux` & memoized `reselect` selectors](https://github.com/reduxjs/reselect), running memoization has a cost & developers can get it wrong, in practice this can have a large cost for larger Redux apps with frequent or large amounts of Redux actions.

With RxJS store, we turned Redux upside down on it's head. Instead of viewing the world as one global state object that needs to be diff'd, we model the world as individual subjects that can be subscribed to. Instead of slicing off of a global state, selecting state "down", in RxJS it is inverted, you would need to combine all of your subjects with the `merge()` or `combineLatest()` operators to create a derived stream that acts like Redux & emits on every change application wide. 

A good metaphor for Redux vs RxJS store is Redux is like receiving a new printed dictionary in the mail with no change log anytime a new word is added to the English language. You must search through the entire new and old dictionary, or at least the table-of-contents or index, and find out what changed. RxJS is like receiving a push notification from the dictionary author's mobile app telling you a new word was added and which word it was. The code running in the app lays dormant and does not do any work or waste any battery power, it is woken up or "pushed" to your phone, and you can turn on/off push notifications for each "app" on your phone if something is firing too often and wasting your battery.

Another key difference is that in Redux, there is an idea of a "global state" object. In RxStore, state lives inside the context of the streams you create.

RxJS and Redux can be used side by side in the same app, using each where it is best suited, drawing the boundaries wherever you find appropriate. You may use Redux middleware to emit onto your RxJS subjects in response to actions and state changes.

## How does this compare to regular React state/hooks?

With React state/hooks, you are able to set state in your component:

```js
this.setState({foo: 123})
```

and render it declaratively in your component:

```js
render() {
    return <div>{this.state.foo}</div>
}
```

You can react to state changes in your lifecycles:

```js
componentDidUpdate(prevProps, prevState) {
    if(prevState.foo !== this.state.foo) {
        // react to change
    }
}
```

You can also react to state changes with hooks:

```js
function component() {
    const [foo, setFoo] = useState(123)
    useEffect(() => {
        // react to change
    }, [foo])
}
```

However this can become unwieldy when you have more complex logic:

```js
function component({ channelID }) {
    const [foo, setFoo] = useState(123)
    useEffect(() => {
        // reacts to changes in either foo or channelID
    }, [foo, channelID])
}
```

Now you may have a bug where you needed `channelID` in your side effect, but it changes too often even though `foo` did not change, and you only want to run the effect when `foo` changes, not when `channelID` changes, you must break the rules of hooks or use a ref:

```js
function component({ channelID }) {
    const prevFoo = useRef()
    const [foo, setFoo] = useState(123)
    useEffect(() => {
        if(foo !== prevFoo) {
            // reacts to changes in foo only
        }
        prevFoo.current = foo
    }, [foo])
}
```

With React, many devs find they are still programming imperatively when they try to model things like async business logic pertaining to state changing & events firing over time. Internally, React evaluates the dependency arrays & checks them one by one to detect if they changed, there is still this idea of check everything to figure out what changed. It is also a leaky abstraction, as the dependency array is not sufficient to inform the hook of what changed, requiring you to use a ref to implement your own change detection. Compare this to subscribing to a stream of changes in RxJS. In RxJS you can subscribe directly to changes, instead of needing to rely on detecting them:

```js
stream$.subscribe(value => console.log(value))
```

Also, with React's reactivity model you're traditionally mapping state changes 1:1 to with component updates. This will change with time slicing and suspense (async react), but you're still opting into their reactivity model, which is great for some apps. However, you may find that for some logic in some apps you want the ability to do something more complex than map a state change to a UI update, for example fetching some data whenever a button is clicked & also every 1s:

With a traditional React app, the producers are aware of the consumers, the producers imperatively "notify the consumer", that is the two `useEffect` hooks, the 2 producers, are aware of & need to call `fetchData()`:

```js
useEffect(() => {
    const i = setInterval(fetchData, 1_000)
    return () => clearInterval(i)
}, [])

useEffect(() => {
    fetchData();
}, [buttonLastClickedTime]) // diffs buttonLastClickedTime every render
```

In React, you could use functions as props, and use them to invert control, allowing the producer (here a parent component) to notify the consumer (via the event listener functions passed down to the component via props):

```js
function component(props) {
    const {addOnClickListender, removeOnClickListender} = props
    const fn = useCallback(() => {
        // react to clicks
    })
    useEffect(() => {
        // add
        addOnClickListener(fn)
        return () => removeOnClickListender(fn)
    }, [fn])
})
```
However may find that now you have a similar issue to the example above where you may need to add refs. For example, if you need to add dependencies to the `useCallback` logic, you'll need to add a depdency array for the `useCallback` hook, which in turn causes the `fn` reference to be changed anytime it's dependencies changes. Now you must decide if you're ok removing & re-adding the event listeners anytime data changes, paying a perfromance cost so you can store your state in the hook's closures, or your other option is to add refs to your code, making it harder to read.

With RxJS, we can pass around immutable streams. The parent could pass down a stream of clicks:


```jsx
function parent() {
    const buttonRef = useRef()
    const click$ = useMemo(() => {
        // creates a stream of click events in RxJS:
        return fromEvent(buttonRef.current, 'click')
    }, [])
    return <>
        <button ref={ref => buttonRef.current = ref} />
        <Child clicks={click$} />
    </>
}
```

In the child we can consume the `clicks` stream that is passed down from the parent:

```jsx
function child({clicks: click$}) {
    // Because click$ is immutable / doesn't change, this runs 1x
    useEffect(() => {
        const subscription = merge(
            interval(1000),
            click$
        ).pipe(
            mergeMap(fetchData),
        ).subscribe() 

        return () => subscription.unsubscribe(); 
    }, [click$])
}
```

In this way the parents component does not need to be aware of or call `fetchData`, nor do we run into kludges with React's limitations. The consumers sit at the bottom of a metaphorical funnel, and at the top of our funnel the parent component is entirely unaware of whatever is happening downstream, it just provides down streams of clicks.




## How does this compare to GQL clients like Apollo / Relay?

These libraries allow your components to declare their data dependencies and manage fetching, subscribing, and caching those data from a GQL backend. They are best suited for CRUD type app(s) where you are creating, reading, updating & deleting records, or are otherwise best suited for "traditional apps". If one tries to, for example, build a distributed counter app using these libraries, you'll find there can be various race conditions and there can be a need to reach for escape hatches and build new abstractions.

On the other hand, RxJS store does not provide easy to use APIs for fetching/storing data from GQL specifically, but you could just as easily call `fetch()` or call into `Apollo`'s `client` subscriptions to expose streams of data to your RxJS store within your effect(s). You could let Apollo handle sending queries/mutations for your distributed counter app. You could also use RxJS to have fine grained control over the complex async parts of your code as far as it affects the timing of the queries/mutations in the distributed counter app, to prevent race conditions by leveraging RxJS' ability to create powerful data flows and it's abstractions for working with events occuring over time as collections.

## How does this compare to mobx?

While mobx uses the observable pattern like RxJS, it is more focused on imperatively mutating state, and then observing those mutations. It does not provide as rich of an ecosystem as RxJS does when it comes to abstracting the dimension of time into declarative operators, and doesn't directly support techniques like using higher order observables to create powerful abstractions, like controlling the concurrency & ordering of side effects over time. 

You can use RxJS store & mobx together, you can subscribe to your RxJS store subjects & update mobx when they emit values, or vice versa.

Mobx is a great alternative to something like Redux if you merely have issues with high frequency events that you want to map 1:1 with your UI, that is you still want to render affected UI elements on every event. It is more effective than Redux in figuring out which UI elements were affected, because mobx uses observables instead of immutability for its reactivity model. However if you are not mappings events to UI 1:1, or you have more complex async logic, the expressive power of RxJS will be a key advantage of using RxStore.


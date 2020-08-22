## Manager

Each store has a manager. A manager is responsible for:

- Providing the [store value](#store-value) to the component(s) below it
- For subscribing to (and unsubscribing from) [effects](#effects)

You may choose to:

- wrap your entire application in a single global store, and use RxJS to manage the lifecycle of your effects.
- have multiple stores scoped to specific subtrees or areas of your application, tying the lifecycle of the effects to the lifecycle of your component tree(s).

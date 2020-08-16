---
id: with-subscription
title: withSubscription()
---

```
const WrappedComponent = withSubscription(MyComponent, store.count$)
```

Your component will be rendered with `next`, `error` & `complete` props:

```jsx
<WrappedComponent
  next={next}
  error={error}
  complete={complete}
></WrappedComponent>
```

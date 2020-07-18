---
id: use-store
title: useStore()
---

A React hook that consumes from the passed Rx Store context,
asserts the store value is present, and returns it.

**Args**:

- `context`: `React.Context`
  - The context returned from the [store() factory](./store) for the store instance you want to use.

## Example

```jsx
import { rootContext } from "./index";
import { useSubscription, useStore } from "@rx-store/react-rx-store";

function Component() {
  const store = useStore(rootContext);

  // do something w/ the store, such as creating a subscription!

  return null;
}
```

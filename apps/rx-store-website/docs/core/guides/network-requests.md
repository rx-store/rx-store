---
id: network-requests
title: Network Requests
---

An effect could for example subscribe to a `request$` subject and for each value emitted it could be mapped to a network request, and the responses emitted onto a `response$` subject.

First, we'll define a helper function which makes the actual request, well use the [fromFetch](https://rxjs-dev.firebaseapp.com/api/fetch/fromFetch) operator, which returns an observable, that when subscribed to performs an HTTP request using the [fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

```ts
const makeRequest = (request) =>
  fromFetch(`http://localhost:8080/users/${request.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    selector: (response) => response.json(),
  });
```

## Concurrent Requests with mergeMap

```ts
export const effect = ({ sources, sinks }) =>
  sources.request$().pipe(
    mergeMap((request) => makeRequest),
    sinks.result$()
  );
```

https://rxjs-dev.firebaseapp.com/api/operators/mergeMap

## Prioritize latest requests with switchMap

```ts
export const effect = ({ sources, sinks }) =>
  sources.request$().pipe(
    switchMap((request) => makeRequest),
    sinks.result$()
  );
```

https://rxjs-dev.firebaseapp.com/api/operators/switchMap

## Complete the requests in order with concatMap

```ts
export const effect = ({ sources, sinks }) =>
  sources.request$().pipe(
    concatMap((request) => makeRequest),
    sinks.result$()
  );
```

https://rxjs-dev.firebaseapp.com/api/operators/concatMap

## Ignore requests when there is already a request in flight with exhaustMap

```ts
export const effect = ({ sources, sinks }) =>
  sources.request$().pipe(
    exhaustMap((request) => makeRequest),
    sinks.result$()
  );
```

https://rxjs-dev.firebaseapp.com/api/operators/exhaustMap

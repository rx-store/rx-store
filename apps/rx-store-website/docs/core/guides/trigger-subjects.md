---
id: trigger-subjects
title: Trigger subjects
---

Trigger [subjects](https://rxjs-dev.firebaseapp.com/guide/subject) are a pattern where subjects are used for emitting an event which triggers something to happen in other part(s) of the app.

For example, in a social network app you may have "trigger" effect, for example a `refetchNewsFeed$` subject, when the user scrolls up a value is emitted on this subject, which triggers an effect to fetch the latest news feed posts & emit them onto a `newsFeedPost$` subject, a stream of the latest news feed posts. Perhaps a value is also emitted onto this trigger subject when a push notification is received from the server.

```ts
const refetchNewsFeed$ = new Subject();
refetchNewsFeed$.next(true); // actual value isn't used / doesn't matter
```

The advantage of this decoupling is that your effects do not need to be aware of all the places they can be triggered. Your "refetch news feed" logic can live in a simple effect that only knows about the trigger subject, and the subject where it emits the results. Later on, if the logic to trigger refetching the news feed becomes quite complex, it will stay naturally decoupled from the logic to actually perform the refetching.

```ts
export const effect = ({ sources, sinks }) =>
  sources.refetchNewsFeed$().pipe(
    mergeMap((request) => makeRequest),
    sinks.newsFeed$()
  );
```

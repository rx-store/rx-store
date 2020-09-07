---
id: command-streams
title: Command Subjects
---

Commands can be represented in your [store value](https://rxjs.dev/guide/subject) by having a subject used for emitting an event which triggers something to happen in other part(s) of the app.

## Example

In a social network app you may have "refetch news feed" effect which emits "commands" (represented by any value) onto a `refetchNewsFeed$` subject.

In this hypothetical social network app, a second effect will responed to the commands emitted on the `refetchNewsFeed$` subject by fetching the latest news feed data, and emitting onto a `newsFeedPost$` subject with the results of the command.

```ts
const refetchNewsFeed$ = new Subject();
refetchNewsFeed$.next(true); // actual value isn't used / doesn't matter
```

## Advantages

The advantage of this decoupling is that your effects do not need to be aware of all the places they can be triggered. Your "refetch news feed" logic can live in a simple effect that only knows about the trigger subject, and the subject where it emits the results. Later on, if the logic to trigger refetching the news feed becomes quite complex, it will stay naturally decoupled from the logic to actually perform the refetching.

```ts
export const effect = ({ sources, sinks }) =>
  sources.refetchNewsFeed$().pipe(
    mergeMap((request) => makeRequest),
    sinks.newsFeed$()
  );
```

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Visualizer } from '@rx-store/visualizer';
import { useSubscription } from '@rx-store/react';
import { filter, tap, bufferWhen } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { StoreEvent, StoreEventType } from '@rx-store/core';

export interface DevtoolsProps {
  observable: Observable<StoreEvent>;
}

export const Devtools = (props: DevtoolsProps) => {
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<[string, string]>(['effect', 'root']);
  const [text, setText] = useState<string>('');

  const frame$ = useRef(new Subject());

  const obs = useMemo(
    () =>
      props.observable.pipe(
        filter((event) => event.type === StoreEventType.value),
        filter(
          (event: any) =>
            (event.to.type === state[0] && event.to.name === state[1]) ||
            (event.from.type === state[0] && event.from.name === state[1])
        ),
        bufferWhen(() => frame$.current),
        tap((events) => {
          const eventsText = events.map(
            (event) =>
              '\n' + `${event.from.type}: ${event.from.name} ${event.value}`
          );
          setText((text: string) => text + eventsText);
        })
      ),
    [props.observable, state]
  );

  useEffect(() => {
    let stop = false;
    const tick = () => {
      window.requestAnimationFrame(() => {
        frame$.current.next(true);
        if (!stop) {
          tick();
        }
      });
    };
    tick();
    return () => {
      stop = true;
    };
  }, []);

  useEffect(() => {
    if (!messagesEnd || !messagesEnd.current) return;
    messagesEnd.current.scrollIntoView();
  }, [text]);

  useSubscription(obs);
  return (
    <div style={{ display: 'flex', height: 1000 }}>
      <Visualizer
        onClick={(type: string, value: string) => {
          setText('');
          setState([type, value]);
        }}
        storeObservable={props.observable}
      />
      <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
        <h1>{JSON.stringify(state)}</h1>
        <pre style={{ overflow: 'auto' }}>
          {text}{' '}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => {
              messagesEnd.current = el;
            }}
          ></div>
        </pre>
      </div>
    </div>
  );
};

export default Devtools;

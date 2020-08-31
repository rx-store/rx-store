import React, { useState, useMemo, useRef, useEffect, RefObject } from 'react';
import { Visualizer } from '@rx-store/visualizer';
import { useSubscription } from '@rx-store/react';
import { filter, tap, bufferWhen } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { StoreEvent, StoreEventType } from '@rx-store/core';
import { isServer } from './is-server';

export interface PanelProps {
  observable: Observable<StoreEvent>;
  style?: {};
  setIsOpen: (isOpen: boolean) => void;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (props, ref) => {
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
                '\n' +
                `${event.from.type}: ${event.from.name} value: ${JSON.stringify(
                  event.value,
                  null,
                  2
                )}`
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

    const [isDragging, setIsDragging] = React.useState(false);

    React[isServer ? 'useEffect' : 'useLayoutEffect'](() => {
      if (isDragging) {
        const run = (e: any) => {
          const containerHeight = window.innerHeight - e.pageY;

          if (containerHeight < 70) {
            props.setIsOpen(false);
          } else {
            // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572
            if (ref && (ref as RefObject<HTMLDivElement>).current) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (ref as RefObject<
                HTMLDivElement
              >)!.current!.style.height = `${containerHeight}px`;
            }
          }
        };
        document.addEventListener('mousemove', run);
        document.addEventListener('mouseup', handleDragEnd);

        return () => {
          document.removeEventListener('mousemove', run);
          document.removeEventListener('mouseup', handleDragEnd);
        };
      }
    }, [isDragging]);

    const handleDragStart = (e: any) => {
      if (e.button !== 0) return; // Only allow left click for drag
      setIsDragging(true);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    return (
      <div style={{ display: 'flex', ...props.style }} ref={ref}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '4px',
            marginBottom: '-4px',
            cursor: 'row-resize',
            zIndex: 100000,
          }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
        ></div>
        <Visualizer
          onClick={(type: string, value: string) => {
            setText('');
            setState([type, value]);
          }}
          storeObservable={props.observable}
        />
        <div
          style={{
            display: 'flex',
            flexBasis: 0,
            flexGrow: 1,
            flexDirection: 'column',
          }}
        >
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
  }
);

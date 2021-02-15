import React, { useState, useMemo, useRef, useEffect, RefObject } from 'react';
import { Visualizer } from '@rx-store/visualizer';
import { useSubscription } from '@rx-store/react';
import { filter, tap, bufferWhen } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { StoreEvent, StoreEventType } from '@rx-store/core';
import { isServer } from './is-server';
import { useTheme } from './theme';
import chroma from 'chroma-js';

const colors = chroma.scale(['#ff0000', '#00ff00']).mode('lch').colors(60);
const colorNamespaces: Record<string, string> = {};

export interface PanelProps {
  observable: Observable<StoreEvent>;
  style?: {};
  setIsOpen: (isOpen: boolean) => void;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (props, ref) => {
    const messagesEnd = useRef<HTMLDivElement | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<[string, string]>([
      'effect',
      'root',
    ]);
    const [events, setEvents] = useState<any[]>([]);

    const frame$ = useRef(new Subject());

    const obs2 = useMemo(
      () =>
        props.observable.pipe(
          tap((event: StoreEvent) => {
            let colorKey = '';
            switch (event.type) {
              case StoreEventType.effect:
                colorKey = `effect-${event.name}`;
                break;
              case StoreEventType.value:
                colorKey = `${event.from.type}-${event.from.name}`;
                break;
              case StoreEventType.subject:
                colorKey = `subject-${event.name}`;
                break;
            }
            if (!colorNamespaces[colorKey]) {
              const index = Math.round(Math.random() * colors.length - 1);
              colorNamespaces[colorKey] = colors[index];

              colors.splice(index, 1);
            }
          })
        ),
      [props.observable]
    );

    const obs = useMemo(
      () =>
        props.observable.pipe(
          filter((event) => event.type === StoreEventType.value),
          filter(
            (event: any) =>
              (event.from.name !== '' &&
                event.to.type === selectedFilter[0] &&
                event.to.name === selectedFilter[1]) ||
              (event.from.type === selectedFilter[0] &&
                event.from.name === selectedFilter[1])
          ),
          bufferWhen(() => frame$.current),
          tap((newEvents) => {
            if (newEvents.length) {
              setEvents((events: any[]) => [...events, ...newEvents]);
            }
          })
        ),
      [props.observable, selectedFilter]
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
    }, [events]);

    useSubscription(obs);
    useSubscription(obs2);

    const theme = useTheme();

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
            setEvents([]);
            setSelectedFilter([type, value]);
          }}
          storeObservable={props.observable}
          theme={theme}
          colorNamespaces={colorNamespaces}
        />
        <div
          style={{
            display: 'flex',
            flexBasis: 0,
            flexGrow: 1,
            flexDirection: 'column',
            color: '#eeeeee',
            backgroundColor: theme.background,
            borderLeft: '1px #eeeeee solid',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <h1
            style={{
              margin: 0,
              color:
                colorNamespaces[`${selectedFilter[0]}-${selectedFilter[1]}`],
            }}
          >
            {selectedFilter[0]}: {selectedFilter[1]}
          </h1>
          <pre style={{ overflow: 'auto' }}>
            {events.map((event: any, index: any) => {
              const colorKey = `${event.from.type}-${event.from.name}`;
              return (
                <div key={index} style={{ color: colorNamespaces[colorKey] }}>
                  {event.from.type}: {event.from.name}:{' '}
                  {JSON.stringify(event.value, null, 2)}
                </div>
              );
            })}
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

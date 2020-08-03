import React, { useEffect, useReducer } from 'react';
import WebCola from 'react-cola';
import { Line } from 'react-lineto';
import { useStore, useSubscription } from '@rx-store/react-rx-store';
import { rootContext } from './Manager';

const Subject = ({ x, y, width, height, name, subject }, i) => {
  //   console.log(subject);

  const [next] = useSubscription(subject);
  return (
    <div
      key={i}
      style={{
        position: 'absolute',
        left: x - width * 0.5,
        top: y - height * 0.5,
        width,
        height,
        backgroundColor: subject === undefined ? 'red' : 'yellow',
        borderRadius: 5,
        border: '1px black solid',
      }}
    >
      {name}: {next}
    </div>
  );
};

export const Visual = () => {
  const store = useStore(rootContext);
  const subjects = Object.entries(store).reduce(
    (acc, [name, subject]) => [
      ...acc,
      { name, width: 160, height: 40, subject },
    ],
    []
  );
  const [_, forceRender] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    const tick = () => {
      requestAnimationFrame(() => {
        forceRender();
        tick();
      });
    };
    tick();
    return () => {
      debugger;
    };
  }, []);
  return (
    <WebCola
      onTick={console.log}
      renderLayout={(layout) => (
        <>
          {layout.groups().map(({ bounds: { x, X, y, Y } }, i) => {
            const width = X - x;
            const height = Y - y;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width,
                  height,
                  backgroundColor: 'orange',
                  borderRadius: 5,
                  zIndex: -2,
                }}
              />
            );
          })}
          {layout.links().map(({ source, target }, i) => {
            const { x, y } = source;
            const { x: x2, y: y2 } = target;
            return (
              <Line
                key={i}
                x0={x}
                y0={y}
                x1={x2}
                y1={y2}
                borderColor="blue"
                zIndex={-1}
              />
            );
          })}
          {layout.nodes().map((props) => (
            <Subject key={props.name} {...props} />
          ))}
        </>
      )}
      nodes={[
        ...subjects,
        // { name: 'b', width: 60, height: 40 },
        // { name: 'c', width: 60, height: 40 },
        // { name: 'd', width: 60, height: 40 },
        // { name: 'e', width: 60, height: 40 },
      ]}
      links={
        [
          // { source: 1, target: 2 },
          // { source: 2, target: 0 },
          // { source: 2, target: 3 },
          // { source: 2, target: 4 },
        ]
      }
      constraints={[
        {
          type: 'alignment',
          axis: 'x',
          offsets: subjects.map((_, i) => ({ node: i, offset: 0 })),
        },
      ]}
      width={540}
      height={760}
    />
  );
};

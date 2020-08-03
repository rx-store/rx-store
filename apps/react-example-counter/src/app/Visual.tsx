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

const Effect = ({ x, y, width, height, name }, i) => {
  return (
    <div
      key={i}
      style={{
        position: 'absolute',
        left: x - width * 0.5,
        top: y - height * 0.5,
        width,
        height,
        backgroundColor: 'red',
        borderRadius: 5,
        border: '1px black solid',
      }}
    >
      {name}
    </div>
  );
};

export const Visual = () => {
  const store = useStore(rootContext);

  // todo useMemo??
  const subjects = Object.entries(store).reduce(
    (acc, [name, subject]) => [
      ...acc,
      { name, width: 160, height: 40, subject },
    ],
    []
  );

  const effects = (window.__devtools_effects || []).map((name) => ({
    name,
    width: 160,
    height: 40,
    effect: true,
  }));

  const [_, forceRender] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    const tick = () => {
      requestAnimationFrame(() => {
        // todo avoid if nothing has changed in the store??
        // console.log(window.__devtools_effects);
        forceRender();
        tick();
      });
    };
    tick();
    return () => {
      alert('unmount');
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
          {layout
            .nodes()
            .map((props) =>
              props.subject ? (
                <Subject key={props.name} {...props} />
              ) : (
                <Effect key={props.name} {...props} />
              )
            )}
        </>
      )}
      nodes={[...subjects, ...effects]}
      links={[
        // { source: 1, target: 2 },
        // { source: 2, target: 0 },
        // { source: 2, target: 3 },
        // { source: 2, target: 4 },
        ...effects.map((effect, i) => ({
          source: i + subjects.length,
          target: 0,
        })),
        ...effects.map((effect, i) => ({
          source: i + subjects.length,
          target: 1,
        })),
        ...effects.map((effect, i) => ({
          source: i + subjects.length,
          target: 2,
        })),
      ]}
      constraints={[
        {
          type: 'alignment',
          axis: 'y',
          offsets: subjects.map((_, i) => ({ node: i, offset: 0 })),
        },
      ]}
      width={540}
      height={760}
    />
  );
};

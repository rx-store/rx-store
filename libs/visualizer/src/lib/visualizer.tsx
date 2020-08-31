import React, { useRef, useEffect, useReducer, useMemo } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { MapControls } from 'drei';
import { Layout } from 'webcola';
import { filter } from 'rxjs/operators';
import { StoreEvent, StoreEventType, StoreEventSubject } from '@rx-store/core';
import { Observable } from 'rxjs';
import { Effect } from '../components/effect';
import { Link } from '../components/link';
import { Subject } from '../components/subject';
import { useBullets } from '../hooks/bullets';
import { Bullet } from '../components/bullet';
import { useEffects } from '../hooks/effects';
import { useLinks } from '../hooks/links';

export interface VisualizerProps {
  onClick: (type: StoreEventType, value: string) => void;
  storeObservable: Observable<StoreEvent>;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  onClick,
  storeObservable,
}) => {
  return (
    <div
      style={{
        height: '100%',
        flexBasis: 0,
        flexGrow: 1,
      }}
    >
      <Canvas
        style={{ background: '#110000' }}
        camera={{ position: [0, 0, 10] }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Layers onClick={onClick} storeObservable={storeObservable} />
        {/* <GroundPlane />
        <BackDrop /> */}
        <MapControls target={[0, 0, 0]} maxDistance={1000} minDistance={50} />
      </Canvas>
    </div>
  );
};

export const Layers: React.FC<VisualizerProps> = ({
  onClick,
  storeObservable,
}) => {
  const [, forceRender] = useReducer((n) => n + 1, 0);
  const { size } = useThree();

  const nodes = useRef<
    {
      name: string;
      width: number;
      height: number;
      subject?: true;
      effect?: true;
    }[]
  >([]);
  const links = useRef([]);

  const layout = useMemo(() => {
    console.log('create layout!', nodes.current);
    return new Layout()
      .nodes(nodes.current)
      .links(links.current)
      .size([size.width, size.height])
      .on('end', forceRender);
  }, []);

  const { bullets } = useBullets(
    storeObservable,
    layout,
    forceRender,
    nodes,
    links
  );

  useEffects(storeObservable, layout, forceRender, nodes, links);

  useEffect(() => {
    storeObservable
      .pipe(
        filter(
          (event): event is StoreEventSubject =>
            event.type === StoreEventType.subject
        )
      )
      .subscribe(({ name }) => {
        nodes.current.push({
          name,
          width: 30,
          height: 5,
          subject: true,
        });
      });
  }, [storeObservable]);

  useLinks(storeObservable, layout, forceRender, nodes, links);

  useEffect(() => {
    layout.stop();
    layout.start(1);
  }, [layout]);

  return (
    <>
      {bullets.current.map((bullet, i) => (
        <Bullet bullet={bullet} key={i} />
      ))}
      {(layout.nodes().map((obj) => ({
        ...obj,
        x: obj.x - size.width / 2,
        y: obj.y - size.height / 2,
      })) as any[]).map((props) =>
        props.subject ? (
          <Subject key={props.name} {...props} onClick={onClick} />
        ) : (
          <Effect key={props.name} {...props} onClick={onClick} />
        )
      )}
      {(layout.links() as any).map(({ source, target }: any, i: number) => {
        const { x, y } = source;
        const { x: x2, y: y2 } = target;

        return (
          <Link
            key={i}
            x0={x - size.width / 2}
            y0={y - size.height / 2}
            x1={x2 - size.width / 2}
            y1={y2 - size.height / 2}
          />
        );
      })}
    </>
  );
};

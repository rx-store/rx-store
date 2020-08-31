import React from 'react';
import { BoxWithText } from './box-with-text';
import { StoreEventType } from '@rx-store/core';
import { VisualizerProps } from '../lib/visualizer';

export interface SubjectProps {
  name: string;
  value: unknown;
  onClick?: (type: StoreEventType, value: string) => void;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  text: string;
  theme: VisualizerProps['theme'];
  colorNamespaces: VisualizerProps['colorNamespaces'];
}

export const Subject: React.FC<SubjectProps> = (props) => (
  <BoxWithText
    {...props}
    text={`${props.name}: ${props.value}`}
    boxColor={props.colorNamespaces[`subject-${props.name}`]}
    onClick={() =>
      props.onClick && props.onClick(StoreEventType.subject, props.name)
    }
  />
);

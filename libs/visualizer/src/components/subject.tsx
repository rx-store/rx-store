import React from 'react';
import { BoxWithText } from './box-with-text';
import { StoreEventType } from '@rx-store/core';

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
}

export const Subject: React.FC<SubjectProps> = (props) => (
  <BoxWithText
    {...props}
    text={`${props.name}: ${JSON.stringify(props.value, null, 2)}`}
    boxColor="red"
    onClick={() =>
      props.onClick && props.onClick(StoreEventType.subject, props.name)
    }
  />
);

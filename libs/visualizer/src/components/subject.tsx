import React from 'react';
import { BoxWithText } from './box-with-text';

export function Subject(props: any) {
  return (
    <BoxWithText
      text={`${props.name}: ${props.value}`}
      {...props}
      boxColor="red"
      onClick={() => props.onClick('subject', props.name)}
    />
  );
}

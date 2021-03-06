import React from 'react';
import { BoxWithText } from './box-with-text';

export function Effect(props: any) {
  return (
    <BoxWithText
      text={props.name}
      {...props}
      boxColor="hotpink"
      onClick={() => props.onClick('effect', props.name)}
    />
  );
}

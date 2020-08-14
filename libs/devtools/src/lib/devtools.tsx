import React from 'react';
import { Visualizer } from '@rx-store/visualizer';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface DevtoolsProps {}

const StyledDevtools = styled.div`
  color: pink;
`;

export const Devtools = (props: DevtoolsProps) => {
  return (
    <Visualizer
      onClick={(...args) => {
        console.log(args);
      }}
      storeObservable={window.__rxstore_devtools_observer}
    />
  );
};

export default Devtools;

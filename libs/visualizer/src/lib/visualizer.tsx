import React from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface VisualizerProps {}

const StyledVisualizer = styled.div`
  color: pink;
`;

export const Visualizer = (props: VisualizerProps) => {
  return (
    <StyledVisualizer>
      <h1>Welcome to visualizer!</h1>
    </StyledVisualizer>
  );
};

export default Visualizer;

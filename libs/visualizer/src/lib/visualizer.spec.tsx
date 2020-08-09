import React from 'react';
import { render } from '@testing-library/react';

import Visualizer from './visualizer';

describe(' Visualizer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Visualizer />);
    expect(baseElement).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import Devtools from './devtools';

describe(' Devtools', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Devtools />);
    expect(baseElement).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import App from '../App';

test('renders witout name ', () => {
  const { getByText } = render(<App />);
  const text = getByText(/Next/i);
  expect(text).toBeInTheDocument();
});


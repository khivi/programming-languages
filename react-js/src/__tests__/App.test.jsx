import React from 'react';
import { render } from '@testing-library/react';

import App from '../App';

test('renders hey ', () => {
  const { getByText } = render(<App />);
  const text = getByText(/hey/i);
  expect(text).toBeInTheDocument();
});

test('renders hey text ', () => {
  const { container } = render(<App />);
  expect(container.firstChild.firstChild).toHaveTextContent(/hey/i);
});

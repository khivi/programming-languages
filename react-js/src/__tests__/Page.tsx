import React from 'react';
import { render } from '@testing-library/react';

import Page from '../Page';

test('renders witout name ', () => {
  const data = [];
  const { getByText } = render(<Page data={data}/>);
  const text = getByText(/Next/i);
  expect(text).toBeInTheDocument();
});


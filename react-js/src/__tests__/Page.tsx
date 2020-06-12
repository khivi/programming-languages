import React from 'react';
import { render } from '@testing-library/react';

import {Page} from '../Page';

test('renders page ', () => {
  const iterables: Iterable<number>[] = [];
  const { getByText } = render(<Page iterables={iterables}/>);
  const text = getByText(/Next/i);
  expect(text).toBeInTheDocument();
});


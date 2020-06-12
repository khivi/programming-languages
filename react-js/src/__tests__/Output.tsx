import React from 'react';

import { render, fireEvent} from '@testing-library/react'

import {Listener} from '../Subscribe';
import {Output} from '../Output';

test('click output ', () => {
  const NUM = 5;
  const onClick = jest.fn();
  const listener: Listener  = {
      next: onClick,
  };
  const listeners = Array(NUM).fill(listener);
  const {getByText} = render(<Output  listeners={listeners} />);
  fireEvent.click(getByText('Next'));
  expect(onClick).toHaveBeenCalledTimes(NUM);
});


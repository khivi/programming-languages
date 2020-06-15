import React from 'react';

import { render, fireEvent} from '@testing-library/react'

import {Output} from '../Output';

import Callback from "./Subscribe";

test('click output ', () => {
  const NUM = 3;
  const onClick = jest.fn();
  const callback = {onClick};
  const callbacks = Array(NUM).fill(callback);
  const {getByText} = render(<Output  callbacks={callbacks} />);
  fireEvent.click(getByText('Next'));
  expect(onClick).toHaveBeenCalledTimes(NUM);
});


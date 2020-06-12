import React from 'react';

import { render, fireEvent} from '@testing-library/react'

import {Output} from '../Output';

test('click output ', () => {
  const NUM = 5;
  //const onClick = jest.fn();
  //const listener: Listener  = {
      //next: onClick,
  //};
  const iterables = Array(NUM).fill([1,2,3]);
  const {getByText} = render(<Output  iterables={iterables} />);
  fireEvent.click(getByText('Next'));
  //expect(onClick).toHaveBeenCalledTimes(NUM);
});


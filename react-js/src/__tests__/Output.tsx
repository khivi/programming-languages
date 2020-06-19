import React from 'react';

import { render, fireEvent} from '@testing-library/react'

import {Output} from '../Output';


test('click output ', () => {
  expect.assertions(1);
  const NUM = 3;
  const next = jest.fn();
  const nexts = Array(NUM).fill(next);
  const {getByText} = render(<Output nexts={nexts} />);
  fireEvent.click(getByText('Next'));
  expect(next).toHaveBeenCalledTimes(NUM);
});


test('min output ', () => {
  expect.assertions(7);
  const data = [ [1], [1, 2] , [2, 3]];
  const nexts = data.map((arr) =>  {
      const iterator = arr[Symbol.iterator]();
      return (): IteratorResult<number> => iterator.next();
  });

  const {getByText, getByRole, queryByRole} = render(<Output nexts={nexts} />);
  const next = (): void => {
    const button = getByText('Next');
    fireEvent.click(button);
  };
  const check = (n: number): void => {
      expect(getByRole('min')).toHaveTextContent(n);
  };
  const nocheck = (): void => {
      expect(queryByRole('min')).not.toBeInTheDocument();
  };
  next(); check(1);
  next(); check(1);
  next(); check(2);
  next(); check(2);
  next(); check(3);
  next(); nocheck();
  next(); nocheck();
});


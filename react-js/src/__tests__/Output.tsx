import React from 'react';

import { render, fireEvent} from '@testing-library/react'

import {Output} from '../Output';


test('click output ', () => {
  expect.assertions(1);
  const NUM = 3;
  const onNext = jest.fn();
  const onNexts = Array(NUM).fill(onNext);
  const {getByText} = render(<Output onNexts={onNexts} />);
  fireEvent.click(getByText('Next'));
  expect(onNext).toHaveBeenCalledTimes(NUM);
});


test('min output ', () => {
  expect.assertions(7);
  const data = [ [1], [1, 2] , [2, 3]];
  const onNexts = data.map((arr) =>  {
      const iterator = arr[Symbol.iterator]();
      return (): IteratorResult<number> => iterator.next();
  });

  const {getByText, getByRole, queryByRole} = render(<Output onNexts={onNexts} />);
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


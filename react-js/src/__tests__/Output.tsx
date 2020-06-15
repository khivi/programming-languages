import React from 'react';

import { render, fireEvent} from '@testing-library/react'
import { act } from "react-dom/test-utils";

import {Output} from '../Output';

import {OnClick} from '../Subscribe';

test('click output ', () => {
  const NUM = 3;
  const onClick = jest.fn();
  const callbacks = Array(NUM).fill(onClick);
  const {getByText} = render(<Output  callbacks={callbacks} />);
  fireEvent.click(getByText('Next'));
  expect(onClick).toHaveBeenCalledTimes(NUM);
});

const onClick =  function(data: Generator<number>): OnClick {
  const gen = data();
  return (): number|undefined => {
     const next = gen.next();
     if (next.done) {
         return undefined;
     }
     return next.value;
 }
};

test('min output ', () => {
  const data = [
    function*(): Generator<number> {
        yield 1;
    },
    function*(): Generator<number> {
      yield 1;
      yield 2;
    },
     function*(): Generator<number> {
      yield 2;
      yield 3;
    }];

  const callbacks = data.map((d) => onClick(d));
  const {getByText, getByRole, queryByRole} = render(<Output  callbacks={callbacks} />);
  const next = (): void => {
      act(() => {
        fireEvent.click(getByText('Next'));
      });
  };
  const check = (n: number): void => {
      next();
      expect(getByRole('min')).toHaveTextContent(n);
  };
  const nocheck = (): void => {
      next();
      expect(queryByRole('min')).toBe(null);
  };
  check(1);
  check(1);
  check(2);
  check(2);
  check(3);
  nocheck();
  nocheck();
});


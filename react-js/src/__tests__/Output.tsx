import React from 'react';

import { render, fireEvent} from '@testing-library/react'
import { act } from "react-dom/test-utils";

import {Output} from '../Output';

import {OnClick} from '../Subscribe';

test('click output ', () => {
  expect.assertions(1);
  const NUM = 3;
  const onClick = jest.fn();
  const callbacks = Array(NUM).fill(onClick);
  const {getByText} = render(<Output  callbacks={callbacks} />);
  fireEvent.click(getByText('Next'));
  expect(onClick).toHaveBeenCalledTimes(NUM);
});

const onClick =  function(gen: Generator<number>): OnClick {
  const g = gen();
  return (): number|undefined => {
     const next = g.next();
     if (next.done) {
         return undefined;
     }
     return next.value;
 }
};

const arrToGen: Generator<number> = function (arr: number[]) {
    const gen = function*(): number[] { 
        for (const a of arr) {
            yield a;
        }
        return;
    }
    return gen;
}

test('min output ', () => {
  expect.assertions(7);
  const data = [ [1], [1, 2] , [2, 3]];
  const callbacks = data.map((arr) => arrToGen(arr)).
                        map((gen) => onClick(gen));

  const {getByText, getByRole, queryByRole} = render(<Output  callbacks={callbacks} />);
  const button = getByText('Next');
  const next = (): void => {
      act(() => {
        fireEvent.click(button);
      });
  };
  const check = (n: number): void => {
      next();
      expect(getByRole('min')).toHaveTextContent(n);
  };
  const nocheck = (): void => {
      next();
      expect(queryByRole('min')).toBeNull();
  };
  check(1);
  check(1);
  check(2);
  check(2);
  check(3);
  nocheck();
  nocheck();
});


import React from 'react';
import { render, act } from '@testing-library/react'

import {Next, Subscribe, Unsubscribe} from "../Subscribe";

import {File} from '../File';


it("file next ", () => { 
  expect.assertions(6);
  const iterable: Iterable<number> = [1,2,3];
  let next: Next|undefined;
  const subscribe: Subscribe = (i, n) => {
      next = n;
  }
  const unsubscribe: Unsubscribe = (i, n) => {
      if (n === next) { 
        next = undefined;
      }
  }
  const {container} =  render(<File index={1} iterable={iterable} subscribe={subscribe} unsubscribe={unsubscribe} />);
  const check = (s: string): void => {
    expect(container.textContent).toBe(s);
  };
  const doNext = (): void => {
    act(() => {
        if (next !== undefined) {
            next();
        }
    });
  };
  check("file1");
  doNext();
  check("file1 1");
  doNext();
  check("file1 2");
  doNext();
  check("file1 3");
  doNext();
  check("file1");
  doNext();
  check("file1");
});


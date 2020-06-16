import React from 'react';
import { render, act } from '@testing-library/react'

import {Subscribe, Unsubscribe} from "../Subscribe";

import {File} from '../File';


it("file next ", () => { 
  expect.assertions(6);
  const iterable: Iterable<number> = [1,2,3];
  let iterator: Iterator<number>|undefined;
  const subscribe: Subscribe = (i, c) => {
      iterator = c;
  }
  const unsubscribe: Unsubscribe = (i, c) => {
      if (c === iterator) { 
        iterator = undefined;
      }
  }
  const {container} =  render(<File index={1} iterable={iterable} subscribe={subscribe} unsubscribe={unsubscribe} />);
  const check = (s: string): void => {
    expect(container.textContent).toBe(s);
  };
  const next = (): void => {
    act(() => {
        if (iterator !== undefined) {
            iterator.next();
        }
    });
  };
  check("file1");
  next();
  check("file1 1");
  next();
  check("file1 2");
  next();
  check("file1 3");
  next();
  check("file1");
  next();
  check("file1");
});


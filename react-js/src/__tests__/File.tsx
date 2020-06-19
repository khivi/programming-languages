import React from 'react';
import { waitFor } from '@testing-library/dom';
import { render, act } from '@testing-library/react'

import 'babel-polyfill' 
import {Next, Subscribe, Unsubscribe} from "../Subscribe";

import {File} from '../File';

import API from '../api';
jest.mock('../api');

beforeEach(() => {
  API.get.mockReset();
});


it("file next ", async () => { 
  expect.assertions(7);
  API.get.mockResolvedValue({ data: [1,2,3]  });
  let next: Next|undefined;
  const subscribe: Subscribe = (i, n) => {
      next = n;
  }
  const unsubscribe: Unsubscribe = (i, n) => {
      if (n === next) { 
        next = undefined;
      }
  }
  const {container} =  render(<File index={1} subscribe={subscribe} unsubscribe={unsubscribe} />);
  await waitFor(() => expect(API.get).toHaveBeenCalledTimes(1));

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


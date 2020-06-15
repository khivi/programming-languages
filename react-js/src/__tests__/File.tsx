import React from 'react';
import { act } from "react-dom/test-utils";
import { render } from '@testing-library/react'

import {Callback, Subscribe, Unsubscribe} from "./Subscribe";

import {File} from '../File';


it("file next ", () => { 
  const iterable: Iterable<number> = [1,2,3];
  let callback: Callback;
  const subscribe: Subscribe = (i, c) => {
      callback = c;
  }
  const unsubscribe: Unsubscribe = (i, c) => {
      if (c === callback) { 
        callback = null;
      }
  }
  const {container} =  render(<File index={1} iterable={iterable} subscribe={subscribe} unsubscribe={unsubscribe} />);
  expect(container.textContent).toBe("file1");
  act(() => {
    callback.onClick();
  });
  expect(container.textContent).toBe("file1 1");
  act(() => {
    callback.onClick();
  });
  expect(container.textContent).toBe("file1 2");
  act(() => {
    callback.onClick();
  });
  expect(container.textContent).toBe("file1 3");
  act(() => {
    callback.onClick();
  });
  expect(container.textContent).toBe("file1");
});


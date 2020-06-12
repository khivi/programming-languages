import React from 'react';
//import { act } from "react-dom/test-utils";
import { render } from '@testing-library/react'


import {File} from '../File';


it("file next ", () => { 
  const iterable: Iterable<number> = [1,2,3];
  const {container} =  render(<File index={1} iterable={iterable} />);
  expect(container.textContent).toBe("file1 1 2 3");
});


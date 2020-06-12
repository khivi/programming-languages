import React from 'react';
import { act } from "react-dom/test-utils";
import { render } from '@testing-library/react'


import {File} from '../File';
import {Listener} from '../Subscribe';


it("file next ", () => { 
  let listener: Listener;
  const subscribe = (l: Listener): void => {
      listener = l;
  };
  const {container} =  render(<File data={[1,2,3]} name={"foo"} subscribe={subscribe} />);
  expect(container.textContent).toBe("foo 3 2 1");
  act(() => {   
      listener.next();
  });  
  expect(container.textContent).toBe("foo 3 2");
  act(() => {   
      listener.next();
      listener.next();
      listener.next();
      listener.next();
      listener.next();
  });  
  expect(container.textContent).toBe("foo");
});


import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import {File} from '../File';
import {Listener} from '../Subscribe';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


it("file next ", () => { 
  let listener: Listener;
  const subscribe = (l: Listener): void => {
      listener = l;
  };
  act(() => {    
	render(<File data={[1,2,3]} name={"foo"} subscribe={subscribe} />, container);
  });  
  expect(container.textContent).toBe("foo 3 2 1");
  act(() => {   
      listener.next();
  });  
  expect(container.textContent).toBe("foo 3 2");
});

it("file end ", () => { 
  let listener: Listener;
  const subscribe = (l: Listener): void => {
      listener = l;
  };
  act(() => {    
	render(<File data={[1,2,3]} name={"foo"} subscribe={subscribe} />, container);
  });  
  expect(container.textContent).toBe("foo 3 2 1");
  act(() => {   
      listener.next();
      listener.next();
      listener.next();
      listener.next();
      listener.next();
  });  
  expect(container.textContent).toBe("foo");
});

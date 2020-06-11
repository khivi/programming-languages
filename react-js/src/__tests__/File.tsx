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


it("renders file ", () => {
  const subscribe = (l: Listener): void => {
  };
  act(() => {    
	render(<File data={[1,2,3]} name={"foo"} subscribe={subscribe} />, container);
  });  
  expect(container.textContent).toBe("foo 3 2 1");
});

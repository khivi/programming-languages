import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from "react-dom/test-utils";

import {Page} from '../Page';

test('renders page ', () => {
  expect.assertions(1);
  const iterables: Iterable<number>[] = [];
  const { getByText } = render(<Page iterables={iterables}/>);
  const text = getByText(/Next/i);
  expect(text).toBeInTheDocument();
});

test('next page ', () => {
  expect.assertions(34);
  const iterables: Iterable<number>[] = [ [1,2,3], [2,3], [3,4]];
  const { getByText, getByRole, queryByRole, queryAllByRole } = render(<Page iterables={iterables}/>);
  const button = getByText('Next');
  const next = (): void => {
      act(() => {
        fireEvent.click(button);
      });
  };
  const check = (min: number, files: number[]): void => {
      next();
      const minNode = getByRole('min');
      expect(minNode).toHaveTextContent(min);
      const fileNodes = queryAllByRole('file');
      expect(fileNodes.length).toBe(files.length);
      files.forEach((v, i) => {
        expect(fileNodes[i]).toHaveTextContent(v);
      });
  };
  const nocheck = (): void => {
      next();
      expect(queryByRole('min')).toBeNull();
      const fileNodes = queryAllByRole('file');
      expect(fileNodes.length).toBe(0);
  };
  check(1, [1,2,3]);
  check(2, [2,2,3]);
  check(2, [3,2,3]);
  check(3, [3,3,3]);
  check(3, [3,3]);
  check(3, [3]);
  check(4, [4]);
  nocheck();
  nocheck();
});


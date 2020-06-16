import React from 'react';
import { render, fireEvent } from '@testing-library/react';

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
  const next = (): void => {
    const button = getByText('Next');
    fireEvent.click(button);
  };
  const check = (min: number, files: number[]): void => {
      const minNode = getByRole('min');
      expect(minNode).toHaveTextContent(min);
      const fileNodes = queryAllByRole('file');
      expect(fileNodes).toBeArrayOfSize(files.length);
      files.forEach((v, i) => {
        expect(fileNodes[i]).toHaveTextContent(v);
      });
  };
  const nocheck = (): void => {
      expect(queryByRole('min')).toBeNull();
      const fileNodes = queryAllByRole('file');
      expect(fileNodes.length).toBe(0);
  };
  next(); check(1, [1,2,3]);
  next(); check(2, [2,2,3]);
  next(); check(2, [3,2,3]);
  next(); check(3, [3,3,3]);
  next(); check(3, [3,3]);
  next(); check(3, [3]);
  next(); check(4, [4]);
  next(); nocheck();
  next(); nocheck();
});


import React from 'react';
import { waitFor } from '@testing-library/dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import 'babel-polyfill' 

import {Page} from '../Page';

import API from '../api';
jest.mock('../api');

beforeEach(() => {
  API.get.mockReset();
});

test('renders page ', () => {
  expect.assertions(3);
  API.get.mockResolvedValue({ data: 0  });
  const { getByText } = render(<Page/>);
  const text = getByText(/Next/i);
  expect(API.get).toHaveBeenCalledTimes(1);
  expect(API.get).toHaveBeenCalledWith('/count');
  expect(text).toBeInTheDocument();
});

test('next page ', async () => {
  const apiData = [[1,2,3], [2,3], [3,4]];
  
  type DataType = number | number[]
  type ValueType = { data: DataType}
  type UrlsType = { [r: string]: ValueType };
  const urls = (function (apiData): UrlsType {
    const ret: UrlsType  = {};
    const url = (k: string, d: DataType): void => { 
        ret[k] = {data: d};
    };
    url('/count', apiData.length);
    for (let i=0; i<apiData.length; i++) {
        url(`/file/${i}`, apiData[i]);
    }
    return ret;
  })(apiData);

  API.get.mockImplementation((url: string): Promise<ValueType> => {
      return Promise.resolve(urls[url]);
  });

  const {getByText, getByRole, queryByRole, queryAllByRole} = render(<Page/>);
  await waitFor(() => expect(API.get).toHaveBeenCalledTimes(4));

  const next = (): void => {
    const button = getByText('Next');
    fireEvent.click(button);
  };
  const check = (min: number, files: number[]): void => {
      try {
          const minNode = getByRole('min');
          expect(minNode).toHaveTextContent(min);
          const fileNodes = queryAllByRole('file');
          expect(fileNodes).toBeArrayOfSize(files.length);
          files.forEach((v, i) => {
            expect(fileNodes[i]).toHaveTextContent(v);
          });
      } catch (error) {
         Error.captureStackTrace(error, check);
         throw error;
      }
  };
  const nocheck = (): void => {
      try {
          expect(queryByRole('min')).toBeNull();
          const fileNodes = queryAllByRole('file');
          expect(fileNodes).toBeArrayOfSize(0);
      } catch (error) {
         Error.captureStackTrace(error, nocheck);
         throw error;
      }
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


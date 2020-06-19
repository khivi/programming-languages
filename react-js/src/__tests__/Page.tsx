import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

test('next page ', () => {
  //expect.assertions(34);
  
  type DataType = number | number[]
  type UrlsType = { [r: string]: Promise<DataType> };
  const urls = (function (): UrlsType {
    const apiData = [[1,2,3], [2,3], [3,4]];
    return (function (): UrlsType {
        const routes = (function(): { [r: string]: DataType } { 
            const ret: { [r: string]: DataType } = {};
            ret['/count'] = apiData.length;
            for (let i=0; i<apiData.length; i++) {
                ret[`/file/${i}`] = apiData[i];
            }
            return ret;
        })();
        const ret: UrlsType = {}
        for (const k of Object.keys(routes)) {
            ret[k] = Promise.resolve({data: routes[k]});
        }
        return ret;
    })();
  })();
  API.get.mockImplementation((url: string): Promise<DataType> => {
      return urls[url];
  });

  const { getByText, getByRole, queryByRole, queryAllByRole } = render(<Page/>);
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


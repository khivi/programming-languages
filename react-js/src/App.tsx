import React from 'react';
import {File} from './File';
import {useSubscriber} from './Subscribe';


import Page from '../Page';

const App: React.FC<void> = () =>   {
  const data = [
      [1,3,4],
      [2,4,5],
      [8,9,11]
  ];
  return  <Page data={data}/>;

}

export default App;

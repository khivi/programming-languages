import React from 'react';

import {Page} from './Page';

const App: React.FC<void> = () =>   {
  const data: Iterable<number>[] = [
      [1],
      [2],
      [1,2,3]
  ];
  return  <Page iterables={data}/>;

}

export default App;

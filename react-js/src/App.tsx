import React from 'react';
import {File} from './File';
import {useSubscriber} from './Subscribe';



const App: React.FC<void> = () =>   {
  const {listeners, subscribe} = useSubscriber();

  const next = (): void => {
    for (const listener of listeners) {
        listener.next();
    }
  }

  const data = [
      [1,3,4],
      [2,4,5]
  ];

  const files = data.map((row, index) => {
      return <File key={index} name={`file${index}`} data={row} subscribe={subscribe}/>;
  });

  return (
    <div className="App">
      {[...files]}
      <button onClick={next}>Next</button>
    </div>
  );
}

export default App;

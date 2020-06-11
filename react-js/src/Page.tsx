import React from 'react';
import {File} from './File';
import {useSubscriber} from './Subscribe';



const Page: React.FC<void> = ({data}) =>   {
  const {listeners, subscribe} = useSubscriber();

  const next = (): void => {
    for (const listener of listeners) {
        listener.next();
    }
  }

  const files = data.map((row, index) => {
      const name = `file${index}`
      return <File key={index} name={name} data={row} subscribe={subscribe}/>;
  });

  return (
    <div className="App">
      {[...files]}
      <button onClick={next}>Next</button>
    </div>
  );
}

export default Page;

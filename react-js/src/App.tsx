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

  return (
    <div className="App">
      <File name="file1" data={[1,3,4]} subscribe={subscribe}/>
      <File name="file2" data={[2,4,5]} subscribe={subscribe}/>
      <button onClick={next}>Next</button>
    </div>
  );
}

export default App;

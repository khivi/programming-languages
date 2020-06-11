import React from 'react';
import {Data} from './Hello';

const App: React.FC<void> = () =>   {
  const next = (): void => {
    // eslint-disable-next-line
  }
  return (
    <div className="App">
      <Data name="file1" data={[1,3,4]}/>
      <Data name="file2" data={[2,4,5]}/>
      <button onClick={next}>Next</button>
    </div>
  );
}

export default App;

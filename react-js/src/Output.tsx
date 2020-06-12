import React from 'react';

import {Listener} from './Subscribe';


interface OutputProps {
    listeners: Listener[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) =>   {

  const next = (): void => {
    for (const listener of props.listeners) {
        listener.next();
    }
  }

  return <button onClick={next}>Next</button>;
}


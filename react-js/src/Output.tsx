import React from 'react';

import Callback from "./Subscribe";

interface OutputProps {
    callbacks: Callback[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) =>   {

  const next = (): void => {
    for (const c of props.callbacks) {
        const i = c.onClick();
        console.log(i);
    }
  }

  return <button onClick={next}>Next</button>;
}


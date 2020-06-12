import React from 'react';


interface OutputProps {
    iterables: Iterable<number>[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) =>   {

  const next = (): void => {
    for (const iterable of props.iterables) {
        //const iterator = iterable[Symbol.iterator]();
        //const i = iterator.next().value;
        for (const i of iterable) {
            console.log(i);
        }
    }
  }

  return <button onClick={next}>Next</button>;
}


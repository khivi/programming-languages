import React, {useState, useCallback} from 'react';

import {Callback} from "./Subscribe";

interface OutputProps {
    callbacks: Callback[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) => {

  const callbacks = props.callbacks;
  const values = useState<(number|undefined)[]>([])[0];
  const [min, setMin] = useState<(number|undefined)>();

  const next = useCallback((): void => {
    callbacks.forEach((callback, i) => {
        if (values[i] === undefined) {
            values[i] = callback.onClick();
        }
    });
    let minIdx: number|undefined = undefined;
    values.forEach((v, i) => {
        if (v !== undefined) {
            if (minIdx == undefined) {
                minIdx = i;
            }
            else {
                const min = values[minIdx];
                if (min !== undefined && min > v) { 
                    minIdx = i;
                }
            }
        }
    });
    let min  = undefined;
    if (minIdx !== undefined) {
        min = values[minIdx];
        values[minIdx] = undefined;
    }
    setMin(min)
  }, [callbacks, values, setMin]);


  return <div className="Page">
    <h1>Output </h1>
    {min && <div className="min">{min}</div>}
    <button onClick={next}>Next</button>
    </div>;
  
}


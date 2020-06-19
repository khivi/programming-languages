import React, {useState, useCallback} from 'react';

import {Next} from "./Subscribe";

interface OutputProps {
    nexts: Next[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) => {

  const nexts = props.nexts;
  const values = useState<IteratorResult<number>[]>([])[0];
  const [min, setMin] = useState<IteratorResult<number>>();

  const next = useCallback((): void => {

    for (let i = 0; i < nexts.length; i++) {
        const v = values[i];
        const next = nexts[i];
        if (v && v.done) {
            continue;
        }
        if (v && v.value !== undefined) {
            continue;
        }
        values[i] = next();
    }

    let min: IteratorResult<number>|undefined;
    for (const v of values) {
        if (v === undefined || v.done) {
            continue;
        }
        if (min === undefined) {
            min = v;
        } else if (min.value > v.value) {
            min = v;
        }
    }
     
    if (min !== undefined) {
        const copyMin = {...min}
        min.value = undefined;
        min = copyMin
    }
    setMin(min);
  }, [nexts, values, setMin]);


  return <div>
    <h1>Output </h1>
    {min && !min.done && <div role="min">{min.value}</div>}
    <button onClick={next}>Next</button>
    </div>;
  
}


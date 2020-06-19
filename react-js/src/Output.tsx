import React, {useState, useCallback} from 'react';

import {OnNext} from "./Subscribe";

interface OutputProps {
    onNexts: OnNext[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) => {

  const onNexts = props.onNexts;
  const values = useState<IteratorResult<number>[]>([])[0];
  const [min, setMin] = useState<IteratorResult<number>>();

  const onNext = useCallback((): void => {

    for (let i = 0; i < onNexts.length; i++) {
        const v = values[i];
        const onNext = onNexts[i];
        if (v && v.done) {
            continue;
        }
        if (v && v.value !== undefined) {
            continue;
        }
        values[i] = onNext();
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
  }, [onNexts, values, setMin]);


  return <div>
    <h1>Output </h1>
    {min && !min.done && <div role="min">{min.value}</div>}
    <button onClick={onNext}>Next</button>
    </div>;
  
}


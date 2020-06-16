import React, {useState, useCallback} from 'react';

interface OutputProps {
    iterators: Iterator<number>[];
}


export const Output: React.FC<OutputProps> = (props: OutputProps) => {

  const iterators = props.iterators;
  const values = useState<IteratorResult<number>[]>([])[0];
  const [min, setMin] = useState<IteratorResult<number>>();

  const next = useCallback((): void => {

    for (let i = 0; i < iterators.length; i++) {
        const v = values[i];
        const iterator = iterators[i];
        if (v && v.done) {
            continue;
        }
        if (v && v.value !== undefined) {
            continue;
        }
        values[i] = iterator.next();
    }

    let minIdx: number|undefined;
    for (let i = 0; i < iterators.length; i++) {
        const v = values[i];
        if (v === undefined || v.done) {
            continue;
        }
        if (minIdx === undefined) {
            minIdx = i;
        } else {
            const min = values[minIdx];
            if (min !== undefined && min.value > v.value) { 
                minIdx = i;
            }
        }
    }
     
    let min = undefined;
    if (minIdx !== undefined) {
        min = {...values[minIdx]};
        values[minIdx].value = undefined;
    }
    setMin(min);
  }, [iterators, values, setMin]);


  return <div className="Page">
    <h1>Output </h1>
    {min && !min.done && <div role="min">{min.value}</div>}
    <button onClick={next}>Next</button>
    </div>;
  
}


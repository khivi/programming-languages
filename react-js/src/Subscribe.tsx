
import {useState,useCallback} from 'react';

export type Subscribe = (i: number, iterator: Iterator<number>) => void
export type Unsubscribe = (i: number, iterator: Iterator<number>) => void

interface Result {
    iterators: Iterator<number>[];
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}



export const useSubscriber = (): Result   => {
    const iterators = useState<Iterator<number>[]>([])[0];

    const subscribe: Subscribe = useCallback((i, l) => { 
        iterators[i] = l;
    } ,[iterators]);

    const unsubscribe: Unsubscribe = useCallback((i, l) => { 
        if (iterators[i] === l) { 
            delete iterators[i];
        }
    } ,[iterators]);

    return {iterators, subscribe, unsubscribe };
}


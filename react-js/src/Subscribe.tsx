
import {useState,useCallback} from 'react';

export type Next = () => IteratorResult<number>;
export type Subscribe = (i: number, next: Next) => void;
export type Unsubscribe = (i: number, next: Next) => void;

interface Result {
    nexts: Next[];
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}



export const useSubscriber = (): Result   => {
    const nexts = useState<Next[]>([])[0];

    const subscribe: Subscribe = useCallback((i, l) => { 
        nexts[i] = l;
    } ,[nexts]);

    const unsubscribe: Unsubscribe = useCallback((i, l) => { 
        if (nexts[i] === l) { 
            delete nexts[i];
        }
    } ,[nexts]);

    return {nexts, subscribe, unsubscribe };
}


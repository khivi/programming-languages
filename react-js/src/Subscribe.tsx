
import {useState,useCallback} from 'react';

export type OnNext = () => IteratorResult<number>;
export type Subscribe = (i: number, onNext: OnNext) => void;
export type Unsubscribe = (i: number, onNext: OnNext) => void;

interface Result {
    onNexts: OnNext[];
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}



export const useSubscriber = (): Result   => {
    const onNexts = useState<OnNext[]>([])[0];

    const subscribe: Subscribe = useCallback((i, l) => { 
        onNexts[i] = l;
    } ,[onNexts]);

    const unsubscribe: Unsubscribe = useCallback((i, l) => { 
        if (onNexts[i] === l) { 
            delete onNexts[i];
        }
    } ,[onNexts]);

    return {onNexts, subscribe, unsubscribe };
}


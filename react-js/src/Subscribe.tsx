
import {useState,useCallback} from 'react';

export type OnClick = () => number|undefined;
export type Subscribe = (i: number, callback: OnClick) => void
export type Unsubscribe = (i: number, callback: OnClick) => void

interface Result {
    callbacks: OnClick[];
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}



export const useSubscriber = (): Result   => {
    const callbacks = useState<OnClick[]>([])[0];

    const subscribe: Subscribe = useCallback((i, l) => { 
        callbacks[i] = l;
    } ,[callbacks]);

    const unsubscribe: Unsubscribe = useCallback((i, l) => { 
        if (callbacks[i] === l) { 
            delete callbacks[i];
        }
    } ,[callbacks]);

    return {callbacks, subscribe, unsubscribe };
}



import {useState,useCallback} from 'react';

export interface Callback {
    onClick(): number|undefined;
}

export type Subscribe = (i: number, callback: Callback) => void
export type Unsubscribe = (i: number, callback: Callback) => void

interface Result {
    callbacks: Callback[];
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}



export const useSubscriber = (): Result   => {
    const callbacks = useState<Callback[]>([])[0];

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


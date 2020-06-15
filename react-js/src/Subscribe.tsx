
import {useState,useCallback} from 'react';

export interface Callback {
    onClick(): number|undefined;
}

interface Result {
    callbacks: Callback[];
    subscribe(i: number, callback: Callback): void;
    unsubscribe(i: number, callback: Callback): void;
}



export const useSubscriber = (): Result   => {
    const callbacks = useState<Callback[]>([])[0];

    const subscribe = useCallback((i: number, l: Callback) => { 
        callbacks[i] = l;
    } ,[callbacks]);

    const unsubscribe = useCallback((i: number, l: Callback) => { 
        if (callbacks[i] === l) { 
            delete callbacks[i];
        }
    } ,[callbacks]);

    return {callbacks, subscribe, unsubscribe };
}


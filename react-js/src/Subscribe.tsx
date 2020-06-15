
import {useState,useCallback} from 'react';

export interface Callback {
    onClick(): number|undefined;
}

interface Result {
    callbacks: Callback[];
    subscribe(callback: Callback): void;
    unsubscribe(callback: Callback): void;
}


function remove(v: Callback[], l: Callback): Callback[] {
    const index = v.indexOf(l);
    return v.slice(0,index).concat(v.slice(index+1));
}

function add(v: Callback[], l: Callback): Callback[] {
    return [...v, l];
}


export const useSubscriber = (): Result   => {
    const [callbacks, setCallbacks] = useState<Callback[]>([]);

    const subscribe = useCallback((l: Callback) => { 
         setCallbacks((v) => add(v,l));
    } ,[setCallbacks]);

    const unsubscribe = useCallback((l: Callback) => { 
        setCallbacks((v) => remove(v,l));
    } ,[setCallbacks]);

    return {callbacks, subscribe, unsubscribe };
}


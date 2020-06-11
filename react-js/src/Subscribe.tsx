import {useState,useCallback} from 'react';

export interface Listener {
    next(): void;
}

export const useSubscriber = (): {listeners: Listener[]; subscribe: (l: Listener) => void}  => {
    const [listeners, setListeners] = useState<Listener[]>([]);

    const subscribe = useCallback(
        (l: Listener): void => setListeners((v) => [...v, l])
        ,[]
    );

    return {listeners, subscribe };
}


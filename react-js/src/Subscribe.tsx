import {useState,useCallback} from 'react';

export const useSubscriber = (): {iterables: Iterable<number>[]; subscribe: (l: Iterable<number>) => void}  => {
    const [iterables, setIterables] = useState<Iterable<number>[]>([]);

    const subscribe = useCallback(
         (l: Iterable<number>): void => setIterables((v) => [...v, l])
        ,[]
    );

    return {iterables, subscribe };
}


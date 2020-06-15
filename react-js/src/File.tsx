import React, {useMemo, useState, useCallback, useEffect} from "react";

import {Callback} from "./Subscribe";

interface FileProps {
    index: number;
    iterable: Iterable<number>;
    subscribe(callback: Callback): void;
    unsubscribe(callback: Callback): void;
}


export const File: React.FC<FileProps> = (props: FileProps) => {
    const index = props.index;
    const iterable = props.iterable;
    const subscribe = props.subscribe;
    const unsubscribe = props.unsubscribe;

    const iterator: Iterator = useMemo(() => {
        return iterable[Symbol.iterator]();
    }, [iterable]);

    const next = useCallback(() => {
        return iterator.next().value;
    }, [iterator]);
    const [current, setCurrent] = useState<number|undefined>(undefined);

    const onClick = useCallback((): number|undefined =>  {
        const current = next();
        setCurrent(current);
        return current;
    }, [next, setCurrent]);

    useEffect(() =>  {
        const callback = {onClick}
        subscribe(callback);
        return function cleanup(): void {
            unsubscribe(callback);
        }
    }, [subscribe, unsubscribe, onClick]);

    const name = `file${index}`;
    return <div>
        <h1>
            {name}
        </h1>
        {current &&  <ul><li> {current}</li></ul>}
        </div>;
}




import React, {useMemo, useState, useEffect} from "react";

import {Subscribe, Unsubscribe} from "./Subscribe";

interface FileProps {
    index: number;
    iterable: Iterable<number>;
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}


export const File: React.FC<FileProps> = (props: FileProps) => {
    const index = props.index;
    const iterable = props.iterable;
    const subscribe = props.subscribe;
    const unsubscribe = props.unsubscribe;

    const iterator: Iterator<number> = useMemo(() => {
        return iterable[Symbol.iterator]();
    }, [iterable]);

    const [current, setCurrent] = useState<IteratorResult<number>>();


    useEffect(() =>  {
        const onNext = (): IteratorResult<number> =>  {
            const value = iterator.next();
            setCurrent({...value});
            return value;
        }
        subscribe(index, onNext);
        return function cleanup(): void {
            unsubscribe(index, onNext);
        }
    }, [index, iterator, subscribe, unsubscribe]);

    const name = `file${index}`;
    return <div>
        <h1>
            {name}
        </h1>
        {current &&  !current.done && <ul><li role='file'> {current.value}</li></ul>}
        </div>;
}




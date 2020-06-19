import React, {useState, useEffect} from "react";

import {Subscribe, Unsubscribe} from "./Subscribe";

import API from './api';

interface FileProps {
    index: number;
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
}


export const File: React.FC<FileProps> = (props: FileProps) => {
    const index = props.index;
    const subscribe = props.subscribe;
    const unsubscribe = props.unsubscribe;

    const [iterator, setIterator] = useState<Iterator<number>>();
    const [current, setCurrent] = useState<IteratorResult<number>>();
    useEffect(() => {
      let isMounted = true;
      async function fetchData(): Promise<void> {
        API.get(`/file/${index}`).then((result) => {
          if (isMounted) {
              const iterator = result.data[Symbol.iterator]()
              setIterator(iterator);
          }
        });
      }
      fetchData();
      return (): void => {
        isMounted = false;
        return;
      }
    }, [index]);


    useEffect(() => {
        if (iterator === undefined) {
            return;
        }
        const next = (): IteratorResult<number> =>  {
            const value = iterator.next();
            setCurrent({...value});
            return value;
        }
        subscribe(index, next);
        return function cleanup(): void {
            unsubscribe(index, next);
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




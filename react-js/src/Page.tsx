import React, {useState, useEffect, useMemo} from 'react';

import {useSubscriber} from './Subscribe';
import {File} from './File';
import {Output} from './Output';

import API from './api';


export const Page: React.FC = () =>   {
  const {iterators, subscribe, unsubscribe} = useSubscriber();
  const [count, setCount] = useState<number>(0);
  const [iterables, setIterables] = useState<Iterable<number>[]>([]);


  useEffect(() => {
      async function fetchData(): Promise<void> {
          const result = await API.get('/count');
          setCount(result.data);
      }
      fetchData();
  }, []);

  useEffect(() => {
      let isMounted = true;
      async function fetchData(): Promise<void> {
          for await (const fileId of [...Array(count).keys()]) {
              API.get(`/file/${fileId}`).then((result) => {
                  if (isMounted) {
                      setIterables(iterables => {
                          const newIterables = [...iterables];
                          newIterables[fileId] = result.data;
                          return newIterables;
                      });
                  }
              });
          }
      }
      fetchData();
      return () => isMounted = false;
  }, [count]);


  const files = useMemo(() => {
      return iterables.map((iterable, index) => {
        return <File key={index} index={index} iterable={iterable} subscribe={subscribe} unsubscribe={unsubscribe} />;
        });
  }, [iterables, subscribe, unsubscribe]);

  return (
    <div className="Page">
      {[...files]}
      <Output iterators={iterators}/>
    </div>
  );
}

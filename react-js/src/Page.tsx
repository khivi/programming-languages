import React, {useState, useEffect, useMemo} from 'react';

import {useSubscriber} from './Subscribe';
import {File} from './File';
import {Output} from './Output';

import API from './api';


export const Page: React.FC<void> = () =>   {
  const {iterators, subscribe, unsubscribe} = useSubscriber();
  const [count, setCount] = useState<number>(0);
  const [iterables, setIterables] = useState<Iterable<number>[]>([]);


  useEffect(() => {
      const fetchData =   async (): void => {
          const result: number = await API.get('/count');
          setCount(result.data);
      }
      fetchData();
  }, []);

  useEffect(() => {
      const fetchData =   async (): void => {
          for await (const fileId of [...Array(count).keys()]) {
              API.get(`/file/${fileId}`).then((result) => {
                  setIterables(iterables => {
                      const newIterables = [...iterables];
                      newIterables[fileId] = result.data;
                      return newIterables;
                  });
              });
          }
      }
      fetchData();
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

import React, {useState, useEffect, useMemo} from 'react';

import {useSubscriber} from './Subscribe';
import {File} from './File';
import {Output} from './Output';

import API from './api';


export const Page: React.FC = () =>   {
  const {nexts, subscribe, unsubscribe} = useSubscriber();
  const [count, setCount] = useState<number>(0);


  useEffect(() => {
      async function fetchData(): Promise<void> {
          const result = await API.get('/count');
          setCount(result.data);
      }
      fetchData();
  }, []);

  const files = useMemo(() => {
      return [...Array(count).keys()].map((iterable, index) => {
        return <File key={index} index={index} subscribe={subscribe} unsubscribe={unsubscribe} />;
        });
  }, [count, subscribe, unsubscribe]);

  return (
    <div>
      {[...files]}
      <Output nexts={nexts}/>
    </div>
  );
}

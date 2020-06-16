import React, {useMemo} from 'react';

import {useSubscriber} from './Subscribe';
import {File} from './File';
import {Output} from './Output';

interface PageProps {
    iterables: Iterable<number>[];
}


export const Page: React.FC<PageProps> = (props: PageProps) =>   {
  const iterables = props.iterables;
  const {iterators, subscribe, unsubscribe} = useSubscriber();


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
